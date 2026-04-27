/* ============================================
   MOURCHID IDOHOU — Portfolio JS v4
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll ───────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ── Active pill nav link on scroll ─────────
    const sections = document.querySelectorAll('section[id]');
    const pillLinks = document.querySelectorAll('.nav-pill-link');

    const observerNav = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pillLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active-link', href === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });
    sections.forEach(s => observerNav.observe(s));

    // ── Close mobile menu on link click ────────
    const navbarCollapse = document.getElementById('navbarContent');
    const bsCollapse = navbarCollapse ? new bootstrap.Collapse(navbarCollapse, { toggle: false }) : null;
    document.querySelectorAll('#navbarContent .nav-link, #navbarContent .btn-primary').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) bsCollapse.hide();
        });
    });

    // ── Scroll reveal ───────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    const observerReveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observerReveal.observe(el));

    // ── Project Tabs filter ─────────────────────
    const tabs = document.querySelectorAll('.proj-tab');
    const projItems = document.querySelectorAll('.proj-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filter = tab.dataset.filter;

            projItems.forEach(item => {
                const cats = item.dataset.cat || '';
                const matches = filter === 'all' || cats.split(' ').includes(filter);

                if (matches) {
                    item.classList.remove('hidden');
                    // Re-trigger animation
                    item.classList.remove('showing');
                    void item.offsetWidth; // reflow
                    item.classList.add('showing');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('showing');
                }
            });
        });
    });

    // ── Typed hero role ─────────────────────────
    const typed = document.getElementById('typed-role');
    if (typed) {
        const roles = ['Développeur Full Stack', 'Mobile Developer', 'Angular Specialist', 'Flutter Developer'];
        let roleIdx = 0, charIdx = 0, deleting = false;
        function typeLoop() {
            const current = roles[roleIdx];
            if (!deleting) {
                typed.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
                setTimeout(typeLoop, 75);
            } else {
                typed.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeLoop, 400); return; }
                setTimeout(typeLoop, 40);
            }
        }
        typeLoop();
    }

    // ── Counter animation ───────────────────────
    const counters = document.querySelectorAll('[data-count]');
    const observerCount = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 30);
            observerCount.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observerCount.observe(c));

    // ── Toast ───────────────────────────────────
    function showToast(msg, success = true) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.background = success ? 'var(--accent)' : '#c0392b';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ── Contact form ────────────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const subject = form.querySelector('#subject').value.trim();
            const message = form.querySelector('#message').value.trim();
            if (!name || !email || !subject || !message) { showToast('⚠️ Veuillez remplir tous les champs.', false); return; }
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi en cours…';
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
            try {
                const res = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });
                if (res.ok) { showToast('✅ Message envoyé ! Je vous répondrai sous 24h.'); form.reset(); }
                else throw new Error();
            } catch {
                const mailto = `mailto:mourchididohou7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`)}`;
                window.location.href = mailto;
                showToast('✅ Votre client email va s\'ouvrir. Merci !');
                form.reset();
            }
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        });
    }

});
