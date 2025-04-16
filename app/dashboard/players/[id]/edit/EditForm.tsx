"use client";

import { useState, useEffect } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { players } from "@/app/data/players";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "نام بازیکن باید حداقل ۳ کاراکتر باشد.",
  }),
  national_id: z
    .string()
    .min(10, {
      message: "کد ملی باید ۱۰ رقم باشد.",
    })
    .max(10),
  birth_date: z.string().min(1, {
    message: "تاریخ تولد الزامی است.",
  }),
  team: z.string().min(1, {
    message: "انتخاب تیم الزامی است.",
  }),
  position: z.string().min(1, {
    message: "انتخاب پست بازی الزامی است.",
  }),
  phone: z
    .string()
    .min(11, {
      message: "شماره تلفن معتبر وارد کنید.",
    })
    .max(11),
  height: z.string().optional(),
  weight: z.string().optional(),
});

export default function EditPlayerForm({ playerId }: { playerId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      national_id: "",
      birth_date: "",
      team: "",
      position: "",
      phone: "",
      height: "",
      weight: "",
    },
  });

  useEffect(() => {
    // Find the player from the hardcoded data instead of Supabase
    const player = players.find(p => p.id === playerId);

    if (player) {
      // Parse the data and set form values
      form.reset({
        name: player.name || "",
        national_id: player.national_id || "",
        birth_date: player.birth_date || "",
        team: player.team || "",
        position: player.position || "",
        phone: player.phone || "",
        height: player.height?.toString() || "",
        weight: player.weight?.toString() || "",
      });
      setIsFetching(false);
    } else {
      setError("بازیکن یافت نشد");
      setIsFetching(false);
    }
  }, [playerId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);

      // Since we're using hardcoded data, we'll simulate a successful update
      // In a real app, you would update the data here
      
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "اطلاعات بازیکن بروزرسانی شد",
        description: "اطلاعات بازیکن با موفقیت بروزرسانی شد.",
      });

      router.push(`/dashboard/players/${playerId}`);
      router.refresh();
    } catch (error: any) {
      console.error("خطا در بروزرسانی اطلاعات بازیکن:", error);
      setError("خطایی در بروزرسانی اطلاعات رخ داد. لطفاً دوباره تلاش کنید.");
      toast({
        title: "خطا",
        description: "خطایی در بروزرسانی اطلاعات رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>در حال بارگذاری اطلاعات بازیکن...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/players/${playerId}`)}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت
        </Button>
        <h1 className="text-3xl font-bold text-foreground">ویرایش اطلاعات بازیکن</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>مشخصات بازیکن</CardTitle>
          <CardDescription>
            اطلاعات بازیکن را ویرایش کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام و نام خانوادگی</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="نام و نام خانوادگی بازیکن"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="national_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>کد ملی</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاریخ تولد</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شماره تلفن</FormLabel>
                      <FormControl>
                        <Input placeholder="09123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تیم</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب تیم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="نونهالان">نونهالان</SelectItem>
                          <SelectItem value="نوجوانان">نوجوانان</SelectItem>
                          <SelectItem value="جوانان">جوانان</SelectItem>
                          <SelectItem value="بزرگسالان">بزرگسالان</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>پست بازی</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب پست بازی" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="دروازه‌بان">دروازه‌بان</SelectItem>
                          <SelectItem value="مدافع">مدافع</SelectItem>
                          <SelectItem value="هافبک">هافبک</SelectItem>
                          <SelectItem value="مهاجم">مهاجم</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قد (سانتی‌متر)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وزن (کیلوگرم)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between">
                <Button onClick={() => router.push(`/dashboard/players/${playerId}`)} variant="outline">
                  انصراف
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 