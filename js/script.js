/* ============================================================
   Bauer Fliesen & Naturstein – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile Menu ---------- */
  const toggle = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');
  const cta = document.querySelector('.navbar__cta');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      if (cta) cta.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen.toString());
      // Animate hamburger
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        nav.classList.remove('open');
        if (cta) cta.classList.remove('open');
      }
    });
  }

  /* ---------- Sticky Navbar Shadow ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar__nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ---------- Scroll Animation ---------- */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      observer.observe(el);
    });
  } else {
    animatedEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Counter Animation ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    const isDecimal = el.dataset.decimal === 'true';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('de-DE');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- Cookie Banner ---------- */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner) {
    // Check if already accepted
    if (!localStorage.getItem('bauer-cookie-consent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('bauer-cookie-consent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }

    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('bauer-cookie-consent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  /* ---------- Personalized Banner (URL Params) ---------- */
  // Already handled inline via <script> in HTML, no action needed here.

  /* ---------- Form Validation ---------- */
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          field.style.borderColor = '#e53e3e';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Anfrage gesendet!';
        btn.disabled = true;
        btn.style.backgroundColor = '#2d8a4e';
        btn.style.borderColor = '#2d8a4e';

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          form.reset();
        }, 4000);
      }
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

// ========================

// ========================
// Demo Personalisierung
// ========================
(function () {
  // Params aus URL lesen → sessionStorage speichern
  var p = new URLSearchParams(window.location.search);
  ['firma','name','stadt','telefon'].forEach(function(k) {
    if (p.get(k)) sessionStorage.setItem('ws_'+k, p.get(k));
  });

  var firma   = sessionStorage.getItem('ws_firma');
  var name    = sessionStorage.getItem('ws_name');
  var stadt   = sessionStorage.getItem('ws_stadt');
  var telefon = sessionStorage.getItem('ws_telefon');

  // Telefon-Fallback per Stadt (wenn kein Lead-Telefon vorhanden)
  if (!telefon) {
    var CITY_PHONES = {
      'Stuttgart-Mitte':'0711 48 27 93','Stuttgart-Nord':'0711 38 16 74',
      'Stuttgart-Süd':'0711 62 93 41','Stuttgart-Ost':'0711 57 84 20',
      'Stuttgart-West':'0711 29 54 86','Bad Cannstatt':'0711 56 83 12',
      'Vaihingen':'0711 74 29 61','Zuffenhausen':'0711 83 47 25',
      'Feuerbach':'0711 94 61 38','Degerloch':'0711 46 82 57',
      'Möhringen':'0711 73 19 84','Stammheim':'0711 85 34 67',
      'Mühlhausen':'0711 91 46 23','Böblingen':'07031 6 48 27',
      'Sindelfingen':'07031 8 37 45','Esslingen':'0711 39 72 56',
      'Ostfildern':'0711 48 65 31','Leinfelden-Echterdingen':'0711 97 28 43',
      'Ludwigsburg':'07141 8 36 29','Kornwestheim':'07141 5 74 83',
      'Bietigheim-Bissingen':'07142 4 82 67','Waiblingen':'07151 6 93 48',
      'Fellbach':'0711 58 37 94','Schorndorf':'07181 4 72 85',
      'Winnenden':'07195 9 38 62','Göppingen':'07161 7 48 23',
      'Kirchheim unter Teck':'07021 8 53 46','Nürtingen':'07022 6 47 91',
      'Leonberg':'07152 5 83 27','Ditzingen':'07156 4 69 38',
      'Gerlingen':'07156 9 24 71','Korntal-Münchingen':'07150 3 84 56',
      'Remshalden':'07151 8 37 24','Plochingen':'07153 6 48 92',
      'Wendlingen':'07024 5 73 81'
    };
    telefon = (stadt && CITY_PHONES[stadt]) || '0711 48 27 93';
    sessionStorage.setItem('ws_telefon', telefon);
  }

  function replaceInText(node, oldStr, newStr) {
    if (!oldStr || oldStr === newStr) return;
    if (node.nodeType === 3) {
      if (node.textContent.indexOf(oldStr) !== -1)
        node.textContent = node.textContent.split(oldStr).join(newStr);
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (var i = 0; i < node.childNodes.length; i++)
        replaceInText(node.childNodes[i], oldStr, newStr);
    }
  }

  function replaceTelLinks(newTel) {
    var clean = newTel.replace(/\s/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
      a.setAttribute('href', 'tel:' + clean);
      if (/^[0-9\s\-\/\+\(\)]+$/.test(a.textContent.trim()))
        a.textContent = newTel;
    });
  }

  function run() {
    if (firma) {
      var demoNames = ['Bauer Fliesen & Naturstein München', 'Bauer Fliesen & Naturstein', 'Bauer Fliesen'];
      demoNames.forEach(function(n) { replaceInText(document.body, n, firma); });
      document.title = demoNames.reduce(function(t,n){ return t.split(n).join(firma); }, document.title);
    }
    if (stadt) {
      var demoCities = ['München'];
      demoCities.forEach(function(c) { replaceInText(document.body, c, stadt); });
      document.title = demoCities.reduce(function(t,c){ return t.split(c).join(stadt); }, document.title);
    }
    // Logo direkt ersetzen – Text ist auf mehrere Nodes aufgeteilt
    if (firma) {
      var logoEl = document.querySelector('a.logo, a.navbar__logo, a.navbar-brand');
      if (logoEl) {
        var iconEl = logoEl.querySelector('i, .logo-icon, .navbar__logo-icon');
        var iconHTML = iconEl ? iconEl.outerHTML : '';
        logoEl.innerHTML = iconHTML + (iconHTML ? ' ' : '') + firma;
      }
    }
    if (telefon) {
      var demoPhones = ['089 456789', '089456789'];
      demoPhones.forEach(function(ph) { replaceInText(document.body, ph, telefon); });
      replaceTelLinks(telefon);
    }
    if (name) {
      var banner = document.getElementById('personalized-banner');
      var nameEl = document.getElementById('banner-name');
      if (banner && nameEl) {
        nameEl.textContent = name;
        banner.style.display = 'block';
        // Zu <html> verschieben – body overflow-x:hidden bricht sonst position:fixed
        if (banner.parentNode !== document.documentElement) {
          document.documentElement.appendChild(banner);
        }
        document.body.style.paddingTop = '50px';
      }
    }
  }

  // Script steht am Ende von <body> – DOM ist bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
