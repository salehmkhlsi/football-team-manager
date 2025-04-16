"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { players } from "@/app/data/players";
import { evaluations } from "@/app/data/evaluations";
import { attendance } from "@/app/data/attendance";
import { Users, ClipboardList, CalendarIcon, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  totalPlayers: number;
  totalEvaluations: number;
  totalAttendance: number;
  playersCountByTeam: {
    name: string;
    count: number;
  }[];
  recentPlayers: {
    id: string;
    name: string;
    team: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPlayers: 0,
    totalEvaluations: 0,
    totalAttendance: 0,
    playersCountByTeam: [],
    recentPlayers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);

        // دریافت تعداد کل بازیکنان
        const playersCount = players.length;

        // دریافت تعداد کل ارزیابی‌ها
        const evaluationsCount = evaluations.length;

        // دریافت تعداد کل حضور و غیاب‌ها
        const attendanceCount = attendance.length;

        // دریافت تعداد بازیکنان در هر تیم
        const teamsCount: Record<string, number> = {};
        players.forEach((player) => {
          if (player.team) {
            teamsCount[player.team] = (teamsCount[player.team] || 0) + 1;
          }
        });

        const playersCountByTeam = Object.keys(teamsCount).map((teamName) => ({
          name: teamName,
          count: teamsCount[teamName],
        }));

        // دریافت آخرین بازیکنان ثبت‌شده
        const recentPlayers = players
          .slice(0, 5)
          .map(player => ({
            id: player.id,
            name: player.name,
            team: player.team
          }));

        setStats({
          totalPlayers: playersCount || 0,
          totalEvaluations: evaluationsCount || 0,
          totalAttendance: attendanceCount || 0,
          playersCountByTeam,
          recentPlayers: recentPlayers || [],
        });
      } catch (error) {
        console.error("خطا در دریافت آمار:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">داشبورد</h1>
        <p className="text-muted-foreground">خلاصه وضعیت آکادمی فوتبال</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد کل بازیکنان
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground mt-1">در تمام تیم‌ها</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد ارزیابی‌ها
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ارزیابی فنی ثبت شده
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              رکوردهای حضور و غیاب
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              جلسات تمرینی ثبت شده
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              بیشترین بازیکن
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.playersCountByTeam.length > 0
                ? stats.playersCountByTeam.reduce((max, team) =>
                    team.count > max.count ? team : max
                  ).name
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              تیم با بیشترین بازیکن
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>آمار بازیکنان بر اساس تیم</CardTitle>
            <CardDescription>تعداد بازیکنان در هر تیم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.playersCountByTeam}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="تعداد" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>بازیکنان اخیر</CardTitle>
            <CardDescription>5 بازیکن اخیر ثبت شده در سیستم</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPlayers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        تیم: {player.team}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/players/${player.id}`)
                      }
                    >
                      مشاهده
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8">هیچ بازیکنی یافت نشد.</p>
            )}

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/players")}
              >
                مشاهده همه بازیکنان
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>عملیات سریع</CardTitle>
            <CardDescription>دسترسی سریع به عملیات پرکاربرد</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard/players/add")}
              >
                افزودن بازیکن جدید
              </Button>
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard/attendance")}
              >
                ثبت حضور و غیاب
              </Button>
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard/players")}
              >
                مدیریت بازیکنان
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>راهنمای سریع</CardTitle>
            <CardDescription>نحوه کار با سیستم</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>ابتدا بازیکنان را در سیستم ثبت کنید</li>
              <li>ارزیابی‌های فنی برای هر بازیکن ثبت کنید</li>
              <li>به صورت منظم حضور و غیاب را ثبت نمایید</li>
              <li>از گزارش‌ها جهت پیگیری پیشرفت استفاده کنید</li>
              <li>اطلاعات را به‌روز نگه دارید</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
