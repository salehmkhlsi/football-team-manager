// داده‌های نمونه بازیکنان برای استفاده در فرانت‌اند

export interface Player {
  id: string;
  name: string;
  national_id: string;
  birth_date: string;
  team: string;
  position: string;
  phone: string;
  height: number | null;
  weight: number | null;
  email?: string;
  strong_foot?: string;
}

export const players: Player[] = [
  {
    id: "p1",
    name: "علی محمدی",
    national_id: "0123456789",
    birth_date: "2006-05-12",
    team: "نوجوانان",
    position: "دروازه‌بان",
    phone: "09123456789",
    height: 175,
    weight: 70,
    strong_foot: "راست",
  },
  {
    id: "p2",
    name: "محمد رضایی",
    national_id: "0123456790",
    birth_date: "2007-03-18",
    team: "نوجوانان",
    position: "مدافع",
    phone: "09123456790",
    height: 168,
    weight: 65,
    strong_foot: "راست",
  },
  {
    id: "p3",
    name: "امیر حسینی",
    national_id: "0123456791",
    birth_date: "2007-08-25",
    team: "نوجوانان",
    position: "هافبک",
    phone: "09123456791",
    height: 172,
    weight: 68,
    strong_foot: "چپ",
  },
  {
    id: "p4",
    name: "رضا کریمی",
    national_id: "0123456792",
    birth_date: "2006-11-03",
    team: "نوجوانان",
    position: "مهاجم",
    phone: "09123456792",
    height: 170,
    weight: 66,
    strong_foot: "راست",
  },
  {
    id: "p5",
    name: "مهدی موسوی",
    national_id: "0123456793",
    birth_date: "2008-02-15",
    team: "نونهالان",
    position: "دروازه‌بان",
    phone: "09123456793",
    height: 160,
    weight: 55,
    strong_foot: "راست",
  },
  {
    id: "p6",
    name: "سعید جعفری",
    national_id: "0123456794",
    birth_date: "2008-07-20",
    team: "نونهالان",
    position: "مدافع",
    phone: "09123456794",
    height: 158,
    weight: 52,
    strong_foot: "راست",
  },
  {
    id: "p7",
    name: "محسن قاسمی",
    national_id: "0123456795",
    birth_date: "2008-09-05",
    team: "نونهالان",
    position: "هافبک",
    phone: "09123456795",
    height: 155,
    weight: 50,
    strong_foot: "چپ",
  },
  {
    id: "p8",
    name: "امین نجفی",
    national_id: "0123456796",
    birth_date: "2008-12-10",
    team: "نونهالان",
    position: "مهاجم",
    phone: "09123456796",
    height: 157,
    weight: 53,
    strong_foot: "راست",
  },
  {
    id: "p9",
    name: "احمد تهرانی",
    national_id: "0123456797",
    birth_date: "2004-04-22",
    team: "جوانان",
    position: "دروازه‌بان",
    phone: "09123456797",
    height: 182,
    weight: 78,
    strong_foot: "راست",
  },
  {
    id: "p10",
    name: "پویا نوری",
    national_id: "0123456798",
    birth_date: "2004-08-30",
    team: "جوانان",
    position: "مدافع",
    phone: "09123456798",
    height: 180,
    weight: 75,
    strong_foot: "راست",
  },
  {
    id: "p11",
    name: "آرش شریفی",
    national_id: "0123456799",
    birth_date: "2005-01-17",
    team: "جوانان",
    position: "هافبک",
    phone: "09123456799",
    height: 178,
    weight: 73,
    strong_foot: "چپ",
  },
  {
    id: "p12",
    name: "سینا سعیدی",
    national_id: "0123456800",
    birth_date: "2005-06-08",
    team: "جوانان",
    position: "مهاجم",
    phone: "09123456800",
    height: 175,
    weight: 74,
    strong_foot: "راست",
  },
  {
    id: "p13",
    name: "بهنام فتحی",
    national_id: "0123456801",
    birth_date: "2000-03-12",
    team: "بزرگسالان",
    position: "دروازه‌بان",
    phone: "09123456801",
    height: 188,
    weight: 85,
    strong_foot: "راست",
  },
  {
    id: "p14",
    name: "احسان نیکنام",
    national_id: "0123456802",
    birth_date: "1999-09-28",
    team: "بزرگسالان",
    position: "مدافع",
    phone: "09123456802",
    height: 185,
    weight: 83,
    strong_foot: "راست",
  },
  {
    id: "p15",
    name: "فرهاد رحمانی",
    national_id: "0123456803",
    birth_date: "2000-11-05",
    team: "بزرگسالان",
    position: "هافبک",
    phone: "09123456803",
    height: 182,
    weight: 80,
    strong_foot: "چپ",
  },
  {
    id: "p16",
    name: "پیمان مرادی",
    national_id: "0123456804",
    birth_date: "1998-05-20",
    team: "بزرگسالان",
    position: "مهاجم",
    phone: "09123456804",
    height: 183,
    weight: 81,
    strong_foot: "راست",
  },
];
