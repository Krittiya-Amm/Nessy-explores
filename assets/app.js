/* Nessy Explores — interaction layer */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language toggle (TH / EN) ---------- */
  // Thai is the DOM default; English lives in data-en / data-en-* attributes.
  // Swapping innerHTML keeps inline <strong>/<b> markup intact. This is author
  // content only — no user input flows through here, so innerHTML is safe.
  var langSwitch = document.querySelector('[data-lang-switch]');
  (function () {
    var nodes   = Array.prototype.slice.call(document.querySelectorAll('[data-en]'));
    var ariaEls = Array.prototype.slice.call(document.querySelectorAll('[data-en-label]'));
    var altEls  = Array.prototype.slice.call(document.querySelectorAll('[data-en-alt]'));

    // snapshot the Thai originals once, so we can swap back and forth losslessly
    nodes.forEach(function (el) { el.dataset.th = el.innerHTML; });
    ariaEls.forEach(function (el) { el.dataset.thLabel = el.getAttribute('aria-label') || ''; });
    altEls.forEach(function (el) { el.dataset.thAlt = el.getAttribute('alt') || ''; });

    var titleEN = document.documentElement.getAttribute('data-en-title');
    var titleTH = document.title;
    var meta    = document.querySelector('meta[name="description"]');
    var descEN  = meta && meta.getAttribute('data-en');
    var descTH  = meta && meta.getAttribute('content');

    var setLang = function (lang, persist) {
      var en = lang === 'en';
      document.documentElement.lang = en ? 'en' : 'th';

      nodes.forEach(function (el)   { el.innerHTML = en ? el.getAttribute('data-en') : el.dataset.th; });
      ariaEls.forEach(function (el) { el.setAttribute('aria-label', en ? el.getAttribute('data-en-label') : el.dataset.thLabel); });
      altEls.forEach(function (el)  { el.setAttribute('alt', en ? el.getAttribute('data-en-alt') : el.dataset.thAlt); });

      if (titleEN)        document.title = en ? titleEN : titleTH;
      if (meta && descEN) meta.setAttribute('content', en ? descEN : descTH);

      if (langSwitch) {
        langSwitch.querySelectorAll('[data-set-lang]').forEach(function (b) {
          var on = b.getAttribute('data-set-lang') === (en ? 'en' : 'th');
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-current', on ? 'true' : 'false');
        });
      }

      if (persist) { try { localStorage.setItem('nessy-lang', en ? 'en' : 'th'); } catch (e) {} }
      // let dependent modules (filter counts, etc.) re-render in the new language
      document.dispatchEvent(new CustomEvent('langchange', { detail: { en: en } }));
    };

    if (langSwitch) {
      langSwitch.addEventListener('click', function (e) {
        var b = e.target.closest('[data-set-lang]');
        if (!b) return;
        e.preventDefault();
        setLang(b.getAttribute('data-set-lang'), true);
      });
    }

    var saved = null;
    try { saved = localStorage.getItem('nessy-lang'); } catch (e) {}
    // honour a returning visitor's choice; otherwise keep Thai (the authored markup)
    if (saved === 'en') setLang('en', false);
  })();

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    // aria-label depends on BOTH language and open/closed state, so it can't use
    // the plain data-en-label swap — resolve it here and re-apply on langchange.
    var toggleLabels = {
      th: { open: 'ปิดเมนู',   closed: 'เปิดเมนู' },
      en: { open: 'Close menu', closed: 'Open menu' }
    };
    var applyToggleLabel = function () {
      var open = links.dataset.open === 'true';
      var lang = document.documentElement.lang === 'en' ? 'en' : 'th';
      toggle.setAttribute('aria-label', toggleLabels[lang][open ? 'open' : 'closed']);
    };

    var setOpen = function (open) {
      links.dataset.open = open ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      applyToggleLabel();
      toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    };

    document.addEventListener('langchange', applyToggleLabel);
    applyToggleLabel(); // correct the initial label for the restored language

    toggle.addEventListener('click', function () {
      setOpen(links.dataset.open !== 'true');
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.dataset.open === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  /* ---------- transparent navbar → solid on scroll ---------- */
  var overlayNav = document.querySelector('.navbar-overlay');

  if (overlayNav) {
    // toggle the warmed solid state once the hero has scrolled past ~40px
    var onScroll = function () {
      overlayNav.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll(); // honour a mid-page reload where the user is already scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('reveal-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings by 60ms so grids cascade instead of popping at once
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add('reveal-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el, i) {
      if (!el.dataset.delay) {
        var group = el.parentElement;
        var idx = group ? Array.prototype.indexOf.call(group.children, el) : i;
        el.dataset.delay = String(Math.min(idx, 5) * 60);
      }
      io.observe(el);
    });
  }

  /* ---------- package filter + progressive reveal ---------- */
  var filters = document.querySelector('[data-filters]');

  if (filters) {
    // the catalog cards — exclude the filter tabs, which also carry data-cat
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-cat]:not(.filter-tab)'));
    var empty = document.querySelector('[data-empty]');
    var live = document.querySelector('[data-live]');
    var moreWrap = document.querySelector('[data-more]');
    var moreBtn = document.querySelector('[data-more-btn]');
    var moreLabel = document.querySelector('[data-more-label]');

    var PAGE = 9;            // cards revealed per step — first paint shows one page
    var tabs = Array.prototype.slice.call(filters.querySelectorAll('.filter-tab'));
    var activeTab = filters.querySelector('.filter-tab.is-active');
    var currentCat = activeTab ? activeTab.dataset.cat : 'all';
    var limit = PAGE;

    // Filter copy is generated in JS (not data-en) so the live-region and
    // button strings always match the active language without clashing with
    // the global swap engine.
    var isEN = function () { return document.documentElement.lang === 'en'; };
    var txtLive = function (shown, total, en) {
      return en ? 'Showing ' + shown + ' of ' + total + ' experiences'
                : 'แสดง ' + shown + ' จาก ' + total + ' รายการ';
    };
    var txtMore = function (n, en) {
      return en ? 'See more' : 'ดูเพิ่มเติม';
    };

    // tab captions are generated in JS (not data-en) so they stay in sync with
    // the active language without clashing with the global swap engine
    var renderLabels = function (en) {
      tabs.forEach(function (btn) {
        var base = en ? btn.dataset.nameEn : btn.dataset.nameTh;
        if (!base) return;
        // write into the label span so the tab icon is preserved; fall back to
        // the button itself for any tab without the icon+label structure
        var label = btn.querySelector('.tab-label');
        (label || btn).textContent = base;
      });
    };

    var apply = function () {
      var inCat = 0, shown = 0, firstHidden = null;

      items.forEach(function (item) {
        var match = currentCat === 'all' || item.dataset.cat === currentCat;
        if (!match) { item.hidden = true; return; }
        inCat++;
        if (inCat <= limit) { item.hidden = false; shown++; }
        else { item.hidden = true; if (!firstHidden) firstHidden = item; }
      });

      var en = isEN();
      if (empty) empty.hidden = inCat > 0;
      if (live) live.textContent = txtLive(shown, inCat, en);

      var remaining = inCat - shown;
      if (moreWrap) moreWrap.hidden = remaining <= 0;
      if (moreLabel) moreLabel.textContent = txtMore(remaining, en);

      return firstHidden;
    };

    var select = function (cat, keepPage) {
      currentCat = cat;
      tabs.forEach(function (btn) {
        var on = btn.dataset.cat === cat;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (!keepPage) limit = PAGE;   // a new category always restarts at page one
      apply();
    };

    // one delegated listener handles taps on any tab
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-tab');
      if (!btn || !filters.contains(btn)) return;
      select(btn.dataset.cat);
      // keep the chosen tab in view when the strip is scrolled on small screens
      btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    });

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        limit += PAGE;
        var next = apply();
        // land keyboard / screen-reader focus on the first newly revealed card
        if (next) {
          next.setAttribute('tabindex', '-1');
          next.focus({ preventScroll: true });
        }
      });
    }

    // re-render the JS-generated strings when the visitor switches language
    document.addEventListener('langchange', function () { renderLabels(isEN()); apply(); });

    // deep link: #sea selects that category and scrolls the catalog into view.
    // a hash that matches a real section id (#packages, #local, #about…) is left
    // to the browser, so it scrolls there natively instead of hijacking the filter.
    var fromHash = function () {
      var cat = window.location.hash.slice(1);
      if (document.getElementById(cat)) return false;
      var tab = /^[a-z]+$/.test(cat) && filters.querySelector('.filter-tab[data-cat="' + cat + '"]');
      if (!tab) return false;
      select(cat);
      var section = document.getElementById('packages');
      if (section) section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      return true;
    };

    window.addEventListener('hashchange', fromHash);
    renderLabels(isEN());
    if (!fromHash()) apply();
  }

  /* ---------- loading buttons (package CTAs) ---------- */
  // A tapped package button spins briefly before it acts, so every tap gets an
  // immediate, physical acknowledgement — the way a real booking button behaves.
  // Progressive enhancement: without JS the plain <a href> still works.
  var loadBtns = document.querySelectorAll('[data-loading]');

  loadBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // let modifier / middle clicks (open in new tab) behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      // ignore repeat taps while already spinning
      if (btn.dataset.busy === 'true') { e.preventDefault(); return; }

      var dest = btn.getAttribute('href') || '';
      var inPage = dest.charAt(0) === '#';

      e.preventDefault();
      btn.dataset.busy = 'true';
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');

      var clear = function () {
        btn.dataset.busy = 'false';
        btn.classList.remove('is-loading');
        btn.setAttribute('aria-busy', 'false');
      };

      setTimeout(function () {
        if (!dest) { clear(); return; }
        if (inPage) {
          clear();
          var target = document.getElementById(dest.slice(1));
          if (target) {
            target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
          } else {
            window.location.hash = dest;
          }
        } else {
          // cross-page: keep the spinner up until the next page paints
          window.location.href = dest;
        }
      }, reduced ? 300 : 750);
    });
  });

  /* ---------- scrollspy: light up the nav item you're looking at ---------- */
  // one-page navigation: highlight the section crossing the middle of the viewport.
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );

  if (navLinks.length && 'IntersectionObserver' in window) {
    var watched = [];
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      // the home link points at the top of the page → watch the hero for it
      var el = href === '#main'
        ? document.querySelector('.hero')
        : document.getElementById(href.slice(1));
      if (el) watched.push(el);
    });

    if (watched.length) {
      var markCurrent = function (id) {
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      };

      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) markCurrent(entry.target.id || 'main');
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      watched.forEach(function (el) { spy.observe(el); });
    }
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear() + 543);
  });
})();
