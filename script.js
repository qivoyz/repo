// ===== PAGE NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeLink = document.querySelector(`.nav-link[onclick*="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Trigger stats animation when home is shown
  if (page === 'home') {
    setTimeout(animateStats, 300);
  }
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// ===== COPY IP =====
function copyIP() {
  const ip = document.getElementById('ipDisplay').textContent;
  navigator.clipboard.writeText(ip).then(() => {
    showToast();
  }).catch(() => {
    // fallback
    const el = document.createElement('textarea');
    el.value = ip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== STATS COUNTER =====
function animateStats() {
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + (target === 24 ? '/7' : '+');
    }, 16);
  });
}

// ===== GALLERY FILTER =====
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
      item.classList.remove('hidden');
      item.style.animation = 'fadeIn 0.3s ease';
    } else {
      item.classList.add('hidden');
    }
  });
}

// ===== JOBS TAB SWITCH =====
function switchJobTab(tab) {
  document.querySelectorAll('.job-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.job-section').forEach(s => s.classList.remove('active'));

  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('section-' + tab).classList.add('active');
}

// ===== HEX PARTICLES =====
function createHexParticles() {
  const container = document.getElementById('hexParticles');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    hex.setAttribute('viewBox', '0 0 100 100');
    hex.classList.add('hex');
    hex.style.left = Math.random() * 100 + '%';
    hex.style.animationDuration = (15 + Math.random() * 20) + 's';
    hex.style.animationDelay = (Math.random() * 20) + 's';
    hex.style.width = (30 + Math.random() * 50) + 'px';

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#2563eb');
    polygon.setAttribute('stroke-width', '3');
    hex.appendChild(polygon);
    container.appendChild(hex);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createHexParticles();
  animateStats();

  // Intersection Observer for stat cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
});

// ===== LIVE PLAYER COUNT =====
async function fetchLivePlayers() {
  const el = document.getElementById('livePlayerCount');
  const dot = document.getElementById('liveDot');
  try {
    const res = await fetch('http://151.243.226.73:30120/players.json', { signal: AbortSignal.timeout(5000) });
    const players = await res.json();
    const count = Array.isArray(players) ? players.length : 0;
    el.textContent = count;
    dot.style.background = '#22c55e';
  } catch (e) {
    el.textContent = '–';
    dot.style.background = '#ef4444';
  }
}

fetchLivePlayers();
setInterval(fetchLivePlayers, 30000); // refresh every 30s
