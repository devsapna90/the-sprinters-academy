window.SITE_DATA = {
  courses: [
    {
      id: 'gold-trading',
      title: 'Gold Trading Masterclass',
      subtitle: 'Master XAU/USD & MCX Gold Futures',
      icon: '🥇',
      duration: '8 Weeks',
      sessions: 24,
      level: 'Beginner to Advanced',
      price: '₹14,999',
      description:
        'Learn professional gold trading strategies including technical analysis, global macro factors, MCX & COMEX execution, and risk management from industry expert Amit Chaudhary.',
      topics: [
        'Gold market fundamentals & global drivers',
        'Support/Resistance & chart patterns on gold',
        'MCX Gold Mini & Gold Petal trading',
        'Hedging strategies for jewellers & investors',
        'Live market sessions every Saturday',
      ],
      color: '#d4af37',
    },
    {
      id: 'nifty-fifty',
      title: 'Nifty 50 Trading Mastery',
      subtitle: 'Index Futures, Options & Swing Trading',
      icon: '📈',
      duration: '10 Weeks',
      sessions: 30,
      level: 'Beginner to Pro',
      price: '₹18,999',
      description:
        'Complete Nifty 50 program covering index futures, options strategies, bank nifty correlation, and systematic swing trading with live mentorship by Amit Chaudhary.',
      topics: [
        'Nifty 50 index structure & F&O basics',
        'Option chain reading & OI analysis',
        'Intraday & swing trading setups',
        'Risk-reward ratio & position sizing',
        'Weekly live Q&A with Amit Chaudhary',
      ],
      color: '#00c896',
    },
  ],
  instructor: {
    name: 'Amit Chaudhary',
    title: 'Senior Market Analyst & Course Master',
    experience: '12+ Years',
    students: '5,000+',
    bio: 'Amit Chaudhary is a renowned stock market educator with over 12 years of experience in equity, derivatives, and commodity trading. He has trained thousands of traders across India and is known for his practical, no-nonsense approach to market education.',
    credentials: [
      'NSE Certified Market Professional',
      'Former Senior Analyst at leading brokerage',
      'Featured speaker at Traders Summit 2024',
      'Specialist in Gold & Index Derivatives',
    ],
  },
  sessions: [
    { day: 'Monday', time: '7:00 PM – 8:30 PM', topic: 'Live Market Analysis — Nifty 50', course: 'nifty-fifty' },
    { day: 'Wednesday', time: '7:00 PM – 8:30 PM', topic: 'Gold Market Deep Dive', course: 'gold-trading' },
    { day: 'Friday', time: '6:30 PM – 8:00 PM', topic: 'Options & F&O Strategies', course: 'nifty-fifty' },
    { day: 'Saturday', time: '10:00 AM – 12:00 PM', topic: 'Live Trading Session with Amit', course: 'both' },
  ],
};

function getMarketData() {
  const baseGold = 62450 + Math.floor(Math.random() * 800 - 400);
  const baseNifty = 22450 + Math.floor(Math.random() * 200 - 100);
  return {
    gold: {
      symbol: 'GOLD (MCX)',
      price: baseGold,
      change: +(Math.random() * 400 - 200).toFixed(2),
      unit: '₹/10g',
    },
    nifty: {
      symbol: 'NIFTY 50',
      price: baseNifty,
      change: +(Math.random() * 150 - 75).toFixed(2),
      unit: 'pts',
    },
    updatedAt: new Date().toISOString(),
  };
}

function enrollStudent(payload) {
  const course = window.SITE_DATA.courses.find((c) => c.id === payload.courseId);
  if (!course) {
    return { success: false, message: 'Invalid course selected.' };
  }

  const enrollment = {
    ...payload,
    courseTitle: course.title,
    enrolledAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem('enrollments') || '[]');
  existing.push(enrollment);
  localStorage.setItem('enrollments', JSON.stringify(existing));

  return {
    success: true,
    message: `Thank you, ${payload.name}! You have been enrolled in ${course.title}. Amit Chaudhary's team will contact you shortly.`,
  };
}
