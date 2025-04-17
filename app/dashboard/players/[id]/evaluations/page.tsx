"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
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
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowRight, Plus } from "lucide-react";

// وارد کردن لیست بازیکنان
import { players } from "@/app/data";

// تابع generateStaticParams برای تولید مسیرهای استاتیک
export function generateStaticParams() {
  return players.map(player => ({
    id: player.id,
  }));
}

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
}

interface Evaluation {
  id: string;
  player_id: string;
  passing: number;
  shooting: number;
  dribbling: number;
  technique: number;
  tactical: number;
  physical: number;
  speed: number;
  aerial: number;
  defending: number;
  personality: number;
  evaluation_date: string;
  notes: string | null;
  overall: number;
}

export default function PlayerEvaluationsPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;
  const supabase = createClientComponentClient();

  const [player, setPlayer] = useState<Player | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // فراخوانی اطلاعات بازیکن
        const { data: playerData, error: playerError } = await supabase
          .from("players")
          .select("id, name, team, position")
          .eq("id", playerId)
          .single();

        if (playerError) throw playerError;
        setPlayer(playerData);

        // فراخوانی ارزیابی‌های بازیکن
        const { data: evalData, error: evalError } = await supabase
          .from("evaluations")
          .select("*")
          .eq("player_id", playerId)
          .order("evaluation_date", { ascending: false });

        if (evalError) throw evalError;

        // اضافه کردن محاسبه امتیاز کلی
        const processedEvaluations = evalData?.map(evaluation => {
          const overall = Math.round(
            (evaluation.passing +
              evaluation.shooting +
              evaluation.dribbling +
              evaluation.technique +
              evaluation.tactical +
              evaluation.physical +
              evaluation.speed +
              evaluation.aerial +
              evaluation.defending +
              evaluation.personality) / 10
          );
          return { ...evaluation, overall };
        }) || [];

        setEvaluations(processedEvaluations);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (playerId) {
      fetchData();
    }
  }, [playerId]);

  // داده‌های نمودار خطی روند پیشرفت کلی
  const getProgressChartData = () => {
    return [...evaluations]
      .sort((a, b) => new Date(a.evaluation_date).getTime() - new Date(b.evaluation_date).getTime())
      .map(evaluation => ({
        date: evaluation.evaluation_date,
        امتیاز: evaluation.overall
      }));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">بازیکن مورد نظر یافت نشد!</p>
        <Button onClick={() => router.push("/dashboard/players")}>
          بازگشت به لیست بازیکنان
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/dashboard/players/${playerId}`)}
            className="ml-2"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            بازگشت
          </Button>
          <h1 className="text-3xl font-bold">ارزیابی‌های {player.name}</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/players/${playerId}/evaluations/add`)}>
          <Plus className="h-4 w-4 ml-2" />
          ارزیابی جدید
        </Button>
      </div>

      {evaluations.length > 0 ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>روند پیشرفت</CardTitle>
              <CardDescription>
                نمودار روند پیشرفت کلی بازیکن در طول زمان
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getProgressChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="امتیاز"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تاریخچه ارزیابی‌ها</CardTitle>
              <CardDescription>
                {evaluations.length} ارزیابی ثبت شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">تاریخ ارزیابی</TableHead>
                    <TableHead className="text-center">امتیاز کلی</TableHead>
                    <TableHead className="text-center">پاس</TableHead>
                    <TableHead className="text-center">شوت</TableHead>
                    <TableHead className="text-center">دریبل</TableHead>
                    <TableHead className="text-center">تکنیک</TableHead>
                    <TableHead className="text-center">تاکتیک</TableHead>
                    <TableHead className="text-center">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="text-center">{evaluation.evaluation_date}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">
                          {evaluation.overall}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{evaluation.passing}</TableCell>
                      <TableCell className="text-center">{evaluation.shooting}</TableCell>
                      <TableCell className="text-center">{evaluation.dribbling}</TableCell>
                      <TableCell className="text-center">{evaluation.technique}</TableCell>
                      <TableCell className="text-center">{evaluation.tactical}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // در نسخه‌های بعدی می‌توان صفحه جزئیات ارزیابی را اضافه کرد
                            alert(evaluation.notes || "بدون یادداشت");
                          }}
                        >
                          جزئیات
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="mb-4">هنوز هیچ ارزیابی برای این بازیکن ثبت نشده است.</p>
            <Button onClick={() => router.push(`/dashboard/players/${playerId}/evaluations/add`)}>
              <Plus className="h-4 w-4 ml-2" />
              ثبت اولین ارزیابی
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 