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
import { Textarea } from "@/components/ui/textarea";
import { players as mockPlayers } from "@/app/data/players";
import { Check, X, Clock } from "lucide-react";
import { format } from "date-fns";

// Remove Database interface as it's not needed
// interface Database {}

interface Player {
  id: string;
  name: string;
  team: string;
}

interface AttendanceData {
  playerId: string;
  status: "present" | "absent" | "late";
  notes: string;
}

const formSchema = z.object({
  session_date: z.string().min(1, {
    message: "تاریخ جلسه را انتخاب کنید.",
  }),
  team: z.string().min(1, {
    message: "تیم را انتخاب کنید.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// تعریف تایپ برای پارامتر field در رندر FormField
interface FieldProps {
  onChange: (value: any) => void;
  onBlur: () => void;
  value: any;
  name: string;
  ref?: React.Ref<any>;
}

export default function AttendancePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: AttendanceData;
  }>({});
  // Remove Supabase client
  // const supabase = createClientComponentClient<Database>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      session_date: new Date().toISOString().split("T")[0],
      team: "",
    },
  });

  const watchTeam = form.watch("team");
  const watchDate = form.watch("session_date");

  // فراخوانی لیست بازیکنان براساس تیم انتخاب شده
  useEffect(() => {
    async function fetchPlayers() {
      if (!watchTeam) return;

      try {
        setIsLoading(true);
        // Use mock data instead of Supabase
        const filteredPlayers = mockPlayers.filter(player => player.team === watchTeam);
        
        setPlayers(filteredPlayers || []);

        // بررسی اطلاعات حضور و غیاب قبلی برای این تیم و تاریخ
        if (filteredPlayers && filteredPlayers.length > 0) {
          // For mock data, just create default attendance data for each player
          const attendanceMap: { [key: string]: AttendanceData } = {};
          
          filteredPlayers.forEach((player) => {
            attendanceMap[player.id] = {
              playerId: player.id,
              status: "present",
              notes: "",
            };
          });

          setAttendanceData(attendanceMap);
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات بازیکنان:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayers();
  }, [watchTeam, watchDate]);

  // تغییر وضعیت حضور بازیکن
  const handleStatusChange = (
    playerId: string,
    status: "present" | "absent" | "late"
  ) => {
    setAttendanceData((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        status,
      },
    }));
  };

  // تغییر یادداشت بازیکن
  const handleNotesChange = (playerId: string, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        notes,
      },
    }));
  };

  // ثبت حضور و غیاب
  const handleSaveAttendance = async () => {
    if (!watchTeam || !watchDate || Object.keys(attendanceData).length === 0) {
      return;
    }

    try {
      setIsSaving(true);

      // Mock saving data (just log to console)
      console.log("Saving attendance data:", {
        date: watchDate,
        team: watchTeam,
        attendance: Object.values(attendanceData).map((data) => ({
          player_id: data.playerId,
          session_date: watchDate,
          status: data.status,
          notes: data.notes || null,
        }))
      });

      // Simulate delay
      setTimeout(() => {
        setIsSaving(false);
        alert("حضور و غیاب با موفقیت ثبت شد");
      }, 500);
    } catch (error) {
      console.error("خطا در ثبت حضور و غیاب:", error);
      alert("خطا در ثبت حضور و غیاب");
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">مدیریت حضور و غیاب</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>انتخاب تیم و تاریخ</CardTitle>
          <CardDescription>
            تیم و تاریخ جلسه تمرین را انتخاب کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="team"
                  render={
                    // @ts-ignore
                    ({ field }) => (
                      <FormItem>
                        <FormLabel>تیم</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                    )
                  }
                />

                <FormField
                  control={form.control}
                  name="session_date"
                  render={
                    // @ts-ignore
                    ({ field }) => (
                      <FormItem>
                        <FormLabel>تاریخ جلسه</FormLabel>
                        <FormControl>
                          <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">
          <p>در حال بارگذاری...</p>
        </div>
      ) : watchTeam && players.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>ثبت حضور و غیاب تیم {watchTeam}</CardTitle>
            <CardDescription>
              {format(new Date(watchDate), "yyyy/MM/dd")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ردیف</TableHead>
                  <TableHead>نام بازیکن</TableHead>
                  <TableHead className="text-center">حاضر</TableHead>
                  <TableHead className="text-center">غایب</TableHead>
                  <TableHead className="text-center">تاخیر</TableHead>
                  <TableHead className="w-[300px]">یادداشت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={
                          attendanceData[player.id]?.status === "present"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleStatusChange(player.id, "present")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={
                          attendanceData[player.id]?.status === "absent"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleStatusChange(player.id, "absent")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={
                          attendanceData[player.id]?.status === "late"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleStatusChange(player.id, "late")}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="یادداشت مربی..."
                        className="h-8 min-h-8"
                        value={attendanceData[player.id]?.notes || ""}
                        onChange={(e) =>
                          handleNotesChange(player.id, e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveAttendance} disabled={isSaving}>
                {isSaving ? "در حال ذخیره..." : "ثبت حضور و غیاب"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : watchTeam ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p>هیچ بازیکنی در این تیم وجود ندارد.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
