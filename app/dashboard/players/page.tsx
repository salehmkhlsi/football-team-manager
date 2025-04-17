"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PlusCircle, Search } from "lucide-react";

// وارد کردن داده‌های ثابت
import { players, Player } from "@/app/data";

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // فیلتر کردن بازیکنان بر اساس جستجو
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.national_id.includes(searchQuery) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">بازیکنان</h1>
        <Button onClick={() => router.push("/dashboard/players/add")}>
          <PlusCircle className="h-4 w-4 ml-2" />
          افزودن بازیکن
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست بازیکنان</CardTitle>
          <CardDescription>
            مدیریت اطلاعات بازیکنان و مشاهده جزییات عملکرد
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام، کد ملی یا تیم بازیکن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>در حال بارگذاری...</p>
            </div>
          ) : (
            <Table className="text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">نام بازیکن</TableHead>
                  <TableHead className="text-center">کد ملی</TableHead>
                  <TableHead className="text-center">تاریخ تولد</TableHead>
                  <TableHead className="text-center">تیم</TableHead>
                  <TableHead className="text-center">پست بازی</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      بازیکنی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="text-center">{player.name}</TableCell>
                      <TableCell className="text-center">{player.national_id}</TableCell>
                      <TableCell className="text-center">{player.birth_date}</TableCell>
                      <TableCell className="text-center">{player.team}</TableCell>
                      <TableCell className="text-center">{player.position}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="link"
                          onClick={() =>
                            router.push(`/dashboard/players/${player.id}`)
                          }
                        >
                          مشاهده
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
