// صادر کردن همه داده‌ها از یک مکان مرکزی

export * from "./players";
export * from "./evaluations";
export * from "./attendance";

// توابع کمکی برای کار با داده‌ها
import { Player } from "./players";
import { Evaluation } from "./evaluations";
import { Attendance } from "./attendance";

/**
 * یافتن بازیکن با شناسه
 */
export const getPlayerById = (
  playerId: string,
  players: Player[]
): Player | undefined => {
  return players.find((player) => player.id === playerId);
};

/**
 * یافتن ارزیابی‌های یک بازیکن
 */
export const getPlayerEvaluations = (
  playerId: string,
  evaluations: Evaluation[]
): Evaluation[] => {
  return evaluations.filter((evaluation) => evaluation.player_id === playerId);
};

/**
 * یافتن حضور و غیاب یک بازیکن
 */
export const getPlayerAttendance = (
  playerId: string,
  attendanceRecords: Attendance[]
): Attendance[] => {
  return attendanceRecords.filter((record) => record.player_id === playerId);
};

/**
 * فیلتر کردن بازیکنان بر اساس تیم
 */
export const filterPlayersByTeam = (
  team: string,
  players: Player[]
): Player[] => {
  return players.filter((player) => player.team === team);
};

/**
 * محاسبه آمار حضور و غیاب یک بازیکن
 */
export const calculateAttendanceStats = (
  playerId: string,
  attendanceRecords: Attendance[]
) => {
  const playerRecords = getPlayerAttendance(playerId, attendanceRecords);
  const total = playerRecords.length;

  if (total === 0)
    return { presentPercentage: 0, absentPercentage: 0, latePercentage: 0 };

  const present = playerRecords.filter(
    (record) => record.status === "present"
  ).length;
  const absent = playerRecords.filter(
    (record) => record.status === "absent"
  ).length;
  const late = playerRecords.filter(
    (record) => record.status === "late"
  ).length;

  return {
    presentPercentage: Math.round((present / total) * 100),
    absentPercentage: Math.round((absent / total) * 100),
    latePercentage: Math.round((late / total) * 100),
  };
};

/**
 * محاسبه میانگین نمرات ارزیابی یک بازیکن
 */
export const calculatePlayerAverageRatings = (
  playerId: string,
  evaluations: Evaluation[]
) => {
  const playerEvaluations = getPlayerEvaluations(playerId, evaluations);

  if (playerEvaluations.length === 0) return null;

  const ratings = {
    passing: 0,
    shooting: 0,
    dribbling: 0,
    technique: 0,
    tactical: 0,
    physical: 0,
    speed: 0,
    aerial: 0,
    defending: 0,
    morale: 0,
    overall: 0,
  };

  playerEvaluations.forEach((evaluation) => {
    ratings.passing += evaluation.passing;
    ratings.shooting += evaluation.shooting;
    ratings.dribbling += evaluation.dribbling;
    ratings.technique += evaluation.technique;
    ratings.tactical += evaluation.tactical;
    ratings.physical += evaluation.physical;
    ratings.speed += evaluation.speed;
    ratings.aerial += evaluation.aerial;
    ratings.defending += evaluation.defending;
    ratings.morale += evaluation.morale;
    ratings.overall += evaluation.overall || 0;
  });

  const count = playerEvaluations.length;

  return {
    passing: Math.round((ratings.passing / count) * 10) / 10,
    shooting: Math.round((ratings.shooting / count) * 10) / 10,
    dribbling: Math.round((ratings.dribbling / count) * 10) / 10,
    technique: Math.round((ratings.technique / count) * 10) / 10,
    tactical: Math.round((ratings.tactical / count) * 10) / 10,
    physical: Math.round((ratings.physical / count) * 10) / 10,
    speed: Math.round((ratings.speed / count) * 10) / 10,
    aerial: Math.round((ratings.aerial / count) * 10) / 10,
    defending: Math.round((ratings.defending / count) * 10) / 10,
    morale: Math.round((ratings.morale / count) * 10) / 10,
    overall: Math.round((ratings.overall / count) * 10) / 10,
  };
};
