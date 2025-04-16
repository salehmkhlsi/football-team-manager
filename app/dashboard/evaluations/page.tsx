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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Search, Calendar, Filter, BarChart4 } from "lucide-react";
import { evaluations } from "@/app/data/evaluations";
import { players } from "@/app/data/players";

interface EnrichedEvaluation {
  id: string;
  player_id: string;
  player_name: string;
  team: string;
  position: string;
  passing: number;
  shooting: number;
  dribbling: number;
  technique: number;
  tactical: number;
  physical: number;
  speed: number;
  aerial: number;
  defending: number;
  morale: number;
  evaluation_date: string;
  overall_rating: number;
}

export default function EvaluationsPage() {
  const [enrichedEvaluations, setEnrichedEvaluations] = useState<EnrichedEvaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<EnrichedEvaluation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate data loading delay
    setTimeout(() => {
      const processedEvaluations: EnrichedEvaluation[] = evaluations.map(evaluation => {
        const player = players.find(p => p.id === evaluation.player_id) || { 
          name: "نامشخص", 
          team: "نامشخص", 
          position: "نامشخص" 
        };
        
        return {
          ...evaluation,
          player_name: player.name,
          team: player.team,
          position: player.position,
          overall_rating: evaluation.overall || 0
        };
      });

      setEnrichedEvaluations(processedEvaluations);
      setFilteredEvaluations(processedEvaluations);
      setIsLoading(false);
    }, 500); // 500ms delay to simulate network request
  }, []);

  // اعمال فیلترها
  useEffect(() => {
    let result = [...enrichedEvaluations];
    
    // فیلتر بر اساس جستجو
    if (searchQuery) {
      result = result.filter(
        (evaluation) =>
          evaluation.player_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // فیلتر بر اساس تیم
    if (teamFilter && teamFilter !== "all") {
      result = result.filter(
        (evaluation) => evaluation.team === teamFilter
      );
    }
    
    setFilteredEvaluations(result);
  }, [searchQuery, teamFilter, enrichedEvaluations]);

  // استخراج لیست تیم‌ها برای فیلتر
  const teams = Array.from(new Set(enrichedEvaluations.map(e => e.team))).filter(Boolean);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">مدیریت ارزیابی‌ها</h1>
        <Button onClick={() => router.push("/dashboard/evaluations/analysis")}>
          <BarChart4 className="mr-2 h-4 w-4" />
          تحلیل و مقایسه
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>جستجو و فیلتر</CardTitle>
          <CardDescription>
            در میان ارزیابی‌های بازیکنان جستجو کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی نام بازیکن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={teamFilter}
              onValueChange={setTeamFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="فیلتر بر اساس تیم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه تیم‌ها</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لیست ارزیابی‌ها</CardTitle>
          <CardDescription>{filteredEvaluations.length} ارزیابی</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">در حال بارگذاری...</p>
          ) : filteredEvaluations.length === 0 ? (
            <p className="text-center py-4">هیچ ارزیابی‌ای یافت نشد.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام بازیکن</TableHead>
                  <TableHead>تیم</TableHead>
                  <TableHead>تاریخ ارزیابی</TableHead>
                  <TableHead className="text-center">امتیاز کلی</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.player_name}</TableCell>
                    <TableCell>{evaluation.team}</TableCell>
                    <TableCell dir="ltr" className="text-right">{evaluation.evaluation_date}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">
                        {evaluation.overall_rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          router.push(`/dashboard/players/${evaluation.player_id}`)
                        }
                      >
                        مشاهده بازیکن
                      </Button>
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