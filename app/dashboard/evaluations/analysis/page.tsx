"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart4, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { players as playersData } from "@/app/data/players";
import { evaluations as evaluationsData } from "@/app/data/evaluations";

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
  morale: number;
  evaluation_date: string;
  notes: string | null;
}

export default function AnalysisPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation[]>>({});
  const [teamFilter, setTeamFilter] = useState<string>("ALL_TEAMS");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // فراخوانی لیست بازیکنان
  useEffect(() => {
    // Simulate data loading delay
    setTimeout(() => {
      // Filter players based on team filter
      let filteredPlayers = [...playersData];
      
      if (teamFilter && teamFilter !== "ALL_TEAMS") {
        filteredPlayers = filteredPlayers.filter(player => player.team === teamFilter);
      }
      
      setPlayers(filteredPlayers);
      setIsLoading(false);
    }, 300);
  }, [teamFilter]);

  // فراخوانی ارزیابی‌ها بر اساس بازیکنان انتخاب شده
  useEffect(() => {
    if (selectedPlayers.length === 0) {
      setEvaluations({});
      return;
    }

    // Simulate data loading delay
    setTimeout(() => {
      setIsLoading(true);
      
      const evaluationsByPlayer: Record<string, Evaluation[]> = {};
      
      // Process evaluations for each selected player
      selectedPlayers.forEach((playerId) => {
        const playerEvaluations = evaluationsData
          .filter(evaluation => evaluation.player_id === playerId)
          .sort((a, b) => new Date(a.evaluation_date).getTime() - new Date(b.evaluation_date).getTime());
          
        evaluationsByPlayer[playerId] = playerEvaluations;
      });
      
      setEvaluations(evaluationsByPlayer);
      setIsLoading(false);
    }, 300);
  }, [selectedPlayers]);

  // استخراج لیست تیم‌ها برای فیلتر
  const teams = [...new Set(players.map(p => p.team))].filter(Boolean);

  // تبدیل داده‌ها برای نمودار راداری
  const getRadarChartData = () => {
    if (selectedPlayers.length === 0) return [];
    
    const skills = [
      "passing", "shooting", "dribbling", "technique", "tactical",
      "physical", "speed", "aerial", "defending", "morale"
    ];
    
    const skillLabels = {
      passing: "پاس",
      shooting: "شوت",
      dribbling: "دریبل",
      technique: "تکنیک",
      tactical: "تاکتیک",
      physical: "فیزیک",
      speed: "سرعت",
      aerial: "بازی هوایی",
      defending: "دفاع",
      morale: "روحیه"
    };
    
    return skills.map(skill => {
      const skillData: Record<string, any> = {
        skill: skillLabels[skill as keyof typeof skillLabels],
      };
      
      selectedPlayers.forEach(playerId => {
        const playerEvals = evaluations[playerId];
        if (playerEvals && playerEvals.length > 0) {
          // آخرین ارزیابی بازیکن
          const latestEval = playerEvals[playerEvals.length - 1];
          const player = players.find(p => p.id === playerId);
          if (player) {
            skillData[player.name] = latestEval[skill as keyof Evaluation] as number;
          }
        }
      });
      
      return skillData;
    });
  };

  // تبدیل داده‌ها برای نمودار ستونی
  const getBarChartData = () => {
    if (selectedPlayers.length === 0) return [];
    
    return selectedPlayers.map(playerId => {
      const playerEvals = evaluations[playerId];
      const player = players.find(p => p.id === playerId);
      
      if (!player || !playerEvals || playerEvals.length === 0) {
        return { name: "نامشخص" };
      }
      
      // آخرین ارزیابی بازیکن
      const latestEval = playerEvals[playerEvals.length - 1];
      
      // محاسبه میانگین امتیازات
      const overall = Math.round(
        (latestEval.passing + 
         latestEval.shooting + 
         latestEval.dribbling + 
         latestEval.technique + 
         latestEval.tactical + 
         latestEval.physical + 
         latestEval.speed + 
         latestEval.aerial + 
         latestEval.defending + 
         latestEval.morale) / 10
      );
      
      return {
        name: player.name,
        overall,
        passing: latestEval.passing,
        shooting: latestEval.shooting,
        dribbling: latestEval.dribbling,
        technique: latestEval.technique,
        tactical: latestEval.tactical,
        physical: latestEval.physical,
        speed: latestEval.speed,
        aerial: latestEval.aerial,
        defending: latestEval.defending,
        morale: latestEval.morale,
      };
    });
  };

  // تبدیل داده‌ها برای نمودار روند
  const getTrendChartData = () => {
    if (selectedPlayers.length === 0 || !selectedPlayers[0] || !evaluations[selectedPlayers[0]]) {
      return [];
    }
    
    // فقط اولین بازیکن انتخاب شده را نمایش می‌دهیم
    const playerId = selectedPlayers[0];
    const playerEvals = evaluations[playerId];
    
    return playerEvals.map(evaluation => {
      // محاسبه میانگین امتیازات
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
         evaluation.morale) / 10
      );
      
      // تبدیل تاریخ به فرمت مناسب
      const date = new Date(evaluation.evaluation_date);
      const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      
      return {
        date: formattedDate,
        overall,
        passing: evaluation.passing,
        shooting: evaluation.shooting,
        dribbling: evaluation.dribbling,
        technique: evaluation.technique,
        tactical: evaluation.tactical,
        physical: evaluation.physical,
        speed: evaluation.speed,
        aerial: evaluation.aerial,
        defending: evaluation.defending,
        morale: evaluation.morale,
      };
    });
  };

  // مدیریت انتخاب/عدم انتخاب بازیکن
  const handleTogglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  // اطلاعات رنگ‌ها برای نمودار
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/evaluations")}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت
        </Button>
        <h1 className="text-3xl font-bold">تحلیل و مقایسه ارزیابی‌ها</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>انتخاب بازیکنان</CardTitle>
          <CardDescription>
            حداکثر 3 بازیکن را برای مقایسه انتخاب کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Select
                value={teamFilter}
                onValueChange={setTeamFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="فیلتر بر اساس تیم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_TEAMS">همه تیم‌ها</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {isLoading ? (
                <p>در حال بارگذاری...</p>
              ) : players.length === 0 ? (
                <p>هیچ بازیکنی یافت نشد.</p>
              ) : (
                players.map((player) => (
                  <Button
                    key={player.id}
                    variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleTogglePlayerSelection(player.id)}
                  >
                    <span className="truncate">{player.name}</span>
                    <span className="mr-2 text-xs opacity-70">({player.team})</span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPlayers.length > 0 && (
        <Tabs defaultValue="radar">
          <TabsList className="mb-4">
            <TabsTrigger value="radar">نمودار مهارت‌ها</TabsTrigger>
            <TabsTrigger value="bar">مقایسه عملکرد</TabsTrigger>
            <TabsTrigger value="trend" disabled={selectedPlayers.length !== 1}>روند پیشرفت</TabsTrigger>
          </TabsList>

          <TabsContent value="radar">
            <Card>
              <CardHeader>
                <CardTitle>مقایسه مهارت‌های بازیکنان</CardTitle>
                <CardDescription>
                  نمودار راداری برای مقایسه مهارت‌های بازیکنان انتخاب شده
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarChartData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      {selectedPlayers.map((playerId, index) => {
                        const player = players.find(p => p.id === playerId);
                        if (!player) return null;
                        
                        return (
                          <Radar
                            key={player.id}
                            name={player.name}
                            dataKey={player.name}
                            stroke={colors[index]}
                            fill={colors[index]}
                            fillOpacity={0.6}
                          />
                        );
                      })}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle>مقایسه عملکرد کلی</CardTitle>
                <CardDescription>
                  نمودار مقایسه‌ای عملکرد کلی بازیکنان انتخاب شده
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="overall" fill="#8884d8" name="امتیاز کلی" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>روند پیشرفت بازیکن</CardTitle>
                <CardDescription>
                  {selectedPlayers.length === 1 && players.find(p => p.id === selectedPlayers[0])?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getTrendChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="overall" stroke="#8884d8" name="امتیاز کلی" />
                      <Line type="monotone" dataKey="passing" stroke="#82ca9d" name="پاس" />
                      <Line type="monotone" dataKey="shooting" stroke="#ffc658" name="شوت" />
                      <Line type="monotone" dataKey="dribbling" stroke="#ff8042" name="دریبل" />
                      <Line type="monotone" dataKey="technique" stroke="#0088fe" name="تکنیک" />
                      <Line type="monotone" dataKey="morale" stroke="#ff00ff" name="روحیه" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 