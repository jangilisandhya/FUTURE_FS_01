/* =========================================================
   Config
   ========================================================= */
// Point this at your deployed backend (Node.js + MongoDB API).
// For local dev, the Express server defaults to http://localhost:5000
const API_BASE_URL = window.PORTFOLIO_API_URL || 'http://localhost:5000';

/* =========================================================
   Theme toggle (persists in localStorage)
   ========================================================= */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const initial = stored || (prefersLight ? 'light' : 'dark');
  if (initial === 'light') {
    root.setAttribute('data-theme', 'light');
    toggle.setAttribute('aria-pressed', 'true');
  }

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
      toggle.setAttribute('aria-pressed', 'false');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
      toggle.setAttribute('aria-pressed', 'true');
    }
  });
})();

/* =========================================================
   Mobile nav toggle
   ========================================================= */
(function initNav() {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* =========================================================
   Footer year
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   Background "neural network" canvas
   ========================================================= */
(function initCanvas() {
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, nodes;
  const NODE_COUNT = 46;
  const MAX_DIST = 160;
  let mouse = { x: -9999, y: -9999 };

  function getColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      line: styles.getPropertyValue('--canvas-line').trim(),
      node: styles.getPropertyValue('--canvas-node').trim()
    };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    }));
  }

  function step() {
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.globalAlpha = 1 - dist / MAX_DIST;
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // connection to cursor
      const dx = nodes[i].x - mouse.x;
      const dy = nodes[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST * 1.4) {
        ctx.globalAlpha = 1 - dist / (MAX_DIST * 1.4);
        ctx.strokeStyle = colors.node;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    nodes.forEach((n) => {
      ctx.fillStyle = colors.node;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  createNodes();
  step();

  if (reduceMotion) {
    // draw a single static frame
    step();
  }
})();

/* =========================================================
   Contact form submission
   ========================================================= */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus('Please fill in every field before sending.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', '');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('Thanks! Your message has been sent — I\u2019ll reply by email soon.', 'success');
      form.reset();
    } catch (err) {
      setStatus(err.message || 'Could not send your message. Please email me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ` ${type}` : '');
  }
})();
