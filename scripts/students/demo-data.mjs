export const demoStudents = [
  ["آریا", "احمدی"],
  ["نیلوفر", "کریمی"],
  ["پارسا", "رضایی"],
  ["نگار", "محمدی"],
  ["کیان", "مرادی"],
  ["سارا", "حسینی"],
  ["آراد", "جعفری"],
  ["رها", "اکبری"],
  ["امیر", "صادقی"],
  ["هستی", "موسوی"],
  ["سامان", "نوری"],
  ["ترانه", "کاظمی"],
].map(([firstName, lastName], index) => ({
  firstName,
  lastName,
  name: `${firstName} ${lastName}`,
  username: `demo_${String(index + 1).padStart(2, "0")}`,
}));

export const demoCourses = [
  {
    title: "[دمو] مبانی برنامه‌نویسی",
    difficulty: "beginner",
    github: "https://github.com/python/cpython",
    syllabus: ["متغیرها و نوع داده", "شرط و حلقه", "تابع‌ها", "حل مسئله و پروژهٔ کوچک"],
    video: {
      title: "آموزش مقدماتی برنامه‌نویسی",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    },
  },
  {
    title: "[دمو] Git و کار تیمی",
    difficulty: "beginner",
    github: "https://github.com/git/git",
    syllabus: ["مخزن و ثبت تغییرات", "شاخه‌ها و ادغام", "کار با گیت‌هاب", "بررسی کد"],
    video: { title: "آشنایی با Git و GitHub", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
  },
  {
    title: "[دمو] پایگاه داده و SQL",
    difficulty: "intermediate",
    github: "https://github.com/postgres/postgres",
    syllabus: ["طراحی جدول", "کوئری و فیلتر", "رابطه و JOIN", "ایندکس و تراکنش"],
    video: { title: "مبانی پایگاه داده و SQL", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  },
  {
    title: "[دمو] توسعهٔ بک‌اند و API",
    difficulty: "advanced",
    github: "https://github.com/django/django",
    syllabus: ["مدل‌سازی داده", "احراز هویت", "ساخت API", "تست و استقرار پروژه"],
    video: { title: "آشنایی با توسعهٔ وب", url: "https://www.youtube.com/watch?v=F5mRW0jo-U4" },
  },
];

export function demoCourseIndexes(index) {
  if (index < 2 || index === 11) return [index % 4];
  return index >= 8 ? [0, 1, 3] : [index % 3, 3];
}

const notes = [
  "تمرین نیاز به مرور دارد.",
  "حل مسئله بهتر شده است.",
  "تمرین‌ها کامل تحویل داده شد.",
  "پروژهٔ عملی با توضیحات مناسب ارائه شد.",
];

export function demoAssessments(student, index, assignments, now) {
  if (index === 11) return [];
  const inactivity = index === 9 ? 65 : index === 10 ? 140 : 2 + (index % 4);
  const date = (days) => new Date(now.getTime() - days * 86400000).toISOString();
  const rows = assignments.flatMap((course, courseIndex) =>
    Array.from({ length: 8 }, (_, lesson) => ({
      studentId: student.id,
      courseId: course.id,
      points: Math.max(
        1,
        Math.min(
          5,
          Math.round(1 + lesson * 0.45 + ((index + courseIndex) % 3) * 0.3 - (index % 4) * 0.3),
        ),
      ),
      kind: lesson === 7 ? "followup" : "session",
      note: `${notes[lesson % notes.length]} (دمو ${student.username}/${courseIndex + 1}/${lesson + 1})`,
      recordedAt: date(inactivity + (assignments.length - 1 - courseIndex) * 28 + (7 - lesson) * 3),
    })),
  );
  rows.push({
    studentId: student.id,
    courseId: null,
    points: 3 + (index % 3),
    kind: "other",
    note: `پیگیری مستقل از دوره و بررسی مسیر یادگیری (دمو ${student.username}/عمومی)`,
    recordedAt: date(inactivity + 1),
  });
  return rows;
}
