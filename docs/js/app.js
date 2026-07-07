const { courses, instructor, sessions } = window.SITE_DATA;

function formatPrice(num) {
  return num.toLocaleString('en-IN');
}

function renderTicker(market) {
  const { gold, nifty } = market;
  const items = [
    buildTickerItem(gold.symbol, gold.price, gold.change, gold.unit, '🥇'),
    buildTickerItem(nifty.symbol, nifty.price, nifty.change, nifty.unit, '📈'),
    buildTickerItem('BANK NIFTY', '48,230', +125.5, 'pts', '🏦'),
    buildTickerItem('SENSEX', '73,890', -89.2, 'pts', '📊'),
    buildTickerItem('USD/INR', '83.42', +0.08, '', '💱'),
    buildTickerItem(gold.symbol, gold.price, gold.change, gold.unit, '🥇'),
    buildTickerItem(nifty.symbol, nifty.price, nifty.change, nifty.unit, '📈'),
  ];

  document.getElementById('tickerTrack').innerHTML = items
    .map((t) => `<span class="ticker-item">${t}</span>`)
    .join('');
}

function buildTickerItem(symbol, price, change, unit, icon) {
  const isUp = change >= 0;
  const cls = isUp ? 'up' : 'down';
  const arrow = isUp ? '▲' : '▼';
  const formattedPrice = typeof price === 'number' ? formatPrice(price) : price;
  const formattedChange = typeof change === 'number' ? Math.abs(change).toFixed(2) : change;
  return `${icon} <strong>${symbol}</strong> ₹${formattedPrice} ${unit} <span class="${cls}">${arrow} ${formattedChange}</span>`;
}

function renderMarketCards(market) {
  const { gold, nifty } = market;
  document.getElementById('marketCards').innerHTML = `
    <div class="market-card gold-card">
      <div>
        <div class="market-symbol">${gold.symbol}</div>
        <div class="market-price">₹${formatPrice(gold.price)}</div>
        <div class="market-change ${gold.change >= 0 ? 'up' : 'down'}">
          ${gold.change >= 0 ? '▲' : '▼'} ${Math.abs(gold.change).toFixed(2)} ${gold.unit}
        </div>
      </div>
      <div class="market-icon">🥇</div>
    </div>
    <div class="market-card nifty-card">
      <div>
        <div class="market-symbol">${nifty.symbol}</div>
        <div class="market-price">${formatPrice(nifty.price)}</div>
        <div class="market-change ${nifty.change >= 0 ? 'up' : 'down'}">
          ${nifty.change >= 0 ? '▲' : '▼'} ${Math.abs(nifty.change).toFixed(2)} ${nifty.unit}
        </div>
      </div>
      <div class="market-icon">📈</div>
    </div>
  `;
}

function renderCourses() {
  const grid = document.getElementById('coursesGrid');
  const select = document.getElementById('courseId');

  grid.innerHTML = courses
    .map((course) => {
      const cls = course.id === 'gold-trading' ? 'gold' : 'nifty';
      const topicsHTML = course.topics.map((t) => `<li>${t}</li>`).join('');
      return `
        <article class="course-card ${cls}">
          <div class="course-card-header">
            <div class="course-icon">${course.icon}</div>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-subtitle">${course.subtitle}</p>
          </div>
          <div class="course-body">
            <div class="course-meta">
              <span class="meta-tag">⏱ ${course.duration}</span>
              <span class="meta-tag">📅 ${course.sessions} Sessions</span>
              <span class="meta-tag">📊 ${course.level}</span>
            </div>
            <p class="course-desc">${course.description}</p>
            <ul class="course-topics">${topicsHTML}</ul>
            <div class="course-footer">
              <div class="course-price">${course.price} <span>/ course</span></div>
              <a href="#enroll" class="btn-enroll" data-course="${course.id}">Enroll Now</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  select.innerHTML =
    '<option value="">Choose a course...</option>' +
    courses.map((c) => `<option value="${c.id}">${c.title} — ${c.price}</option>`).join('');

  document.querySelectorAll('.btn-enroll').forEach((btn) => {
    btn.addEventListener('click', () => {
      select.value = btn.dataset.course;
    });
  });
}

function renderInstructor() {
  document.getElementById('instructorName').textContent = instructor.name;
  document.getElementById('instructorTitle').textContent = instructor.title;
  document.getElementById('instructorBio').textContent = instructor.bio;
  document.getElementById('instructorExp').textContent = instructor.experience;
  document.getElementById('instructorStudents').textContent = instructor.students;
  document.getElementById('credentialsList').innerHTML = instructor.credentials
    .map((c) => `<li>${c}</li>`)
    .join('');
}

function renderSessions() {
  const labels = {
    'gold-trading': { text: 'Gold Trading', cls: 'gold' },
    'nifty-fifty': { text: 'Nifty 50', cls: 'nifty' },
    both: { text: 'All Courses', cls: 'both' },
  };

  document.getElementById('sessionsBody').innerHTML = sessions
    .map((s) => {
      const badge = labels[s.course] || labels.both;
      return `
        <tr>
          <td><strong>${s.day}</strong></td>
          <td>${s.time}</td>
          <td>${s.topic}</td>
          <td><span class="course-badge ${badge.cls}">${badge.text}</span></td>
        </tr>
      `;
    })
    .join('');
}

function loadMarketData() {
  const data = getMarketData();
  renderTicker(data);
  renderMarketCards(data);
}

function init() {
  renderCourses();
  renderInstructor();
  renderSessions();
  loadMarketData();
}

document.getElementById('enrollForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMessage');

  btn.disabled = true;
  btn.textContent = 'Submitting...';
  msg.className = 'form-message';
  msg.style.display = 'none';

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    courseId: document.getElementById('courseId').value,
  };

  const data = enrollStudent(payload);
  msg.textContent = data.message;
  msg.className = `form-message ${data.success ? 'success' : 'error'}`;

  if (data.success) {
    e.target.reset();
  }

  btn.disabled = false;
  btn.textContent = 'Enroll Now';
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

init();
setInterval(loadMarketData, 15000);
