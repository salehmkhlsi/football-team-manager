"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { players } from "@/app/data/players";
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format, addMonths } from "date-fns";

interface Player {
  id: string;
  name: string;
  national_id: string;
  team: string;
}

interface Subscription {
  id: string;
  player_id: string;
  player_name: string;
  subscription_type: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "pending";
  payment_status: "paid" | "unpaid" | "partial";
  paid_amount: number;
}

const formSchema = z.object({
  player_id: z.string().min(1, {
    message: "انتخاب بازیکن الزامی است",
  }),
  subscription_type: z.string().min(1, {
    message: "انتخاب نوع اشتراک الزامی است",
  }),
  amount: z.string().min(1, {
    message: "مبلغ اشتراک را وارد کنید",
  }),
  start_date: z.string().min(1, {
    message: "تاریخ شروع اشتراک را وارد کنید",
  }),
  paid_amount: z.string().optional(),
});

export default function SubscriptionsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player_id: "",
      subscription_type: "ماهانه",
      amount: "",
      start_date: new Date().toISOString().split("T")[0],
      paid_amount: "",
    },
  });

  // فراخوانی لیست بازیکنان برای دراپ‌داون
  useEffect(() => {
    async function fetchPlayers() {
      try {
        setIsLoading(true);
        setPlayers(players || []);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات بازیکنان:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  // فراخوانی لیست اشتراک‌ها
  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        // Note: Since we don't have subscriptions data in the local data files,
        // we'll just keep an empty array here. In a real application, you might 
        // want to create a subscriptions.ts file similar to the other data files.
        setSubscriptions([]);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات اشتراک‌ها:", error);
      }
    }

    fetchSubscriptions();
  }, []);

  // وقتی بازیکن انتخاب می‌شود، اطلاعات آن را نمایش می‌دهیم
  const handlePlayerChange = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    setSelectedPlayer(player || null);
  };

  // محاسبه تاریخ پایان بر اساس نوع اشتراک
  const calculateEndDate = (startDate: string, type: string) => {
    const date = new Date(startDate);

    switch (type) {
      case "ماهانه":
        return format(addMonths(date, 1), "yyyy-MM-dd");
      case "سه ماهه":
        return format(addMonths(date, 3), "yyyy-MM-dd");
      case "شش ماهه":
        return format(addMonths(date, 6), "yyyy-MM-dd");
      case "سالانه":
        return format(addMonths(date, 12), "yyyy-MM-dd");
      default:
        return format(addMonths(date, 1), "yyyy-MM-dd");
    }
  };

  // تعیین وضعیت پرداخت
  const determinePaymentStatus = (amount: number, paidAmount: number) => {
    if (paidAmount >= amount) {
      return "paid";
    } else if (paidAmount > 0) {
      return "partial";
    } else {
      return "unpaid";
    }
  };

  // ثبت اشتراک جدید
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const amount = parseInt(values.amount);
      const paidAmount = values.paid_amount ? parseInt(values.paid_amount) : 0;
      const endDate = calculateEndDate(
        values.start_date,
        values.subscription_type
      );
      const paymentStatus = determinePaymentStatus(amount, paidAmount);

      // Instead of using supabase, we'll create a new subscription object and update the local state
      const newSubscription = {
        id: `sub_${Date.now()}`,
        player_id: values.player_id,
        player_name: players.find(p => p.id === values.player_id)?.name || "",
        subscription_type: values.subscription_type,
        amount: amount,
        start_date: values.start_date,
        end_date: endDate,
        status: "active" as "active" | "expired" | "pending",
        payment_status: paymentStatus as "paid" | "unpaid" | "partial",
        paid_amount: paidAmount,
      };

      setSubscriptions((prev) => [newSubscription, ...prev]);

      setShowAddDialog(false);
      form.reset();
    } catch (error) {
      console.error("خطا در ثبت اشتراک:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // فیلتر کردن اشتراک‌ها بر اساس جستجو
  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.player_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subscription.subscription_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت مالی و اشتراک‌ها</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              ثبت اشتراک جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>ثبت اشتراک جدید</DialogTitle>
              <DialogDescription>
                اطلاعات اشتراک جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="player_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>بازیکن</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePlayerChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب بازیکن" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} ({player.team})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPlayer && (
                  <div className="p-2 border rounded mb-2 text-sm">
                    <p>کد ملی: {selectedPlayer.national_id}</p>
                    <p>تیم: {selectedPlayer.team}</p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="subscription_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع اشتراک</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب نوع اشتراک" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ماهانه">ماهانه</SelectItem>
                          <SelectItem value="سه ماهه">سه ماهه</SelectItem>
                          <SelectItem value="شش ماهه">شش ماهه</SelectItem>
                          <SelectItem value="سالانه">سالانه</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مبلغ کل (تومان)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paid_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مبلغ پرداخت شده (تومان)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاریخ شروع</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "در حال ثبت..." : "ثبت اشتراک"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>جستجو و فیلتر</CardTitle>
          <CardDescription>
            جستجو بر اساس نام بازیکن یا نوع اشتراک
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لیست اشتراک‌ها</CardTitle>
          <CardDescription>
            {filteredSubscriptions.length} اشتراک
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">در حال بارگذاری...</p>
          ) : filteredSubscriptions.length === 0 ? (
            <p className="text-center py-4">هیچ اشتراکی یافت نشد.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام بازیکن</TableHead>
                  <TableHead>نوع اشتراک</TableHead>
                  <TableHead>تاریخ شروع</TableHead>
                  <TableHead>تاریخ پایان</TableHead>
                  <TableHead>مبلغ (تومان)</TableHead>
                  <TableHead>وضعیت پرداخت</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.player_name}
                    </TableCell>
                    <TableCell>{subscription.subscription_type}</TableCell>
                    <TableCell>
                      {format(new Date(subscription.start_date), "yyyy/MM/dd")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscription.end_date), "yyyy/MM/dd")}
                    </TableCell>
                    <TableCell>
                      {subscription.amount.toLocaleString()}
                      {subscription.payment_status === "partial" &&
                        ` (${subscription.paid_amount.toLocaleString()} پرداخت شده)`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {subscription.payment_status === "paid" ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span>پرداخت شده</span>
                          </>
                        ) : subscription.payment_status === "partial" ? (
                          <>
                            <div className="mr-2 h-4 w-4 bg-yellow-500 rounded-full" />
                            <span>پرداخت ناقص</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            <span>پرداخت نشده</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          subscription.status === "active"
                            ? "bg-green-100 text-green-700"
                            : subscription.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {subscription.status === "active"
                          ? "فعال"
                          : subscription.status === "pending"
                          ? "در انتظار"
                          : "منقضی شده"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/players/${subscription.player_id}`
                              )
                            }
                          >
                            مشاهده پروفایل بازیکن
                          </DropdownMenuItem>
                          <DropdownMenuItem>ویرایش اشتراک</DropdownMenuItem>
                          <DropdownMenuItem>ثبت پرداخت</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
