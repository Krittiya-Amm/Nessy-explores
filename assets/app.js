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
      '<div class="modal modal-warn" id="scam-modal" aria-hidden="true">' +
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="scam-title">' +
          '<button class="modal-x" type="button" data-close aria-label="ปิด" data-en-label="Close"><svg class="ic" aria-hidden="true"><use href="#i-close"/></svg></button>' +
          '<div class="modal-body">' +
            '<div class="warn-head">' +
              '<span class="warn-ic"><svg class="ic" aria-hidden="true"><use href="#i-shield"/></svg></span>' +
              '<h3 id="scam-title" data-en="Before you pay, please read">ก่อนโอนเงิน อ่านสักนิด</h3>' +
            '</div>' +
            '<ul class="warn-list">' +
              '<li><svg class="ic" aria-hidden="true"><use href="#i-badge-check"/></svg><span data-en="We\'re a registered company — GAL-SHAI TOUR CO., LTD.">จดทะเบียนนิติบุคคล — บริษัท กาล-ไช ทัวร์ จำกัด (GAL-SHAI TOUR CO., LTD)</span></li>' +
              '<li><svg class="ic" aria-hidden="true"><use href="#i-bank"/></svg><span data-en="We only take payment <strong>into the company\'s corporate account</strong> — the account name matches the company name exactly.">รับชำระผ่าน<strong>บัญชีนิติบุคคลของบริษัทเท่านั้น</strong> ชื่อบัญชีต้องตรงกับชื่อบริษัทเป๊ะ</span></li>' +
              '<li><svg class="ic" aria-hidden="true"><use href="#i-ban"/></svg><span data-en="We <strong>never</strong> accept transfers to a personal account, and we <strong>never</strong> ask for an OTP or password.">เรา<strong>ไม่รับ</strong>โอนเข้าบัญชีบุคคล และ<strong>ไม่เคย</strong>ขอ OTP หรือรหัสผ่าน</span></li>' +
            '</ul>' +
            '<div class="warn-bank">' +
              '<span class="tag" aria-hidden="true">KBank</span>' +
              '<div><b data-en="GAL-SHAI TOUR CO., LTD">บจก. กาล-ไช ทัวร์</b> · <span data-en="Kasikornbank · Acct. no. 332-2-83353-8">ธนาคารกสิกรไทย · เลขที่ 332-2-83353-8</span></div>' +
            '</div>' +
            '<div class="modal-actions">' +
              '<a class="btn btn-primary btn-sm" href="' + LINE_OA + '" target="_blank" rel="noopener" data-en="Verify on LINE">ตรวจสอบทาง LINE</a>' +
              '<button class="btn btn-outline btn-sm" type="button" data-close data-en="Got it">รับทราบ</button>' +
            '</div>' +
            '<p class="modal-note" data-en="If anyone asks you to transfer to a personal account, it is a scam.">หากมีผู้อ้างชื่อเราแล้วให้โอนเข้าบัญชีบุคคล นั่นคือมิจฉาชีพ</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
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

    var img   = document.getElementById('tm-img');
    var rib   = document.getElementById('tm-ribbons');
    var title = document.getElementById('tm-title');
    var meta  = document.getElementById('tm-meta');
    var desc  = document.getElementById('tm-desc');
    var price = document.getElementById('tm-price');

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

      Modal.open(modal);
    }, true);
  })();

  /* ---------- scam-warning modal (once per session, after reaching packages) ---------- */
  (function () {
    var modal = document.getElementById('scam-modal');
    if (!modal) return;
    var KEY = 'nessy-scam-seen';
    var seen;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) { seen = false; }
    if (seen) return;

    // Only surface the warning once the visitor has actually scrolled down to
    // the packages section (where paying becomes relevant). On pages without
    // that section, fall back to a plain scroll-depth threshold.
    var target = document.getElementById('packages') || document.getElementById('catalog');

    var fired = false;
    var trigger = function () {
      if (fired) return;
      var reached;
      if (target) {
        // fire when the top of the packages section has scrolled into view
        reached = target.getBoundingClientRect().top <= window.innerHeight * 0.6;
      } else {
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        reached = y >= Math.max(600, window.innerHeight * 0.6);
      }
      if (!reached) return;
      fired = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      window.removeEventListener('scroll', trigger);
      Modal.open(modal);
    };
    window.addEventListener('scroll', trigger, { passive: true });
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
    // Sample reviews — replace with real Google reviews when the client provides them.
    var DATA = [
      { name: 'คุณณัฐพร', nameEn: 'Nattaporn', meta: 'กรุงเทพฯ · ทริปครอบครัว 6 ท่าน', metaEn: 'Bangkok · Family of 6',
        th: 'วันที่ไปทะเลปิด พี่เขาโทรมาบอกล่วงหน้าตั้งแต่เย็นวันก่อน แล้วช่วยย้ายเป็นทัวร์บนบกให้ฟรี ไม่ต้องตามเรื่องเอง',
        en: 'The day the sea was closed, they called the evening before and moved us to a land tour for free — we didn\'t have to chase anything.' },
      { name: 'Wei & Lin', nameEn: 'Wei & Lin', meta: 'สิงคโปร์ · ทริปฮันนีมูน', metaEn: 'Singapore · Honeymoon',
        th: 'ตอนแรกกลัวโดนหลอกเพราะเคยอ่านข่าว แต่เว็บบอกชัดว่าโอนเข้าบัญชีบริษัทเท่านั้น พอเช็กชื่อบัญชีตรงกันก็สบายใจเลย',
        en: 'I was worried about scams after reading the news, but the site clearly said to transfer only to the company account — once the name matched, I felt at ease.' },
      { name: 'คุณกิตติ', nameEn: 'Kitti', meta: 'เชียงใหม่ · เดินทางคนเดียว', metaEn: 'Chiang Mai · Solo trip',
        th: 'ไปทัวร์เมืองเก่ากับไกด์ที่โตที่ภูเก็ต ได้กินร้านที่ไม่มีในกูเกิล อันนี้คือของจริง ไม่ใช่ทัวร์ถ่ายรูปเช็กอิน',
        en: 'Did the Old Town tour with a guide who grew up in Phuket and ate at places you won\'t find on Google. The real thing, not a check-in photo tour.' },
      { name: 'Mika', nameEn: 'Mika', meta: 'โอซาก้า · กลุ่มเพื่อน 4 คน', metaEn: 'Osaka · Group of 4',
        th: 'ดำน้ำครั้งแรกในชีวิต ไกด์ใจเย็นมาก ค่อย ๆ สอนทีละสเต็ปจนกล้าลงน้ำ ดูแลความปลอดภัยทุกจุด สนุกเกินคาด',
        en: 'My first ever dive. The guide was so patient, walking me through every step until I felt brave enough — safe throughout and far more fun than I expected.' },
      { name: 'คุณอรวรรณ', nameEn: 'Orawan', meta: 'ขอนแก่น · ทริปพ่อแม่', metaEn: 'Khon Kaen · With parents',
        th: 'จองง่ายมาก ตอบไลน์ไว บอกราคาชัดเจนไม่มีบวกเพิ่มหน้างาน ประทับใจการดูแลผู้สูงอายุในกลุ่มมาก',
        en: 'Super easy to book, quick replies on LINE, clear pricing with no surprises on the day. They looked after the older folks in our group so well.' },
      { name: 'James', nameEn: 'James', meta: 'ออสเตรเลีย · คู่รัก', metaEn: 'Australia · Couple',
        th: 'สปีดโบ๊ทไปพีพีจัดการดีมาก ไม่รู้สึกแออัด ไกด์รู้จุดดำน้ำเงียบ ๆ ที่คนไม่เยอะ',
        en: 'The speedboat to Phi Phi was well organised and never felt crowded. Our guide knew the quiet snorkelling spots away from the crowds.' },
      { name: 'คุณพิมพ์ชนก', nameEn: 'Pimchanok', meta: 'นนทบุรี · ทริปเพื่อน', metaEn: 'Nonthaburi · Friends',
        th: 'ทีมงานคนภูเก็ตจริง แนะนำร้านอาหารถิ่นได้ดีมาก ได้กินของอร่อยที่ไม่เคยรู้มาก่อน',
        en: 'A genuinely local Phuket team — their food picks were spot on. We ate amazing local dishes we\'d never have found ourselves.' },
      { name: 'Sophie', nameEn: 'Sophie', meta: 'ฝรั่งเศส · เดินทางคนเดียว', metaEn: 'France · Solo traveller',
        th: 'รู้สึกปลอดภัยตลอดการเดินทางในฐานะผู้หญิงเที่ยวคนเดียว ทุกอย่างโปร่งใส ไกด์มืออาชีพและเป็นมิตร',
        en: 'Felt safe the whole time as a solo female traveller. Everything was transparent and the guide was professional and friendly.' }
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
      var stars = '';
      for (var s = 0; s < 5; s++) stars += '<svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>';
      return '<figure class="greview">' +
        '<div class="greview-top">' +
          '<span class="g-init" aria-hidden="true" style="background:' + color + '">' + esc(name.trim().charAt(0).toUpperCase()) + '</span>' +
          '<span><b>' + esc(name) + '</b><span>' + esc(meta) + '</span></span>' +
          '<svg class="gmark" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-google"/></svg>' +
        '</div>' +
        '<span class="greview-stars" aria-label="' + (en ? 'Rated 5 out of 5' : 'ให้คะแนน 5 เต็ม 5') + '">' + stars + '</span>' +
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

    var isEN = function () { return document.documentElement.lang === 'en'; };

    // selections
    var picks = { style: [], time: null, zone: null };
    var stepIndex = 0; // 0-based

    // result presets — each scores against the picks; highest wins
    var RESULTS = [
      {
        href: '#sea',
        th: { title: 'เกาะสวย น้ำใส สายชิลล์', desc: 'ล่องเรือเที่ยวเกาะระดับโลก น้ำใสหาดทรายขาว ดำน้ำตื้นชมปะการัง แล้วเก็บภาพสวย ๆ แบบไม่ต้องรีบ', tags: ['ทะเล', 'ถ่ายรูปสวย', 'ชิลล์'] },
        en: { title: 'Island Escape', desc: 'Cruise to world-class islands, swim in crystal-clear water and snorkel over coral — a relaxed day of postcard views.', tags: ['On the Sea', 'Photo', 'Chill'] },
        style: { chill: 2, photo: 2, nature: 1, family: 1 }, time: { half: 1, day: 2, multi: 1 }, zone: { sea: 3 }
      },
      {
        href: '#dive',
        th: { title: 'โลกใต้น้ำ & กิจกรรมทางน้ำ', desc: 'ดำน้ำตื้น-ลึกชมแนวปะการังที่สมบูรณ์ เติมความมันกับเจ็ตสกีและพาราเซล เหมาะกับสายผจญภัยที่รักทะเล', tags: ['ดำน้ำ', 'ผจญภัย', 'ทะเล'] },
        en: { title: 'Underwater Phuket', desc: 'Snorkel and dive healthy reefs, then add a jet-ski or parasail — for sea-lovers who want a little adrenaline.', tags: ['Diving', 'Adventure', 'On the Sea'] },
        style: { adventure: 3, nature: 1 }, time: { half: 1, day: 2 }, zone: { sea: 2 }
      },
      {
        href: '#local',
        th: { title: 'เมืองเก่า & วิถีคนถิ่น', desc: 'เดินย่านเมืองเก่า ชิมอาหารถิ่น ตลาดเช้า และหมู่บ้านชาวเล สัมผัสภูเก็ตในมุมที่คนอยู่ที่นี่รู้จัก', tags: ['เมืองเก่า', 'อาหารถิ่น', 'วัฒนธรรม'] },
        en: { title: 'Old Town & Local Life', desc: 'Wander the old town, taste local food and morning markets, and meet a sea-gypsy village — Phuket the way locals know it.', tags: ['Old Town', 'Local Food', 'Culture'] },
        style: { local: 3, photo: 1, family: 1, chill: 1 }, time: { half: 2, day: 1 }, zone: { locallife: 3, around: 1 }
      },
      {
        href: '#local',
        th: { title: 'ธรรมชาติ & ที่ลับเฉพาะ', desc: 'ตามหามุมที่คนไม่ค่อยรู้จัก น้ำตก จุดชมวิว และธรรมชาติเงียบสงบรอบภูเก็ต–พังงา แบบที่ Local Expert พาไป', tags: ['ธรรมชาติ', 'Hidden Gems', 'ผจญภัย'] },
        en: { title: 'Hidden Nature Trail', desc: 'Seek out lesser-known spots — waterfalls, viewpoints and quiet nature around Phuket and Phang Nga, guided by a local.', tags: ['Nature', 'Hidden Gems', 'Adventure'] },
        style: { nature: 3, adventure: 2 }, time: { day: 1, multi: 2 }, zone: { hidden: 3, around: 2 }
      },
      {
        href: '#packages',
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

    var showStep = function (idx) {
      stepIndex = idx;
      steps.forEach(function (s, i) {
        s.hidden = i !== idx;
        s.classList.toggle('is-active', i === idx);
      });
      curEl.textContent = '0' + (idx + 1);
      fillEl.style.width = ((idx + 1) / steps.length * 100).toFixed(2) + '%';
      updateNav();
    };

    var renderResult = function () {
      if (!matched) return;
      var en = isEN();
      var data = en ? matched.en : matched.th;
      result.querySelector('[data-tm-title]').textContent = data.title;
      result.querySelector('[data-tm-desc]').textContent = data.desc;
      var tagsWrap = result.querySelector('[data-tm-tags]');
      tagsWrap.innerHTML = data.tags.map(function (t) {
        return '<span class="tm-tag">' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
      }).join('');
      result.querySelector('[data-tm-cta]').setAttribute('href', matched.href);
    };

    var showResult = function () {
      matched = bestMatch();
      renderResult();
      form.hidden = true;
      result.hidden = false;
      result.classList.add('is-shown');
      fillEl.style.width = '100%';
      curEl.textContent = '03';
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
    });

    nextBtn.addEventListener('click', function () {
      if (!stepReady(stepIndex)) return;
      if (stepIndex === steps.length - 1) showResult();
      else showStep(stepIndex + 1);
    });

    backBtn.addEventListener('click', function () {
      if (stepIndex > 0) showStep(stepIndex - 1);
    });

    restart.addEventListener('click', function () {
      picks = { style: [], time: null, zone: null };
      matched = null;
      form.querySelectorAll('.tm-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      result.hidden = true;
      result.classList.remove('is-shown');
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

    var markers = Array.prototype.slice.call(root.querySelectorAll('.ow-marker'));
    var map     = root.querySelector('.ow-map');
    var popup   = root.querySelector('[data-ow-popup]');
    if (!markers.length || !map || !popup) return;

    var elTime  = popup.querySelector('[data-ow-time]');
    var elTag   = popup.querySelector('[data-ow-tag]');
    var elTitle = popup.querySelector('[data-ow-storytitle]');
    var elQuote = popup.querySelector('[data-ow-quote]');

    var isEN = function () { return document.documentElement.lang === 'en'; };

    var STOPS = [
      { time: '07:30',
        th: { tag: 'ตลาดเช้า', title: 'ตลาดสดยามเช้า', quote: 'เริ่มวันด้วยกาแฟโบราณกับปาท่องโก๋ ตลาดที่คนภูเก็ตมาจ่ายกับข้าวกันจริง ๆ ก่อนสิบโมงของก็หมดแล้ว' },
        en: { tag: 'Morning Market', title: 'The morning market', quote: 'Start with kopi and patongko where locals actually shop — by ten it’s all gone.' } },
      { time: '09:00',
        th: { tag: 'เมืองเก่า', title: 'ตรอกเมืองเก่า', quote: 'เดินดูตึกชิโน-โปรตุกีสตอนแดดยังไม่แรง มุมถ่ายรูปดีที่สุดคือก่อนร้านเปิด' },
        en: { tag: 'Old Town', title: 'Old-town lanes', quote: 'Walk the Sino-Portuguese shophouses before the heat — the best photos are before the shops open.' } },
      { time: '11:00',
        th: { tag: 'ร้านโกปี๊', title: 'ร้านโกปี๊ไม่มีป้าย', quote: 'ร้านที่ไม่มีป้ายภาษาอังกฤษ สั่งโอเลี้ยงกับขนมจีบ นั่งฟังคนแก่คุยกันเรื่องเรือ' },
        en: { tag: 'Kopi Shop', title: 'The kopi shop with no sign', quote: 'No English sign. Order o-liang and dim sum, and listen to the old folks talk about boats.' } },
      { time: '13:30',
        th: { tag: 'หาดลับ', title: 'หาดเล็กที่คนไม่ค่อยรู้', quote: 'หาดเล็ก ๆ ที่รถทัวร์เข้าไม่ถึง น้ำใส คนน้อย เอาเสื่อไปปูนอนฟังคลื่นได้ทั้งบ่าย' },
        en: { tag: 'Hidden Beach', title: 'A beach few people know', quote: 'A small cove the tour coaches can’t reach — clear water, few people, a whole afternoon of waves.' } },
      { time: '16:00',
        th: { tag: 'จุดชมวิว', title: 'จุดชมวิวมุมคนถิ่น', quote: 'ไม่ใช่จุดชมวิวยอดฮิต แต่เห็นทะเลได้กว้างกว่า ลมเย็น ๆ รอแสงเริ่มเปลี่ยนสี' },
        en: { tag: 'Viewpoint', title: 'A local’s viewpoint', quote: 'Not the famous lookout — a wider sea view, cool wind, waiting for the light to turn.' } },
      { time: '18:30',
        th: { tag: 'หมู่บ้านชาวเล', title: 'ราไวย์ตอนเรือกลับฝั่ง', quote: 'จบวันที่ราไวย์ ดูเรือชาวเลกลับเข้าฝั่ง กินอาหารทะเลสด ๆ ริมหาดตอนพระอาทิตย์ตก' },
        en: { tag: 'Sea-gypsy Village', title: 'Rawai as the boats come in', quote: 'End at Rawai, watching the sea-gypsy boats return — fresh seafood on the sand as the sun drops.' } }
    ];

    var current = -1;

    var fill = function (i) {
      var s = STOPS[i];
      if (!s) return;
      var d = isEN() ? s.en : s.th;
      elTime.textContent  = s.time;
      elTag.textContent   = d.tag;
      elTitle.textContent = d.title;
      elQuote.textContent = d.quote;
    };

    // place the popup above the pin (or below when there's no room), arrow on the marker
    var place = function (marker) {
      var mr = map.getBoundingClientRect();
      var pr = marker.getBoundingClientRect();
      var markerX = pr.left + pr.width / 2 - mr.left;
      var pinTop  = pr.top - mr.top;
      var pinBase = pr.bottom - mr.top;
      var gap = 12;
      var half = popup.offsetWidth / 2;
      var ph  = popup.offsetHeight;

      var below = pinTop - gap - ph < 0;
      popup.classList.toggle('above', !below);
      popup.classList.toggle('below', below);
      popup.style.top = (below ? pinBase + gap : pinTop - gap - ph) + 'px';

      var cx = Math.max(half + 4, Math.min(mr.width - half - 4, markerX));
      popup.style.left = cx + 'px';
      popup.style.setProperty('--arrow-x', (markerX - (cx - half)) + 'px');
    };

    var open = function (i, marker) {
      current = i;
      fill(i);
      popup.hidden = false;
      place(marker);            // reads layout → flushes a reflow while still hidden
      void popup.offsetWidth;   // ensure the pre-open state is committed
      popup.classList.add('is-open');
      markers.forEach(function (m, k) {
        m.classList.toggle('is-active', k === i);
        m.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
    };

    var close = function () {
      current = -1;
      popup.classList.remove('is-open');
      markers.forEach(function (m) {
        m.classList.remove('is-active');
        m.setAttribute('aria-pressed', 'false');
      });
    };

    popup.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'opacity' && !popup.classList.contains('is-open')) {
        popup.hidden = true;
      }
    });

    markers.forEach(function (m, i) {
      m.setAttribute('aria-pressed', 'false');
      m.addEventListener('mouseenter', function () { open(i, m); });
      m.addEventListener('mouseleave', close);
      m.addEventListener('focus', function () { open(i, m); });
      m.addEventListener('blur', close);
      m.addEventListener('click', function () {           // touch / mouse tap
        if (current === i) { close(); } else { open(i, m); }
      });
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, m); }
        else if (e.key === 'Escape') { close(); m.blur(); }
      });
    });

    // keep it glued to the pin while the page reflows
    window.addEventListener('resize', function () {
      if (current > -1) place(markers[current]);
    });
    document.addEventListener('langchange', function () {
      if (current > -1) { fill(current); place(markers[current]); }
    });
  })();

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear() + 543);
  });
})();
