const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const courses = [
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
];

const instructor = {
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
};

const sessions = [
  { day: 'Monday', time: '7:00 PM – 8:30 PM', topic: 'Live Market Analysis — Nifty 50', course: 'nifty-fifty' },
  { day: 'Wednesday', time: '7:00 PM – 8:30 PM', topic: 'Gold Market Deep Dive', course: 'gold-trading' },
  { day: 'Friday', time: '6:30 PM – 8:00 PM', topic: 'Options & F&O Strategies', course: 'nifty-fifty' },
  { day: 'Saturday', time: '10:00 AM – 12:00 PM', topic: 'Live Trading Session with Amit', course: 'both' },
];

const enrollments = [];

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

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  let filePath = url.parse(req.url).pathname;
  if (filePath === '/') filePath = '/index.html';

  const fullPath = path.join(PUBLIC_DIR, filePath);
  const ext = path.extname(fullPath).toLowerCase();

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    res.end(content);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (pathname === '/api/courses' && req.method === 'GET') {
    sendJSON(res, 200, { success: true, data: courses });
    return;
  }

  if (pathname === '/api/instructor' && req.method === 'GET') {
    sendJSON(res, 200, { success: true, data: instructor });
    return;
  }

  if (pathname === '/api/sessions' && req.method === 'GET') {
    sendJSON(res, 200, { success: true, data: sessions });
    return;
  }

  if (pathname === '/api/market' && req.method === 'GET') {
    sendJSON(res, 200, { success: true, data: getMarketData() });
    return;
  }

  if (pathname === '/api/enroll' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { name, email, phone, courseId } = body;

      if (!name || !email || !phone || !courseId) {
        sendJSON(res, 400, { success: false, message: 'All fields are required.' });
        return;
      }

      const course = courses.find((c) => c.id === courseId);
      if (!course) {
        sendJSON(res, 400, { success: false, message: 'Invalid course selected.' });
        return;
      }

      const enrollment = {
        id: Date.now(),
        name,
        email,
        phone,
        courseId,
        courseTitle: course.title,
        enrolledAt: new Date().toISOString(),
      };

      enrollments.push(enrollment);
      sendJSON(res, 201, {
        success: true,
        message: `Thank you, ${name}! You have been enrolled in ${course.title}. Amit Chaudhary's team will contact you shortly.`,
        data: enrollment,
      });
    } catch {
      sendJSON(res, 400, { success: false, message: 'Invalid request body.' });
    }
    return;
  }

  if (pathname.startsWith('/api/')) {
    sendJSON(res, 404, { success: false, message: 'API endpoint not found.' });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n  The_Sprinters Accacaddmy is running!`);
  console.log(`  Open http://localhost:${PORT} in your browser\n`);
});
