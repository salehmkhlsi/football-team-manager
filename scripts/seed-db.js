const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "../.env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Make sure .env file exists with proper values."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// تعریف رده‌های سنی
const categories = [
  { name: "نونهالان", minAge: 7, maxAge: 10 },
  { name: "نوجوانان", minAge: 11, maxAge: 14 },
  { name: "جوانان", minAge: 15, maxAge: 19 },
  { name: "بزرگسالان", minAge: 20, maxAge: 35 },
];

// تعریف تیم‌های مختلف
const teams = [
  "تیم A نونهالان",
  "تیم B نونهالان",
  "تیم A نوجوانان",
  "تیم B نوجوانان",
  "تیم A جوانان",
  "تیم B جوانان",
  "تیم A بزرگسالان",
  "تیم B بزرگسالان",
];

// تعریف پست‌های بازی
const positions = [
  "دروازه‌بان",
  "مدافع وسط",
  "مدافع راست",
  "مدافع چپ",
  "هافبک دفاعی",
  "هافبک مرکزی",
  "هافبک هجومی",
  "وینگر راست",
  "وینگر چپ",
  "مهاجم",
];

// لیست نام‌های نمونه
const firstNames = [
  "علی",
  "محمد",
  "امیر",
  "رضا",
  "حسین",
  "مهدی",
  "سعید",
  "محسن",
  "امین",
  "احمد",
  "پویا",
  "آرش",
  "سینا",
  "بهنام",
  "احسان",
  "فرهاد",
  "پیمان",
  "پارسا",
  "ساسان",
  "کیان",
  "آرمان",
  "سامان",
  "پدرام",
  "شاهین",
  "بابک",
];

const lastNames = [
  "محمدی",
  "احمدی",
  "رضایی",
  "حسینی",
  "موسوی",
  "کریمی",
  "فرهادی",
  "جعفری",
  "قاسمی",
  "نجفی",
  "احسانی",
  "پورمحمدی",
  "رضوانی",
  "میرزایی",
  "تهرانی",
  "نوری",
  "شریفی",
  "سعیدی",
  "فتحی",
  "نیکنام",
  "رحمانی",
  "مرادی",
  "فراهانی",
  "صالحی",
  "بهرامی",
];

// تولید تاریخ تولد تصادفی برای رده سنی مشخص
function getRandomBirthDate(minAge, maxAge) {
  const currentYear = new Date().getFullYear();
  const year =
    currentYear - minAge - Math.floor(Math.random() * (maxAge - minAge + 1));
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // برای اجتناب از مسائل ماه‌های با طول متفاوت
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

// تولید شماره همراه تصادفی
function getRandomPhoneNumber() {
  return `091${Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(8, "0")}`;
}

// تولید ایمیل تصادفی
function getRandomEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
}

// تولید امتیاز تصادفی برای مهارت
function getRandomSkillRating() {
  return Math.floor(Math.random() * 6) + 4; // امتیاز بین 4 تا 9
}

