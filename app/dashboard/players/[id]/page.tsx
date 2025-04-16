import { players, Player } from "@/app/data/players";
import { evaluations, Evaluation } from "@/app/data/evaluations";
import { attendance, Attendance } from "@/app/data/attendance";
import { Metadata } from "next";
import PlayerDetailsClient from "./PlayerDetailsClient";
// توابع کمکی برای کار با داده‌ها
const getPlayerById = (playerId: string): Player | undefined => {
  return players.find(player => player.id === playerId);
};

const getEvaluationsByPlayerId = (playerId: string): Evaluation[] => {
  return evaluations
    .filter(evaluation => evaluation.player_id === playerId)
    .sort((a, b) => new Date(b.evaluation_date).getTime() - new Date(a.evaluation_date).getTime());
};

const getAttendanceByPlayerId = (playerId: string): Attendance[] => {
  return attendance
    .filter(record => record.player_id === playerId)
    .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
};

const getPlayersIds = (): string[] => {
  return players.map(player => player.id);
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const player = getPlayerById(params.id);
  return {
    title: player ? `${player.name} | مدیریت تیم فوتبال` : "بازیکن یافت نشد",
  };
}

export async function generateStaticParams() {
  const playersIds = getPlayersIds();
  return playersIds.map((id: string) => ({
    id,
  }));
}

export default async function PlayerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch player data
  const player = getPlayerById(params.id);
  const playerEvaluations = getEvaluationsByPlayerId(params.id);
  const playerAttendance = getAttendanceByPlayerId(params.id);

  // Process evaluations data to calculate overall scores
  const processedEvaluations = playerEvaluations.map((evaluation: Evaluation) => {
    const scores = [
      evaluation.passing,
      evaluation.shooting,
      evaluation.dribbling,
      evaluation.technique,
      evaluation.tactical,
      evaluation.physical,
      evaluation.speed,
      evaluation.aerial,
      evaluation.defending,
      evaluation.morale,
    ];
    const overall = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
    return { ...evaluation, overall };
  });

  // Prepare data for radar chart
  const radarData = [];
  if (processedEvaluations.length > 0) {
    // Get latest evaluation
    const latestEvaluation = processedEvaluations[0];
    
    // Add radar chart data points
    radarData.push({ subject: "پاس", A: latestEvaluation.passing });
    radarData.push({ subject: "شوت", A: latestEvaluation.shooting });
    radarData.push({ subject: "دریبل", A: latestEvaluation.dribbling });
    radarData.push({ subject: "تکنیک", A: latestEvaluation.technique });
    radarData.push({ subject: "تاکتیک", A: latestEvaluation.tactical });
    radarData.push({ subject: "فیزیکی", A: latestEvaluation.physical });
    radarData.push({ subject: "سرعت", A: latestEvaluation.speed });
    radarData.push({ subject: "بازی هوایی", A: latestEvaluation.aerial });
    radarData.push({ subject: "دفاع", A: latestEvaluation.defending });
    radarData.push({ subject: "روحیه", A: latestEvaluation.morale });
  }

  // Pass props to the client component
  return (
    <PlayerDetailsClient 
      player={player} 
      playerEvaluations={processedEvaluations} 
      playerAttendance={playerAttendance}
      radarData={radarData}
    />
  );
}
