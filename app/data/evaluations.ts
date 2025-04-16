// داده‌های نمونه ارزیابی‌های بازیکنان

export interface Evaluation {
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
  overall?: number; // میانگین امتیازات
}

// تابع برای محاسبه میانگین امتیازات
const calculateOverall = (evaluation: Omit<Evaluation, "overall">): number => {
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
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 10) / 10; // میانگین با یک رقم اعشار
};

// داده‌های ارزیابی
export const evaluations: Evaluation[] = [
  {
    id: "e1",
    player_id: "p1",
    passing: 7,
    shooting: 5,
    dribbling: 6,
    technique: 7,
    tactical: 8,
    physical: 8,
    speed: 7,
    aerial: 8,
    defending: 9,
    morale: 8,
    evaluation_date: "2023-11-10",
    notes: "عملکرد خوبی در دروازه داشته و واکنش‌های سریعی دارد.",
  },
  {
    id: "e2",
    player_id: "p1",
    passing: 8,
    shooting: 5,
    dribbling: 6,
    technique: 8,
    tactical: 8,
    physical: 9,
    speed: 7,
    aerial: 9,
    defending: 9,
    morale: 9,
    evaluation_date: "2024-02-15",
    notes: "پیشرفت خوبی در خروج‌ها و ارسال پاس به مدافعین داشته است.",
  },
  {
    id: "e3",
    player_id: "p2",
    passing: 8,
    shooting: 6,
    dribbling: 7,
    technique: 7,
    tactical: 8,
    physical: 8,
    speed: 7,
    aerial: 8,
    defending: 9,
    morale: 8,
    evaluation_date: "2023-10-20",
    notes: "در نبردهای هوایی و تکل‌های پا عملکرد خوبی داشته است.",
  },
  {
    id: "e4",
    player_id: "p3",
    passing: 9,
    shooting: 8,
    dribbling: 9,
    technique: 8,
    tactical: 8,
    physical: 7,
    speed: 8,
    aerial: 6,
    defending: 7,
    morale: 9,
    evaluation_date: "2023-12-05",
    notes: "دید خوبی در زمین دارد و پاس‌های دقیقی ارسال می‌کند.",
  },
  {
    id: "e5",
    player_id: "p4",
    passing: 7,
    shooting: 9,
    dribbling: 8,
    technique: 8,
    tactical: 7,
    physical: 8,
    speed: 9,
    aerial: 7,
    defending: 6,
    morale: 8,
    evaluation_date: "2024-01-15",
    notes: "تمام کنندگی خوبی دارد و در موقعیت‌های تک به تک موفق عمل می‌کند.",
  },
  {
    id: "e6",
    player_id: "p5",
    passing: 6,
    shooting: 5,
    dribbling: 5,
    technique: 6,
    tactical: 7,
    physical: 6,
    speed: 7,
    aerial: 6,
    defending: 8,
    morale: 8,
    evaluation_date: "2023-11-25",
    notes: "برای سن خود عملکرد خوبی دارد اما نیاز به تقویت در بازی با پا دارد.",
  },
  {
    id: "e7",
    player_id: "p6",
    passing: 7,
    shooting: 6,
    dribbling: 6,
    technique: 7,
    tactical: 6,
    physical: 7,
    speed: 8,
    aerial: 6,
    defending: 8,
    morale: 7,
    evaluation_date: "2024-01-05",
    notes: "سرعت خوبی دارد اما نیاز به تقویت در تکل‌ها و نبردهای هوایی دارد.",
  },
  {
    id: "e8",
    player_id: "p7",
    passing: 8,
    shooting: 7,
    dribbling: 8,
    technique: 8,
    tactical: 7,
    physical: 6,
    speed: 8,
    aerial: 5,
    defending: 6,
    morale: 8,
    evaluation_date: "2023-12-15",
    notes: "تکنیک خوبی دارد و در دریبل زنی موفق عمل می‌کند.",
  },
  {
    id: "e9",
    player_id: "p8",
    passing: 7,
    shooting: 8,
    dribbling: 7,
    technique: 7,
    tactical: 6,
    physical: 7,
    speed: 8,
    aerial: 6,
    defending: 5,
    morale: 8,
    evaluation_date: "2024-02-01",
    notes:
      "سرعت و تمام کنندگی خوبی دارد اما باید روی مشارکت در دفاع تیمی کار کند.",
  },
  {
    id: "e10",
    player_id: "p9",
    passing: 8,
    shooting: 6,
    dribbling: 7,
    technique: 8,
    tactical: 9,
    physical: 9,
    speed: 7,
    aerial: 9,
    defending: 9,
    morale: 9,
    evaluation_date: "2023-10-15",
    notes: "رهبری خوبی در درون زمین دارد و تصمیم‌گیری‌های درستی انجام می‌دهد.",
  },
  {
    id: "e11",
    player_id: "p11",
    passing: 9,
    shooting: 8,
    dribbling: 9,
    technique: 9,
    tactical: 8,
    physical: 8,
    speed: 8,
    aerial: 7,
    defending: 7,
    morale: 9,
    evaluation_date: "2023-11-20",
    notes:
      "از نظر تکنیکی بازیکن برجسته‌ای است و خلاقیت بالایی در خلق موقعیت دارد.",
  },
  {
    id: "e12",
    player_id: "p13",
    passing: 8,
    shooting: 6,
    dribbling: 7,
    technique: 9,
    tactical: 9,
    physical: 9,
    speed: 8,
    aerial: 9,
    defending: 9,
    morale: 9,
    evaluation_date: "2024-01-25",
    notes: "دروازه‌بان بسیار باتجربه و رهبر خط دفاعی تیم است.",
  },
];

// اضافه کردن امتیاز کلی به ارزیابی‌ها
evaluations.forEach((evaluation) => {
  evaluation.overall = calculateOverall(evaluation);
});
