/* ===== 1. DARK / LIGHT THEME ===== */
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.innerHTML = t === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem('theme', t);
}
setTheme(localStorage.getItem('theme') || 'dark');
themeBtn.onclick = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

/* ===== 2. MOBILE MENU ===== */
const menu = document.getElementById('menu');
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

/* ===== 3. TYPING EFFECT ===== */
const roles = ['Networking Student', 'Web Developer', 'Aspiring Network Engineer'];
const typed = document.getElementById('typed');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  c += deleting ? -1 : 1;
  typed.textContent = word.slice(0, c);
  let delay = deleting ? 40 : 90;
  if (!deleting && c === word.length) { deleting = true; delay = 1400; }
  else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
  setTimeout(type, delay);
}
type();

/* ===== 4. SCROLL REVEAL + ACTIVE NAV LINK ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const links = document.querySelectorAll('.menu a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

/* ===== 5. BACK TO TOP + FOOTER YEAR ===== */
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => topBtn.classList.toggle('vis', window.scrollY > 500));
topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== 6. CONTACT FORM VALIDATION ===== */
const form = document.getElementById('form');
function check(id, errId, ok, message) {
  const field = document.getElementById(id);
  document.getElementById(errId).textContent = ok ? '' : message;
  field.classList.toggle('bad', !ok);
  return ok;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('msg').value.trim();
  const a = check('name', 'nameErr', name.length >= 2, 'Enter your name (at least 2 characters).');
  const b = check('email', 'emailErr', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email, like name@example.com.');
  const d = check('msg', 'msgErr', msg.length >= 10, 'Write a message of at least 10 characters.');
  const ok = document.getElementById('ok');
  if (a && b && d) {
    // No server here, so this opens your email app with the message filled in.
    const body = encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')');
    window.location.href = 'mailto:05240138.jnec@rub.edu.bt?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + body;
    ok.textContent = 'Thanks, ' + name + '. Your email app is opening to send the message.';
    form.reset();
  } else {
    ok.textContent = '';
  }
});

/* ===== 7. BACKGROUND MUSIC (browsers need a click to start audio) ===== */
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
bgm.volume = 0.4;
musicBtn.onclick = () => {
  if (bgm.paused) {
    bgm.play().then(() => musicBtn.classList.add('on'))
      .catch(() => alert('Music file not found. Add music/background.mp3 to your project folder.'));
  } else {
    bgm.pause();
    musicBtn.classList.remove('on');
  }
};

/* ===== 8. NETWORK-NODES ANIMATION IN THE HOME SECTION ===== */
const cv = document.getElementById('net');
const cx = cv.getContext('2d');
let nodes = [];
function resize() {
  cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
  nodes = Array.from({ length: Math.min(70, Math.floor(cv.width / 16)) }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  const color = getComputedStyle(root).getPropertyValue('--accent').trim();
  cx.fillStyle = color; cx.strokeStyle = color;
  nodes.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > cv.width) p.vx *= -1;
    if (p.y < 0 || p.y > cv.height) p.vy *= -1;
    cx.beginPath(); cx.arc(p.x, p.y, 2, 0, 7); cx.fill();
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(p.x - nodes[j].x, p.y - nodes[j].y);
      if (d < 120) {
        cx.globalAlpha = (1 - d / 120) * .35;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(nodes[j].x, nodes[j].y); cx.stroke();
        cx.globalAlpha = 1;
      }
    }
  });
  requestAnimationFrame(draw);
}
window.addEventListener('resize', resize);
resize(); draw();


/* ===== 9. LOADING SCREEN ===== */
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('done'), 700));

/* ===== 10. MOUSE GLOW + PHOTO PARALLAX ===== */
const glow = document.getElementById('glow');
const photo = document.querySelector('.photo');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  const x = (e.clientX / innerWidth - .5) * 16;
  const y = (e.clientY / innerHeight - .5) * 16;
  photo.style.transform = 'translate(' + x + 'px,' + y + 'px)';
});

/* ===== 11. STATS COUNT-UP ===== */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target.querySelector('b');
    const end = +el.dataset.count;
    let n = 0;
    const timer = setInterval(() => {
      n++; el.textContent = n;
      if (n >= end) clearInterval(timer);
    }, 1000 / end / 1.5);
    countObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat').forEach(s => countObs.observe(s));

/* ===== 12. PROJECT FILTER BUTTONS ===== */
const filterBtns = document.querySelectorAll('.f');
filterBtns.forEach(btn => btn.onclick = () => {
  filterBtns.forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.card').forEach(card => {
    card.classList.toggle('hide', btn.dataset.f !== 'all' && card.dataset.cat !== btn.dataset.f);
  });
});


/* ===== 13. SCROLL PROGRESS BAR ===== */
const bar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
});

/* ===== 14. INTERACTIVE NETWORK DIAGRAM ===== */
const nodes2 = document.querySelectorAll('.node');
const nodeInfo = document.getElementById('nodeInfo');
nodes2.forEach(n => n.onclick = () => {
  nodes2.forEach(x => x.classList.remove('on'));
  n.classList.add('on');
  nodeInfo.innerHTML = '<strong>' + n.dataset.label + ':</strong> ' + n.dataset.info;
});

/* ===== 15. COPY-TO-CLIPBOARD BUTTONS ===== */
document.querySelectorAll('.copy').forEach(btn => btn.onclick = () => {
  const text = btn.dataset.copy;
  const done = () => {
    btn.classList.add('done');
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done);
  } else {
    const t = document.createElement('textarea');   // older-browser fallback
    t.value = text; document.body.appendChild(t); t.select();
    document.execCommand('copy'); t.remove(); done();
  }
});
