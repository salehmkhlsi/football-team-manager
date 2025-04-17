"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { ArrowRight, Edit, ClipboardList } from "lucide-react";
import { Player } from "@/app/data/players";
import { Evaluation } from "@/app/data/evaluations";
import { Attendance } from "@/app/data/attendance";

interface PlayerDetailsClientProps {
  player: Player | null;
  playerEvaluations: Evaluation[];
  playerAttendance: Attendance[];
  radarData: any[];
}

export default function PlayerDetailsClient({ 
  player, 
  playerEvaluations, 
  playerAttendance, 
  radarData 
}: PlayerDetailsClientProps) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR').format(date);
    } catch (error) {
      return dateString;
    }
  };

  if (!player) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">بازیکن یافت نشد</h2>
              <p className="mb-4">بازیکن مورد نظر در سیستم ثبت نشده است.</p>
              <Button onClick={() => router.push('/dashboard/players')}>
                <ArrowRight className="h-4 w-4 ml-2" />
                بازگشت به لیست بازیکنان
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/players")}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت
        </Button>
        <h1 className="text-3xl font-bold">پروفایل بازیکن</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>اطلاعات بازیکن</CardTitle>
            <CardDescription>مشخصات فردی و ورزشی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">نام و نام خانوادگی</h3>
                <p className="text-gray-600">{player.name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">کد ملی</h3>
                <p className="text-gray-600">{player.national_id}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">تاریخ تولد</h3>
                <p className="text-gray-600">{formatDate(player.birth_date)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">تیم</h3>
                <p className="text-gray-600">{player.team}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">پست بازی</h3>
                <p className="text-gray-600">{player.position}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">شماره تماس</h3>
                <p className="text-gray-600">{player.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">قد</h3>
                <p className="text-gray-600">
                  {player.height ? `${player.height} سانتی‌متر` : "-"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">وزن</h3>
                <p className="text-gray-600">
                  {player.weight ? `${player.weight} کیلوگرم` : "-"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => router.push(`/dashboard/players/${player.id}/edit`)}
                variant="outline"
                className="ml-2"
              >
                <Edit className="h-4 w-4 ml-2" />
                ویرایش اطلاعات
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عملکرد کلی</CardTitle>
            <CardDescription>میانگین ارزیابی‌های فنی</CardDescription>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name={player.name}
                      dataKey="A"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>ارزیابی فنی ثبت نشده است</p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => router.push(`/dashboard/players/${player.id}/evaluations/add`)}
                variant="outline"
              >
                <ClipboardList className="h-4 w-4 ml-2" />
                افزودن ارزیابی جدید
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evaluations" className="mt-6">
        <TabsList>
          <TabsTrigger value="evaluations">ارزیابی‌های فنی</TabsTrigger>
          <TabsTrigger value="attendance">حضور و غیاب</TabsTrigger>
        </TabsList>
        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه ارزیابی‌های فنی</CardTitle>
              <CardDescription>نتایج ارزیابی‌های فنی بازیکن در تمرینات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="border-collapse w-full text-center">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-right">تاریخ</th>
                      <th className="border p-2 text-center">پاس</th>
                      <th className="border p-2 text-center">شوت</th>
                      <th className="border p-2 text-center">دریبل</th>
                      <th className="border p-2 text-center">تکنیک</th>
                      <th className="border p-2 text-center">تاکتیک</th>
                      <th className="border p-2 text-center">فیزیکی</th>
                      <th className="border p-2 text-center">سرعت</th>
                      <th className="border p-2 text-center">هوایی</th>
                      <th className="border p-2 text-center">دفاع</th>
                      <th className="border p-2 text-center">روحیه</th>
                      <th className="border p-2 text-center">کلی</th>
                      <th className="border p-2 text-center">جزئیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerEvaluations.length > 0 ? (
                      playerEvaluations.map((evaluation) => (
                        <tr key={evaluation.id}>
                          <td className="border p-2 text-right">
                            {formatDate(evaluation.evaluation_date)}
                          </td>
                          <td className="border p-2 text-center">{evaluation.passing}</td>
                          <td className="border p-2 text-center">{evaluation.shooting}</td>
                          <td className="border p-2 text-center">{evaluation.dribbling}</td>
                          <td className="border p-2 text-center">{evaluation.technique}</td>
                          <td className="border p-2 text-center">{evaluation.tactical}</td>
                          <td className="border p-2 text-center">{evaluation.physical}</td>
                          <td className="border p-2 text-center">{evaluation.speed}</td>
                          <td className="border p-2 text-center">{evaluation.aerial}</td>
                          <td className="border p-2 text-center">{evaluation.defending}</td>
                          <td className="border p-2 text-center">{evaluation.morale}</td>
                          <td className="border p-2 text-center font-bold">
                            {evaluation.overall}
                          </td>
                          <td className="border p-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/players/${player.id}/evaluations/${evaluation.id}`
                                )
                              }
                            >
                              مشاهده
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={13} className="border p-4 text-center">
                          هیچ ارزیابی ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => router.push(`/dashboard/players/${player.id}/evaluations/add`)}
                >
                  <ClipboardList className="h-4 w-4 ml-2" />
                  ثبت ارزیابی جدید
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه حضور و غیاب</CardTitle>
              <CardDescription>وضعیت حضور بازیکن در جلسات تمرین</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="border-collapse w-full text-center">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-right">تاریخ جلسه</th>
                      <th className="border p-2 text-center">وضعیت</th>
                      <th className="border p-2 text-right">توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerAttendance.length > 0 ? (
                      playerAttendance.map((record) => (
                        <tr key={record.id}>
                          <td className="border p-2 text-right">
                            {formatDate(record.session_date)}
                          </td>
                          <td className="border p-2 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {record.status === "present"
                                ? "حاضر"
                                : record.status === "absent"
                                ? "غایب"
                                : "با تأخیر"}
                            </span>
                          </td>
                          <td className="border p-2 text-right">
                            {record.notes || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="border p-4 text-center">
                          هیچ سابقه حضور و غیابی ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 