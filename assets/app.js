/* Nessy Explores — interaction layer */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LINE_OA = 'https://line.me/R/ti/p/~@nessyexplores';

  /* On a page refresh, always open at the very top — even if the URL still
     carries an in-page hash from earlier navigation. Fresh visits that arrive
     with a hash (shared deep links) are left alone. Uses an instant jump
     because the page sets scroll-behavior: smooth, and re-asserts after load
     to beat the browser's own scroll restoration. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var navEntry = (window.performance && performance.getEntriesByType &&
                  performance.getEntriesByType('navigation')[0]) || null;
  var isReload = navEntry ? navEntry.type === 'reload'
               : (window.performance && performance.navigation && performance.navigation.type === 1);
  if (isReload) {
    var toTop = function () { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
    window.addEventListener('pageshow', toTop);
    window.addEventListener('load', function () { toTop(); requestAnimationFrame(toTop); });
  }

  /* ---------- inject shared overlays (scam warning + cookie consent) ----------
     Injected here, before the language module snapshots [data-en] nodes, so these
     overlays translate like the rest of the page. Kept in JS so every page gets
     them without duplicating markup. */
  (function () {
    if (!document.body) return;
    var html =
      '<div class="cookie" id="cookie-banner" role="dialog" aria-live="polite" aria-label="การใช้คุกกี้" data-en-label="Cookie notice">' +
        '<p data-en="We use cookies to give you a better browsing experience. See our <a href=\'#\'>privacy policy</a>.">เว็บไซต์นี้ใช้คุกกี้เพื่อมอบประสบการณ์การใช้งานที่ดีขึ้น อ่านเพิ่มเติมได้ที่<a href="#">นโยบายความเป็นส่วนตัว</a></p>' +
        '<div class="cookie-actions">' +
          '<button class="btn btn-primary btn-sm" type="button" data-cookie="accept" data-en="Accept">ยอมรับ</button>' +
          '<button class="btn btn-outline btn-sm" type="button" data-cookie="decline" data-en="Decline">ปฏิเสธ</button>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML('beforeend', html);
  })();

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

  /* ---------- hero parallax (subtle) ---------- */
  var heroArt = document.querySelector('.hero-art');
  if (heroArt && !reduced) {
    var heroMax = 46;      // px of downward drift across the hero's height
    var heroTicking = false;
    var moveHero = function () {
      var y = window.scrollY;
      var shift = Math.min(y * 0.18, heroMax);
      heroArt.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
      heroTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!heroTicking) { heroTicking = true; window.requestAnimationFrame(moveHero); }
    }, { passive: true });
    moveHero();
  }

  /* ---------- generic parallax ([data-parallax]) ----------
     Layered depth for editorial imagery and journal annotations. Each element
     drifts by data-parallax px (sign = direction) as it crosses the viewport.
     Transform is applied through the --par-y custom property so any base
     transform in CSS (e.g. the note's rotate) is preserved. Off for reduced
     motion; damped on small screens. */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    var mqSmallP = window.matchMedia('(max-width: 640px)');
    var pTicking = false;
    var vhP = window.innerHeight;
    var moveParallax = function () {
      var damp = mqSmallP.matches ? 0.4 : 1;
      var center = vhP / 2;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vhP + 80) { pTicking = false; return; }
        var elCenter = rect.top + rect.height / 2;
        var progress = (center - elCenter) / vhP;          // ~-0.5 … ~0.5
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
        var y = progress * speed * damp;
        el.style.setProperty('--par-y', y.toFixed(1) + 'px');
      });
      pTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!pTicking) { pTicking = true; window.requestAnimationFrame(moveParallax); }
    }, { passive: true });
    window.addEventListener('resize', function () { vhP = window.innerHeight; moveParallax(); }, { passive: true });
    moveParallax();
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

  /* ---------- Beyond the Shore: light each step number as it reaches mid-screen ---------- */
  var btsSteps = document.querySelectorAll('#beyond .bts-step');
  if (btsSteps.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      btsSteps.forEach(function (el) { el.classList.add('is-lit'); });
    } else {
      // fires when a step crosses the vertical centre band of the viewport, so
      // numbers deepen one at a time as the reader scrolls (stays lit after)
      var litIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-lit');
          litIo.unobserve(entry.target);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      btsSteps.forEach(function (el) { litIo.observe(el); });
    }
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
        var match = currentCat === 'all' || (' ' + item.dataset.cat + ' ').indexOf(' ' + currentCat + ' ') !== -1;
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

  /* ---------- click-to-play video (brand film) ----------
     Keeps YouTube (and its third-party scripts/cookies) out of the initial
     load: the poster + play button are shown until the visitor clicks, then we
     swap in a privacy-friendly nocookie iframe that autoplays. Progressive
     enhancement — without JS the element is a plain link to the clip. */
  var videoFrame = document.querySelector('.video-frame[data-video]');
  if (videoFrame) {
    videoFrame.addEventListener('click', function (e) {
      // let modifier / middle clicks open YouTube in a new tab as normal
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      if (videoFrame.classList.contains('is-playing')) return;
      e.preventDefault();

      var id = videoFrame.getAttribute('data-video');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = videoFrame.getAttribute('aria-label') || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');

      videoFrame.classList.add('is-playing');
      videoFrame.appendChild(iframe);
      requestAnimationFrame(function () { try { iframe.focus(); } catch (err) {} });
    });
  }

  /* ---------- modals (shared shell: tour detail + scam warning) ---------- */
  var Modal = (function () {
    var openEl = null;
    var lastFocus = null;

    function open(modal, focusEl) {
      if (openEl) close();
      openEl = modal;
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var f = focusEl || modal.querySelector('.modal-x, [data-close], button, a');
      // element just switched from display:none → focus on next frame so it lands
      if (f && f.focus) {
        requestAnimationFrame(function () { try { f.focus(); } catch (e) {} });
      }
    }

    function close() {
      if (!openEl) return;
      openEl.classList.remove('is-open');
      openEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      openEl = null;
      lastFocus = null;
    }

    // click on any [data-close] (backdrop or X) closes the current modal
    document.addEventListener('click', function (e) {
      if (openEl && e.target.closest('[data-close]')) { e.preventDefault(); close(); }
    });
    // Esc closes
    document.addEventListener('keydown', function (e) {
      if (openEl && (e.key === 'Escape' || e.key === 'Esc')) close();
    });

    return { open: open, close: close, current: function () { return openEl; } };
  })();

  /* ---------- tour detail modal ---------- */
  (function () {
    var modal = document.getElementById('tour-modal');
    if (!modal) return;

    var img    = document.getElementById('tm-img');
    var rib    = document.getElementById('tm-ribbons');
    var title  = document.getElementById('tm-title');
    var meta   = document.getElementById('tm-meta');
    var desc   = document.getElementById('tm-desc');
    var price  = document.getElementById('tm-price');
    var detail = document.getElementById('tm-detail');

    var copy = function (from, to, prop) {
      if (from) { to[prop] = from[prop]; } else { to[prop] = ''; }
    };

    // Capture phase on document → runs before each card button's bubble-phase
    // data-loading handler; stopPropagation() neutralises that navigation so the
    // card (and its "สอบถาม" button) opens the detail modal instead.
    document.addEventListener('click', function (e) {
      var card = e.target.closest('article.tour');
      if (!card) return;
      // let modifier / middle clicks behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      // clicking the "สอบถาม" CTA (or any link) must follow its href straight to
      // LINE — don't hijack it into the detail modal
      if (e.target.closest('a[href]')) return;

      e.preventDefault();
      e.stopPropagation();

      var cImg = card.querySelector('.tour-media img');
      img.src = cImg ? cImg.getAttribute('src') : '';
      img.alt = cImg ? (cImg.getAttribute('alt') || '') : '';

      var cRib = card.querySelector('.ribbons');
      rib.innerHTML = cRib ? cRib.innerHTML : '';

      copy(card.querySelector('h3'), title, 'innerHTML');
      copy(card.querySelector('.tour-meta'), meta, 'innerHTML');
      copy(card.querySelector('.tour-desc'), desc, 'innerHTML');
      copy(card.querySelector('.tour-foot .price'), price, 'innerHTML');

      // optional per-card detail block (ticket types / options); hidden when absent
      if (detail) {
        var cDetail = card.querySelector('.tour-detail');
        detail.innerHTML = cDetail ? cDetail.innerHTML : '';
        detail.hidden = !cDetail;
      }

      Modal.open(modal);
    }, true);
  })();


  /* ---------- cookie consent (localStorage, once) ---------- */
  (function () {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    var KEY = 'nessy-cookie-consent';
    var choice;
    try { choice = localStorage.getItem(KEY); } catch (e) { choice = null; }
    if (choice) return; // already accepted/declined

    // slide in shortly after load so it doesn't fight first paint
    setTimeout(function () { banner.classList.add('is-open'); }, 800);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      try { localStorage.setItem(KEY, btn.getAttribute('data-cookie')); } catch (err) {}
      banner.classList.remove('is-open');
    });
  })();

  /* ---------- Google-style review marquee ---------- */
  (function () {
    var track = document.getElementById('greviews-track');
    if (!track) return;

    var COLORS = ['#087F83', '#F47A5B', '#F5BE4F', '#123B4A', '#017E87', '#EA4335'];
    // Real Google reviews. Review text is kept in the customer's original words
    // (not translated) and shown in both languages; only name/meta are localised.
    var DATA = [
      { name: 'Yinon Hadar', nameEn: 'Yinon Hadar', rating: 5, meta: 'ทัวร์ 4 เกาะ · สปีดโบ๊ท', metaEn: '4 Islands tour · Speedboat',
        th: "We booked the 4 islands tour, (actually it was 5). It was as explained and more than expected. The 3 engine speedboat was not crowded. The sea was calm, light wind, even some rain for a few minutes. Crew headed by Mou Mou was efficient, helpful and very informative. We had a great day, thanks.",
        en: "We booked the 4 islands tour, (actually it was 5). It was as explained and more than expected. The 3 engine speedboat was not crowded. The sea was calm, light wind, even some rain for a few minutes. Crew headed by Mou Mou was efficient, helpful and very informative. We had a great day, thanks." },
      { name: 'Avraham Shachar', nameEn: 'Avraham Shachar', rating: 5, meta: 'Siam Niramit + Hanuman World', metaEn: 'Siam Niramit + Hanuman World',
        th: "We only booked two trips through them, but we had a great experience. We booked the Siam Niramit show and Hanuman World ziplines. The prices were cheaper or similarly priced to what we found online. You get more than what you pay for with great service and quality transport to the activities. Thank you!",
        en: "We only booked two trips through them, but we had a great experience. We booked the Siam Niramit show and Hanuman World ziplines. The prices were cheaper or similarly priced to what we found online. You get more than what you pay for with great service and quality transport to the activities. Thank you!" },
      { name: 'Natan Krichevski', nameEn: 'Natan Krichevski', rating: 5, meta: 'ทริปดำน้ำตื้น', metaEn: 'Snorkeling trip',
        th: "I had an amazing experience! The team was very professional, friendly, and helpful. They gave me all the information I needed and arranged a fantastic snorkeling trip. Everything was perfectly organized — I was picked up and dropped off right on time. Excellent service and great attitude. Highly recommend!",
        en: "I had an amazing experience! The team was very professional, friendly, and helpful. They gave me all the information I needed and arranged a fantastic snorkeling trip. Everything was perfectly organized — I was picked up and dropped off right on time. Excellent service and great attitude. Highly recommend!" },
      { name: 'Ron Messer', nameEn: 'Ron Messer', rating: 5, meta: 'จอง 3 ทริป', metaEn: 'Booked 3 trips',
        th: "We have booked 3 different trips with them, prices were actually cheaper than other places we checked, and we had to make changes — they changed it fast with no questions and no extra charge. Overall very good experience.",
        en: "We have booked 3 different trips with them, prices were actually cheaper than other places we checked, and we had to make changes — they changed it fast with no questions and no extra charge. Overall very good experience." },
      { name: 'David Ventzovski', nameEn: 'David Ventzovski', rating: 5, meta: 'เฟอร์รี่ไปกระบี่', metaEn: 'Ferry to Krabi',
        th: "Good staff and cheap prices. A very nice girl helped us get a ferry to Krabi with a lot of smiles and great instructions.",
        en: "Good staff and cheap prices. A very nice girl helped us get a ferry to Krabi with a lot of smiles and great instructions." },
      { name: 'Perry Sage', nameEn: 'Perry Sage', rating: 3, meta: 'อาหาร & ทัวร์', metaEn: 'Food & tours',
        th: "Falafel was undercooked, and people were yelling and smoking all around you to sell trips to the islands. Otherwise, good food.",
        en: "Falafel was undercooked, and people were yelling and smoking all around you to sell trips to the islands. Otherwise, good food." },
      { name: 'Ido Ben Gigi', nameEn: 'Ido Ben Gigi', rating: 4, meta: 'รถรับส่ง', metaEn: 'Transfer & pickup',
        th: "Good prices. The driver arrived at the time stated to pick us up.",
        en: "Good prices. The driver arrived at the time stated to pick us up." },
      { name: 'Company Account', nameEn: 'Company Account', rating: 5, meta: 'อาหาร & บริการ', metaEn: 'Food & service',
        th: "Best place ever. Best food. Best service. I'm so happy I found this place. Thank you!",
        en: "Best place ever. Best food. Best service. I'm so happy I found this place. Thank you!" },
      { name: 'Doron Nisenbaum', nameEn: 'Doron Nisenbaum', rating: 5, meta: 'อาหาร & กิจกรรม', metaEn: 'Food & attractions',
        th: "Lovely staff and good food. Also good prices for attractions.",
        en: "Lovely staff and good food. Also good prices for attractions." },
      { name: 'D. V. Baecker Holdings', nameEn: 'D. V. Baecker Holdings', rating: 5, meta: 'ร้านอาหาร', metaEn: 'Restaurant',
        th: "Good restaurant with friendly people. The hummus was very good.",
        en: "Good restaurant with friendly people. The hummus was very good." }
    ];

    var esc = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    var isEN = function () { return document.documentElement.lang === 'en'; };

    var cardHTML = function (d, i) {
      var en = isEN();
      var name = en ? (d.nameEn || d.name) : d.name;
      var meta = en ? d.metaEn : d.meta;
      var text = en ? d.en : d.th;
      var color = COLORS[i % COLORS.length];
      var rating = d.rating || 5;
      var stars = '';
      for (var s = 0; s < 5; s++) {
        stars += '<svg class="ic' + (s < rating ? '' : ' is-empty') + '" aria-hidden="true"><use href="#i-star"/></svg>';
      }
      return '<figure class="greview">' +
        '<div class="greview-top">' +
          '<span class="g-init" aria-hidden="true" style="background:' + color + '">' + esc(name.trim().charAt(0).toUpperCase()) + '</span>' +
          '<span><b>' + esc(name) + '</b><span>' + esc(meta) + '</span></span>' +
          '<svg class="gmark" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-google"/></svg>' +
        '</div>' +
        '<span class="greview-stars" aria-label="' + (en ? ('Rated ' + rating + ' out of 5') : ('ให้คะแนน ' + rating + ' เต็ม 5')) + '">' + stars + '</span>' +
        '<p>' + esc(text) + '</p>' +
      '</figure>';
    };

    var render = function () {
      var one = DATA.map(cardHTML).join('');
      // duplicate the set so the -50% keyframe loops seamlessly
      track.innerHTML = one + one;
      var figs = track.children;
      for (var i = DATA.length; i < figs.length; i++) figs[i].setAttribute('aria-hidden', 'true');
    };

    render();
    document.addEventListener('langchange', render);
  })();

  /* ---------- Find Your Phuket — trip matcher ---------- */
  (function () {
    var root = document.querySelector('[data-tripmatch]');
    if (!root) return;

    var form    = root.querySelector('[data-tm-form]');
    var steps   = Array.prototype.slice.call(form.querySelectorAll('.tm-step'));
    var backBtn = form.querySelector('[data-tm-back]');
    var nextBtn = form.querySelector('[data-tm-next]');
    var curEl   = root.querySelector('[data-tm-current]');
    var fillEl  = root.querySelector('[data-tm-fill]');
    var result  = root.querySelector('[data-tm-result]');
    var restart = root.querySelector('[data-tm-restart]');
    var startPanel = root.querySelector('[data-tm-start]');
    var startBtn   = root.querySelector('[data-tm-startbtn]');
    var progress   = root.querySelector('.tm-progress');
    var track      = root.querySelector('[data-tm-track]');
    var dots       = track ? Array.prototype.slice.call(track.querySelectorAll('[data-tm-dot]')) : [];
    var matchingEl = root.querySelector('[data-tm-matching]');
    var advanceTimer = null, matchTimer = null;

    var isEN = function () { return document.documentElement.lang === 'en'; };

    // selections
    var picks = { style: [], time: null, zone: null };
    var stepIndex = 0; // 0-based

    // result presets — each scores against the picks; highest wins
    var RESULTS = [
      {
        cat: 'sea',
        th: { title: 'เกาะสวย น้ำใส สายชิลล์', desc: 'ล่องเรือเที่ยวเกาะระดับโลก น้ำใสหาดทรายขาว ดำน้ำตื้นชมปะการัง แล้วเก็บภาพสวย ๆ แบบไม่ต้องรีบ', tags: ['ทะเล', 'ถ่ายรูปสวย', 'ชิลล์'] },
        en: { title: 'Island Escape', desc: 'Cruise to world-class islands, swim in crystal-clear water and snorkel over coral — a relaxed day of postcard views.', tags: ['On the Sea', 'Photo', 'Chill'] },
        style: { chill: 2, photo: 2, nature: 1, family: 1 }, time: { half: 1, day: 2, multi: 1 }, zone: { sea: 3 }
      },
      {
        cat: 'dive',
        th: { title: 'โลกใต้น้ำ & กิจกรรมทางน้ำ', desc: 'ดำน้ำตื้น-ลึกชมแนวปะการังที่สมบูรณ์ เติมความมันกับเจ็ตสกีและพาราเซล เหมาะกับสายผจญภัยที่รักทะเล', tags: ['ดำน้ำ', 'ผจญภัย', 'ทะเล'] },
        en: { title: 'Underwater Phuket', desc: 'Snorkel and dive healthy reefs, then add a jet-ski or parasail — for sea-lovers who want a little adrenaline.', tags: ['Diving', 'Adventure', 'On the Sea'] },
        style: { adventure: 3, nature: 1 }, time: { half: 1, day: 2 }, zone: { sea: 2 }
      },
      {
        cat: 'local',
        th: { title: 'เมืองเก่า & วิถีคนถิ่น', desc: 'เดินย่านเมืองเก่า ชิมอาหารถิ่น ตลาดเช้า และหมู่บ้านชาวเล สัมผัสภูเก็ตในมุมที่คนอยู่ที่นี่รู้จัก', tags: ['เมืองเก่า', 'อาหารถิ่น', 'วัฒนธรรม'] },
        en: { title: 'Old Town & Local Life', desc: 'Wander the old town, taste local food and morning markets, and meet a sea-gypsy village — Phuket the way locals know it.', tags: ['Old Town', 'Local Food', 'Culture'] },
        style: { local: 3, photo: 1, family: 1, chill: 1 }, time: { half: 2, day: 1 }, zone: { locallife: 3, around: 1 }
      },
      {
        cat: 'adventure',
        th: { title: 'ธรรมชาติ & ที่ลับเฉพาะ', desc: 'ตามหามุมที่คนไม่ค่อยรู้จัก น้ำตก จุดชมวิว และธรรมชาติเงียบสงบรอบภูเก็ต–พังงา แบบที่ Local Expert พาไป', tags: ['ธรรมชาติ', 'Hidden Gems', 'ผจญภัย'] },
        en: { title: 'Hidden Nature Trail', desc: 'Seek out lesser-known spots — waterfalls, viewpoints and quiet nature around Phuket and Phang Nga, guided by a local.', tags: ['Nature', 'Hidden Gems', 'Adventure'] },
        style: { nature: 3, adventure: 2 }, time: { day: 1, multi: 2 }, zone: { hidden: 3, around: 2 }
      },
      {
        cat: 'show',
        th: { title: 'ครอบครัวเที่ยวสบาย', desc: 'จัดทริปที่เด็ก ๆ และผู้ใหญ่สนุกด้วยกัน กิจกรรมไม่หนัก เดินทางสะดวก มีตัวเลือกโชว์และสวนสนุกให้เลือก', tags: ['ครอบครัว', 'สบาย ๆ', 'สนุก'] },
        en: { title: 'Easy Family Day', desc: 'A trip the whole family enjoys — easy-going activities, smooth transfers, plus show and theme-park options.', tags: ['Family', 'Easy', 'Fun'] },
        style: { family: 3, chill: 1, photo: 1 }, time: { half: 2, day: 2 }, zone: { around: 2, sea: 1 }
      }
    ];

    var matched = null; // remember for langchange re-render

    var score = function (r) {
      var s = 0, i;
      for (i = 0; i < picks.style.length; i++) s += r.style[picks.style[i]] || 0;
      if (picks.time) s += r.time[picks.time] || 0;
      if (picks.zone) s += r.zone[picks.zone] || 0;
      return s;
    };

    var bestMatch = function () {
      var best = RESULTS[0], bestScore = -1;
      RESULTS.forEach(function (r) {
        var sc = score(r);
        if (sc > bestScore) { bestScore = sc; best = r; }
      });
      return best;
    };

    // is the current step satisfied? step 1 needs 1–2 styles, others need one pick
    var stepReady = function (idx) {
      if (idx === 0) return picks.style.length >= 1;
      if (idx === 1) return !!picks.time;
      return !!picks.zone;
    };

    var updateNav = function () {
      backBtn.hidden = stepIndex === 0;
      nextBtn.disabled = !stepReady(stepIndex);
      var last = stepIndex === steps.length - 1;
      nextBtn.querySelector('[data-en]').innerHTML =
        last ? (isEN() ? 'See my match' : 'ดูผลลัพธ์') : (isEN() ? 'Next' : 'ถัดไป');
      // keep data-en in sync so the global swap engine stays correct
      nextBtn.querySelector('[data-en]').setAttribute('data-en', last ? 'See my match' : 'Next');
    };

    // light up the level tracker: cleared rounds get a check, current one glows
    var setDots = function (activeIdx) {
      dots.forEach(function (d, i) {
        d.classList.toggle('is-done', i < activeIdx);
        d.classList.toggle('is-active', i === activeIdx);
      });
    };

    var showStep = function (idx) {
      stepIndex = idx;
      steps.forEach(function (s, i) {
        s.hidden = i !== idx;
        s.classList.toggle('is-active', i === idx);
      });
      curEl.textContent = '0' + (idx + 1);
      fillEl.style.width = ((idx + 1) / steps.length * 100).toFixed(2) + '%';
      setDots(idx);
      updateNav();
    };

    // the recommended package type mirrors a real catalog category, so the
    // label always matches the filter tab the CTA will open
    var catName = function (cat, en) {
      var tab = document.querySelector('.filter-tab[data-cat="' + cat + '"]');
      if (!tab) return '';
      return en ? tab.dataset.nameEn : tab.dataset.nameTh;
    };

    var renderResult = function () {
      if (!matched) return;
      var en = isEN();
      var data = en ? matched.en : matched.th;
      var typeEl = result.querySelector('[data-tm-type]');
      if (typeEl) typeEl.textContent = catName(matched.cat, en);
      result.querySelector('[data-tm-title]').textContent = data.title;
      result.querySelector('[data-tm-desc]').textContent = data.desc;
      var tagsWrap = result.querySelector('[data-tm-tags]');
      tagsWrap.innerHTML = data.tags.map(function (t) {
        return '<span class="tm-tag">' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
      }).join('');
    };

    // CTA: open the matching package category in the catalog, then scroll there.
    // Clicking the filter tab reuses the catalog's own selection logic, so this
    // works even for categories (like Local Phuket) whose hash collides with a
    // section id and can't be reached by a plain deep-link.
    var cta = result.querySelector('[data-tm-cta]');
    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        if (matched && matched.cat && matched.cat !== 'all') {
          var tab = document.querySelector('.filter-tab[data-cat="' + matched.cat + '"]');
          if (tab) tab.click();
        }
        var pk = document.getElementById('packages');
        if (pk) pk.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    }

    // reveal the matched package — springs the result card in
    var revealResult = function () {
      matched = bestMatch();
      renderResult();
      if (matchingEl) matchingEl.hidden = true;
      result.hidden = false;
      result.classList.add('is-shown');
      fillEl.style.width = '100%';
      curEl.textContent = '03';
      setDots(steps.length); // all three rounds cleared
    };

    // gate the reveal behind a short "matching…" beat so the result feels earned
    var showResult = function () {
      form.hidden = true;
      if (reduced || !matchingEl) { revealResult(); return; }
      result.hidden = true;
      result.classList.remove('is-shown');
      matchingEl.hidden = false;
      clearTimeout(matchTimer);
      matchTimer = setTimeout(revealResult, 950);
    };

    // chip toggles
    form.addEventListener('click', function (e) {
      var chip = e.target.closest('.tm-chip');
      if (!chip) return;
      var group = chip.dataset.group;
      var value = chip.dataset.value;

      if (group === 'style') {
        var at = picks.style.indexOf(value);
        if (at > -1) { picks.style.splice(at, 1); chip.setAttribute('aria-pressed', 'false'); }
        else if (picks.style.length < 2) { picks.style.push(value); chip.setAttribute('aria-pressed', 'true'); }
        // if already 2 picked and a new one clicked, ignore (hint says 1–2)
      } else {
        // single-select
        picks[group] = value;
        chip.closest('.tm-chips').querySelectorAll('.tm-chip').forEach(function (c) {
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
      }
      updateNav();

      // game feel: single-choice rounds auto-advance so a tap flows straight to
      // the next question (or the result). The multi-pick "vibe" step waits for
      // the Next button so people can pick a second option.
      if (group !== 'style' && stepReady(stepIndex)) {
        clearTimeout(advanceTimer);
        advanceTimer = setTimeout(function () {
          if (stepIndex === steps.length - 1) showResult();
          else showStep(stepIndex + 1);
        }, reduced ? 0 : 480);
      }
    });

    // reveal the quiz from the start gate — the questions stay hidden until "Start"
    var beginQuiz = function (focusFirst) {
      clearTimeout(advanceTimer); clearTimeout(matchTimer);
      if (startPanel) startPanel.hidden = true;
      if (progress) progress.hidden = false;
      if (matchingEl) matchingEl.hidden = true;
      result.hidden = true;
      result.classList.remove('is-shown');
      form.hidden = false;
      showStep(0);
      if (focusFirst) {
        var firstChip = form.querySelector('.tm-chip');
        if (firstChip) firstChip.focus({ preventScroll: true });
      }
    };

    if (startBtn) startBtn.addEventListener('click', function () { beginQuiz(true); });

    // skip the quiz — jump straight to the Popular tab in the catalog
    var popBtn = root.querySelector('[data-tm-popular]');
    if (popBtn) {
      popBtn.addEventListener('click', function () {
        var tab = document.querySelector('.filter-tab[data-cat="popular"]');
        if (tab) tab.click();
        var pk = document.getElementById('packages');
        if (pk) pk.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    }

    nextBtn.addEventListener('click', function () {
      clearTimeout(advanceTimer);
      if (!stepReady(stepIndex)) return;
      if (stepIndex === steps.length - 1) showResult();
      else showStep(stepIndex + 1);
    });

    backBtn.addEventListener('click', function () {
      clearTimeout(advanceTimer);
      if (stepIndex > 0) showStep(stepIndex - 1);
    });

    restart.addEventListener('click', function () {
      clearTimeout(advanceTimer); clearTimeout(matchTimer);
      picks = { style: [], time: null, zone: null };
      matched = null;
      form.querySelectorAll('.tm-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      result.hidden = true;
      result.classList.remove('is-shown');
      if (matchingEl) matchingEl.hidden = true;
      if (startPanel) startPanel.hidden = true;
      if (progress) progress.hidden = false;
      form.hidden = false;
      showStep(0);
    });

    document.addEventListener('langchange', function () {
      updateNav();
      renderResult();
    });

    showStep(0);
  })();

  /* ---------- Phuket, Our Way — local day map ---------- */
  (function () {
    var root = document.querySelector('.ourway');
    if (!root) return;

    var modeBtns = Array.prototype.slice.call(root.querySelectorAll('[data-ow-mode]'));
    var mapEl    = root.querySelector('.ow-map');
    var markers  = mapEl ? Array.prototype.slice.call(mapEl.querySelectorAll('.ow-marker')) : [];
    var listEl   = root.querySelector('[data-ow-list]');
    var popup    = root.querySelector('[data-ow-popup]');
    if (!mapEl || !listEl || !popup) return;

    var elImg   = popup.querySelector('img');

    var isEN = function () { return document.documentElement.lang === 'en'; };

    // half day (ครึ่งวัน) and full day (1 วัน) are two independent itineraries;
    // the map pins are re-labelled per mode from whichever set is active.
    var HALF = [
      { time: '08:00', icon: '#i-food', img: 'assets/img/mee-ton-poe.webp',
        th: { tag: 'มื้อเช้า', title: 'ร้านหมี่ต้นโพธิ์', quote: 'ร้านดังระดับตำนาน เปิดมากว่า 70 ปี เมนูขึ้นชื่อคือหมี่ผัดฮกเกี้ยนใส่ไข่' },
        en: { tag: 'Breakfast', title: 'Mee Ton Poe', quote: 'A legendary noodle shop open for over 70 years — famous for Hokkien fried noodles with egg.' } },
      { time: '10:00', icon: '#i-bank', img: 'assets/img/old-town.webp', pos: 'center 22%',
        th: { tag: 'เมืองเก่า', title: 'เดินเล่นเมืองเก่า', quote: 'เดินถนนถลาง ซอยรมณีย์ ถนนดีบุก ถนนพังงา แวะร้านหนังสือ แกลเลอรี และชมอาคารชิโน-โปรตุกีส' },
        en: { tag: 'Old Town', title: 'Old-town stroll', quote: 'Wander Thalang, Soi Romanee, Dibuk and Phang Nga roads — bookshops, galleries and Sino-Portuguese shophouses.' } },
      { time: '12:00', icon: '#i-food', img: 'assets/img/one-chun.webp',
        th: { tag: 'มิชลิน', title: 'ร้านวันจันทร์ (One Chun)', quote: 'หนึ่งในร้านอาหารพื้นเมืองภูเก็ตที่โด่งดังที่สุดย่านเมืองเก่า การันตีด้วยรางวัล Michelin Bib Gourmand 8 ปีติดต่อกัน (2026)' },
        en: { tag: 'Michelin', title: 'One Chun Cafe & Restaurant', quote: 'One of Phuket’s most famous local restaurants in the Old Town — a Michelin Bib Gourmand for 8 years running (2026).' } }
    ];

    var FULL = [
      { time: '07:00', icon: '#i-food', img: 'assets/img/boonrat-dimsum.webp', pos: 'center 72%',
        th: { tag: 'มื้อเช้า', title: 'บุญรัตน์ติ่มซำ สาขา 1', quote: 'เริ่มเช้าแบบคนภูเก็ตด้วยติ่มซำร้านดังเปิดมานาน ซาลาเปา ขนมจีบ ฮะเก๋า ร้อน ๆ กับชาจีนสักถ้วย' },
        en: { tag: 'Breakfast', title: 'Boonrat Dim Sum (Branch 1)', quote: 'Start the morning like a local with dim sum from a long-time favourite — steamed buns, dumplings and Chinese tea.' } },
      { time: '08:30', icon: '#i-ship', img: 'assets/img/koh-hey.webp',
        th: { tag: 'ทะเล', title: 'เกาะเฮ', quote: 'นั่งสปีดโบ๊ทข้ามไปเกาะเฮ น้ำใสฟ้าเทอร์ควอยซ์ เล่นน้ำ ดำน้ำตื้นดูปะการังใกล้ฝั่ง' },
        en: { tag: 'Island', title: 'Coral Island (Koh Hey)', quote: 'Speedboat across to Coral Island — turquoise water, swimming and easy snorkelling over the reef.' } },
      { time: '13:00', icon: '#i-food', img: 'assets/img/mor-mudong.webp',
        th: { tag: 'มื้อเที่ยง', title: 'ร้านอาหารหมอมูดง', quote: 'อาหารใต้พื้นบ้านแท้ ๆ ในป่าชายเลน นั่งซุ้มไม้ไผ่ส่วนตัว รสจัดจ้านถึงเครื่องแกงใต้ ร้านที่คนพื้นที่นิยมมาก' },
        en: { tag: 'Lunch', title: 'Mor Mudong', quote: 'Authentic southern-Thai food in the mangroves — private bamboo huts and bold, fiery local curries the locals love.' } },
      { time: '15:00', icon: '#i-waves', img: 'assets/img/kata-noi.webp',
        th: { tag: 'คาเฟ่ริมหาด', title: 'หาดกะตะน้อย', quote: 'พักผ่อนถ่ายรูปชิค ๆ ที่คาเฟ่ริมหาดกะตะน้อย หาดเงียบ น้ำใส วิวสวยกำลังดี' },
        en: { tag: 'Beach cafe', title: 'Kata Noi Beach', quote: 'Unwind at a beachfront cafe on Kata Noi — a quiet cove, clear water and a perfect view.' } },
      { time: '17:15', icon: '#i-mountain', img: 'assets/img/windmill-viewpoint.webp',
        th: { tag: 'จุดชมวิว', title: 'จุดชมวิวกังหันลม', quote: 'แวะจุดชมวิวกังหันลม มองเห็นหาดยะนุ้ยและทะเลกว้าง รับลมเย็น ๆ ก่อนพระอาทิตย์ตก' },
        en: { tag: 'Viewpoint', title: 'Windmill Viewpoint', quote: 'Stop at the Windmill Viewpoint for the sweep of Yanui Beach and the open sea in the cooling wind.' } },
      { time: '18:00', icon: '#i-sun', img: 'assets/img/promthep-view.webp',
        th: { tag: 'พระอาทิตย์ตก', title: 'แหลมพรหมเทพ', quote: 'ปิดท้ายวันด้วยแสงสุดท้ายที่แหลมพรหมเทพ จุดชมพระอาทิตย์ตกยอดฮิตของภูเก็ต' },
        en: { tag: 'Sunset', title: 'Promthep Cape', quote: 'End the day with the last light at Promthep Cape — Phuket’s most-loved sunset spot.' } }
    ];

    var mode = 'full';
    var STOPS = FULL;

    // warm the cache so the place image shows instantly in the popup
    HALF.concat(FULL).forEach(function (s) { var im = new Image(); im.src = s.img; });

    var inMode = function (i) { return i < STOPS.length; };
    var openIdx = -1;          // stop currently shown in the popup (-1 = closed)

    // ---- full itinerary list (left) — static reference info, not linked to the map ----
    var renderList = function () {
      var en = isEN();
      listEl.textContent = '';
      STOPS.forEach(function (s, i) {
        if (!inMode(i)) return;
        var d = en ? s.en : s.th;
        var li = document.createElement('li');
        li.className = 'ow-item';
        li.setAttribute('data-stop', String(i));

        var row = document.createElement('div');
        row.className = 'ow-row';
        row.innerHTML =
          '<span class="ow-row-ic" aria-hidden="true"><svg class="ic"><use href="' + s.icon + '"/></svg></span>' +
          '<span class="ow-row-body">' +
            '<span class="ow-row-head">' +
              '<span class="ow-row-time">' + s.time + '</span>' +
              '<span class="ow-row-title"></span>' +
            '</span>' +
            '<span class="ow-row-quote"></span>' +
          '</span>';
        row.querySelector('.ow-row-title').textContent = d.title;
        row.querySelector('.ow-row-quote').textContent = d.quote;

        li.appendChild(row);
        listEl.appendChild(li);
      });
    };

    // ---- sync the map pins (icon / time / label) with the active itinerary ----
    var updateMarkers = function () {
      var en = isEN();
      markers.forEach(function (m) {
        var i = parseInt(m.getAttribute('data-stop'), 10);
        var s = STOPS[i];
        if (!s) return;                     // pin hidden by CSS in half-day mode
        var d = en ? s.en : s.th;
        var use = m.querySelector('.ow-ic');
        if (use) { use.setAttribute('href', s.icon); use.setAttribute('xlink:href', s.icon); }
        var t = m.querySelector('.ow-time');
        if (t) t.textContent = s.time;
        m.setAttribute('aria-label', (en ? 'Stop ' : 'หมุดที่ ') + (i + 1) + ' · ' + s.time + ' · ' + d.title);
      });
    };

    // ---- image popup on the map (image only) ----
    var fill = function (i) {
      var s = STOPS[i];
      var d = isEN() ? s.en : s.th;
      if (elImg.getAttribute('src') !== s.img) { elImg.src = s.img; }
      elImg.style.objectPosition = s.pos || 'center';
      elImg.style.objectFit = s.fit || 'cover';
      elImg.parentElement.style.background = s.bg || '';
      elImg.alt = d.title;
    };

    // position the popup on the map, near the pin (above unless it clips the top)
    var place = function (marker) {
      var mr = mapEl.getBoundingClientRect();
      var pr = marker.getBoundingClientRect();
      var markerX = pr.left + pr.width / 2 - mr.left;
      var pinTop  = pr.top - mr.top;
      var pinBase = pr.bottom - mr.top;
      var gap = 12, half = popup.offsetWidth / 2, ph = popup.offsetHeight;
      var below = pinTop - gap - ph < 0;
      popup.classList.toggle('above', !below);
      popup.classList.toggle('below', below);
      popup.style.top = (below ? pinBase + gap : pinTop - gap - ph) + 'px';
      var cx = Math.max(half + 4, Math.min(mr.width - half - 4, markerX));
      popup.style.left = cx + 'px';
      popup.style.setProperty('--arrow-x', (markerX - (cx - half)) + 'px');
    };

    var markerFor = function (i) {
      for (var k = 0; k < markers.length; k++) {
        if (markers[k].getAttribute('data-stop') === String(i)) return markers[k];
      }
      return null;
    };

    var setActive = function (i) {
      markers.forEach(function (m) {
        m.classList.toggle('is-active', m.getAttribute('data-stop') === String(i));
      });
    };

    var open = function (i) {
      if (!inMode(i)) return;
      var marker = markerFor(i);
      if (!marker) return;
      openIdx = i;
      fill(i);
      setActive(i);
      popup.hidden = false;
      // measure after it is rendered, then place + reveal
      requestAnimationFrame(function () {
        place(marker);
        popup.classList.add('is-open');
      });
    };

    var close = function () {
      openIdx = -1;
      popup.classList.remove('is-open');
      setActive(-1);
    };
    popup.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'opacity' && !popup.classList.contains('is-open')) {
        popup.hidden = true;
      }
    });

    // ---- trip-length filter (full day / half day) ----
    var setMode = function (m) {
      mode = m;
      STOPS = m === 'half' ? HALF : FULL;
      modeBtns.forEach(function (b) {
        var on = b.getAttribute('data-ow-mode') === m;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      mapEl.classList.toggle('ow-half', m === 'half');
      updateMarkers();
      renderList();
      // if the open place is now hidden, close the popup
      if (openIdx !== -1 && !inMode(openIdx)) close();
    };

    modeBtns.forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-ow-mode')); });
    });

    // each map pin drives the popup (hover, focus, or tap)
    markers.forEach(function (m) {
      var i = parseInt(m.getAttribute('data-stop'), 10);
      m.addEventListener('mouseenter', function () { open(i); });
      m.addEventListener('mouseleave', close);
      m.addEventListener('focus', function () { open(i); });
      m.addEventListener('blur', close);
      m.addEventListener('click', function () { open(i); });
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
        if (e.key === 'Escape') { close(); m.blur(); }
      });
    });

    // keep the popup glued to its pin while the layout shifts
    window.addEventListener('resize', function () {
      if (openIdx === -1) return;
      var marker = markerFor(openIdx);
      if (marker) place(marker);
    });

    // re-render list + popup text on language switch
    document.addEventListener('langchange', function () {
      updateMarkers();
      renderList();
      if (openIdx !== -1) fill(openIdx);
    });

    updateMarkers();
    renderList();
  })();

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear() + 543);
  });
})();