// تولید تاریخ ارزیابی تصادفی در 6 ماه گذشته
function getRandomEvaluationDate() {
  const now = new Date();
  const monthsAgo = Math.floor(Math.random() * 6);
  const targetDate = new Date();
  targetDate.setMonth(now.getMonth() - monthsAgo);

  const year = targetDate.getFullYear();
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const day = targetDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// یادداشت‌های نمونه برای ارزیابی
const sampleNotes = [
  "پیشرفت خوبی در ماه گذشته داشته است.",
  "نیاز به تمرین بیشتر در زمینه پاس دارد.",
  "از لحاظ فیزیکی پیشرفت خوبی داشته، اما باید روی تکنیک بیشتر کار کند.",
  "بازیکنی با استعداد که باید روی تمرکز خود کار کند.",
  "مهارت‌های رهبری خوبی دارد و می‌تواند کاپیتان تیم باشد.",
  "بازیکن باهوشی که تاکتیک‌ها را به خوبی درک می‌کند.",
  "سرعت خوبی دارد اما باید روی قدرت بدنی کار کند.",
  "تکنیک بالایی دارد اما گاهی تصمیمات اشتباه می‌گیرد.",
  "در بازی هوایی بسیار خوب است اما پاس‌های زمینی او ضعیف است.",
  "پیشرفت قابل توجهی در دفاع داشته است.",
];

// ایجاد بازیکنان نمونه
async function createPlayers() {
  console.log("شروع ایجاد بازیکنان نمونه...");

  const players = [];

  // برای هر تیم حداقل 10 بازیکن ایجاد می‌کنیم
  for (const team of teams) {
    const category = categories.find((cat) => team.includes(cat.name));

    for (let i = 0; i < 10; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const position = positions[Math.floor(Math.random() * positions.length)];
      const birthDate = getRandomBirthDate(category.minAge, category.maxAge);
      const phone = getRandomPhoneNumber();
      const email = getRandomEmail(firstName, lastName);

      const player = {
        name,
        team,
        position,
        birth_date: birthDate,
        phone,
        email,
        height: Math.floor(Math.random() * 50) + 150, // 150-199 سانتی‌متر
        weight: Math.floor(Math.random() * 40) + 50, // 50-89 کیلوگرم
        strong_foot: Math.random() > 0.7 ? "چپ" : "راست",
        created_at: new Date().toISOString(),
      };

      players.push(player);
    }
  }

  // ذخیره بازیکنان در پایگاه داده
  const { data, error } = await supabase
    .from("players")
    .upsert(players)
    .select();

  if (error) {
    console.error("خطا در ایجاد بازیکنان:", error);
    return [];
  }

  console.log(`${data.length} بازیکن با موفقیت ایجاد شد.`);
  return data;
}

// ایجاد ارزیابی برای بازیکنان
async function createEvaluations(players) {
  console.log("شروع ایجاد ارزیابی‌های نمونه...");

  const evaluations = [];

  // برای هر بازیکن 1 تا 3 ارزیابی ایجاد می‌کنیم
  for (const player of players) {
    const evalCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < evalCount; i++) {
      const evaluation = {
        player_id: player.id,
        passing: getRandomSkillRating(),
        shooting: getRandomSkillRating(),
        dribbling: getRandomSkillRating(),
        technique: getRandomSkillRating(),
        tactical: getRandomSkillRating(),
        physical: getRandomSkillRating(),
        speed: getRandomSkillRating(),
        aerial: getRandomSkillRating(),
        defending: getRandomSkillRating(),
        personality: getRandomSkillRating(),
        evaluation_date: getRandomEvaluationDate(),
        notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
        created_at: new Date().toISOString(),
      };

      evaluations.push(evaluation);
    }
  }

  // ذخیره ارزیابی‌ها در پایگاه داده
  const { data, error } = await supabase
    .from("evaluations")
    .upsert(evaluations)
    .select();

  if (error) {
    console.error("خطا در ایجاد ارزیابی‌ها:", error);
    return;
  }

  console.log(`${data.length} ارزیابی با موفقیت ایجاد شد.`);
}

// ایجاد حضور و غیاب برای بازیکنان
async function createAttendance(players) {
  console.log("شروع ایجاد رکوردهای حضور و غیاب نمونه...");

  const attendanceRecords = [];

  // تاریخ جلسات تمرین در 2 ماه گذشته (هر هفته 2 جلسه)
  const sessionDates = [];
  const today = new Date();
  for (let i = 0; i < 16; i++) {
    // 8 هفته، هر هفته 2 جلسه
    const sessionDate = new Date();
    sessionDate.setDate(today.getDate() - (i * 3 + 1)); // هر 3 روز یک جلسه

    const year = sessionDate.getFullYear();
    const month = (sessionDate.getMonth() + 1).toString().padStart(2, "0");
    const day = sessionDate.getDate().toString().padStart(2, "0");

    sessionDates.push(`${year}-${month}-${day}`);
  }

  // برای هر بازیکن در هر جلسه تمرین، یک رکورد حضور و غیاب ایجاد می‌کنیم
  for (const player of players) {
    for (const sessionDate of sessionDates) {
      // بازیکن در تیم‌های مشخص
      if (
        !player.team.includes(categories[0].name) &&
        !player.team.includes(categories[1].name)
      ) {
        continue; // فقط برای تیم‌های نونهالان و نوجوانان حضور و غیاب ثبت می‌کنیم
      }

      // 80% احتمال حضور
      const isPresent = Math.random() < 0.8;
      const reason = isPresent
        ? null
        : ["بیماری", "مشکلات شخصی", "مصدومیت", "امتحان مدرسه", "سفر خانوادگی"][
            Math.floor(Math.random() * 5)
          ];

      const record = {
        player_id: player.id,
        session_date: sessionDate,
        is_present: isPresent,
        absence_reason: reason,
        created_at: new Date().toISOString(),
      };

      attendanceRecords.push(record);
    }
  }

  // ذخیره رکوردهای حضور و غیاب در پایگاه داده
  const { data, error } = await supabase
    .from("attendance")
    .upsert(attendanceRecords)
    .select();

  if (error) {
    console.error("خطا در ایجاد رکوردهای حضور و غیاب:", error);
    return;
  }

  console.log(`${data.length} رکورد حضور و غیاب با موفقیت ایجاد شد.`);
}

// اجرای توابع به صورت متوالی
async function seedDatabase() {
  try {
    console.log("شروع اضافه کردن داده‌های نمونه به پایگاه داده...");

    const players = await createPlayers();
    await createEvaluations(players);
    await createAttendance(players);

    console.log("عملیات با موفقیت انجام شد.");
    process.exit(0);
  } catch (error) {
    console.error("خطا در اضافه کردن داده‌های نمونه:", error);
    process.exit(1);
  }
}

// اجرای اسکریپت
seedDatabase();
