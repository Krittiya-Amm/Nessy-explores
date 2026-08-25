/* Nessy Explores — SVG sprite (icons + scene artwork)
   Loaded synchronously at the top of <body> so every <use href="#..."> resolves
   during initial parse. Icons: Lucide-style, 24px grid, stroke 1.75 via CSS.
   Scene artwork uses the brand book's blue ramp. The Sunset accent appears
   only on light sources (sun, lanterns, headlights, stage beams), the dusk
   horizon and the human figures — everything else is blue, which keeps the
   warm accent near 3% of any illustration.
   Swap a scene for real photography by replacing
   <svg><use href="#s-..."/></svg> with <img src="..." alt="...">. */
(function () {
  var SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"
     style="position:absolute;width:0;height:0;overflow:hidden">
<defs>

<!-- ===== gradients used by scene artwork ===== -->
<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#57ABDF"/><stop offset=".55" stop-color="#DBEDFA"/>
  <stop offset="1" stop-color="#EAF7FD"/>
</linearGradient>
<linearGradient id="g-sky-dusk" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#123A5A"/><stop offset=".5" stop-color="#3F6E8D"/>
  <stop offset="1" stop-color="#F5A055"/>
</linearGradient>
<linearGradient id="g-sea" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2E8AC6"/><stop offset="1" stop-color="#0E5080"/>
</linearGradient>
<linearGradient id="g-sea-light" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#62B6E7"/><stop offset="1" stop-color="#1677B8"/>
</linearGradient>
<linearGradient id="g-jungle" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#12639B"/><stop offset="1" stop-color="#123A5A"/>
</linearGradient>
<radialGradient id="g-sun" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#FFD3A3"/><stop offset=".7" stop-color="#F5A055"/>
  <stop offset="1" stop-color="#F5A055" stop-opacity="0"/>
</radialGradient>
<linearGradient id="g-stage" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#123A5A"/><stop offset="1" stop-color="#0C2A42"/>
</linearGradient>

<!-- ===== icons ===== -->
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
<symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-ban" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></symbol>
<!-- brand marks (filled): render via .ic-brand { fill:currentColor; stroke:none } — FontAwesome brands, viewBox 0 0 448 512 -->
<symbol id="i-line" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.5-186.6 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-map" viewBox="0 0 24 24"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/></symbol>
<symbol id="i-plane" viewBox="0 0 24 24"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></symbol>
<symbol id="i-google" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.59-5.17 3.59-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.86 11.86 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></symbol>
<symbol id="i-waves" viewBox="0 0 24 24"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/></symbol>
<symbol id="i-ship" viewBox="0 0 24 24"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3"/></symbol>
<symbol id="i-anchor" viewBox="0 0 24 24"><path d="M12 22V8"/><circle cx="12" cy="5" r="3"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></symbol>
<symbol id="i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></symbol>
<symbol id="i-mountain" viewBox="0 0 24 24"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></symbol>
<symbol id="i-fish" viewBox="0 0 24 24"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z"/><path d="M18 12v.01"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/></symbol>
<symbol id="i-car" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></symbol>
<symbol id="i-sparkles" viewBox="0 0 24 24"><path d="m13 3 1.9 5.1L20 10l-5.1 1.9L13 17l-1.9-5.1L6 10l5.1-1.9L13 3z"/><path d="M5 15v3M3.5 16.5h3"/></symbol>
<symbol id="i-briefcase" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></symbol>
<symbol id="i-bank" viewBox="0 0 24 24"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2 4 7h16l-8-5z"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
<symbol id="i-percent" viewBox="0 0 24 24"><path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>
<symbol id="i-camera" viewBox="0 0 24 24"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></symbol>
<symbol id="i-food" viewBox="0 0 24 24"><path d="M3 2v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2M5.5 2v20"/><path d="M18 2a3 3 0 0 0-3 3v7h3v10"/></symbol>
<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></symbol>
<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/></symbol>
<symbol id="i-badge-check" viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
<symbol id="i-zap" viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></symbol>
<symbol id="i-palette" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.55C22 6 17.46 2 12 2z"/><circle cx="6.5" cy="11.5" r="1.2"/><circle cx="9.5" cy="7.5" r="1.2"/><circle cx="14.5" cy="7.5" r="1.2"/><circle cx="17.5" cy="11.5" r="1.2"/></symbol>
<symbol id="i-type" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></symbol>
<symbol id="i-ruler" viewBox="0 0 24 24"><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><path d="M14.5 12.5 12 10M11.5 15.5 9 13M8.5 18.5 6 16M17.5 9.5 15 7"/></symbol>
<symbol id="i-a11y" viewBox="0 0 24 24"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1M5 8l3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6M13.76 17.5a5 5 0 0 0-6.88-6"/></symbol>
<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></symbol>
<symbol id="i-facebook" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>
<symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M16.5 3c.24 1.4.9 2.66 1.9 3.6a5.7 5.7 0 0 0 3.1 1.45v3.3a8.9 8.9 0 0 1-4.4-1.2v6.06a6.06 6.06 0 1 1-6.06-6.06c.32 0 .64.03.95.08v3.4a2.75 2.75 0 1 0 1.9 2.62V3z"/></symbol>
<symbol id="i-youtube" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.58A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.58 9.4.58 9.4.58s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></symbol>
<symbol id="i-external" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></symbol>

<!-- ===== scene artwork (4:3 cards) =====
     Each scene: sky -> distant karsts -> sea -> subject -> foreground -->

<symbol id="s-island" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-sky)"/>
  <circle cx="312" cy="76" r="52" fill="url(#g-sun)"/>
  <circle cx="312" cy="76" r="21" fill="#FFE3C6" opacity=".9"/>
  <path d="M28 168c14-42 25-58 39-58s24 17 37 58z" fill="#123A5A" opacity=".28"/>
  <path d="M250 170c18-52 32-72 49-72s30 21 46 72z" fill="#123A5A" opacity=".34"/>
  <path d="M96 172c22-64 40-88 61-88s37 26 57 88z" fill="#12639B" opacity=".55"/>
  <path d="M0 168h400v132H0z" fill="url(#g-sea)"/>
  <path d="M0 168h400v10c-40 8-70-6-108 0s-62 10-96 2-84 4-116-4z" fill="#62B6E7" opacity=".5"/>
  <path d="M40 210c14 0 14-8 28-8s14 8 28 8M180 232c16 0 16-9 32-9s16 9 32 9M280 200c12 0 12-7 24-7s12 7 24 7" stroke="#DBEDFA" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M148 222h84l-10 16h-64z" fill="#EAF7FD"/>
  <path d="M158 222V196l30 26z" fill="#E08A3C"/>
  <path d="M190 222v-30l22 30z" fill="#EAF7FD"/>
  <path d="M156 196h2v26h-2z" fill="#123A5A"/>
</symbol>

<symbol id="s-dive" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-sea-light)"/>
  <path d="M0 0h400v54c-46 14-88-10-140 2S150 74 100 62 40 46 0 56z" fill="#DBEDFA" opacity=".55"/>
  <g opacity=".85">
    <path d="M118 150c14-40 62-64 106-64s72 26 84 64c-12 40-40 66-84 66s-92-26-106-66z" fill="#F5A055"/>
    <path d="M118 150c22-14 40-40 40-64-30 6-52 30-40 64zM118 150c22 14 40 40 40 64-30-6-52-30-40-64z" fill="#E08A3C"/>
    <circle cx="272" cy="134" r="7" fill="#123A5A"/>
    <path d="M300 118a52 52 0 0 1 0 64" stroke="#123A5A" stroke-width="4" fill="none" opacity=".5"/>
  </g>
  <g fill="#EAF7FD" opacity=".7">
    <circle cx="322" cy="66" r="9"/><circle cx="344" cy="42" r="6"/><circle cx="306" cy="40" r="4"/>
  </g>
  <path d="M0 300c0-40 18-56 40-56s28 20 34 56zM90 300c6-46 26-68 52-68s42 24 50 68z" fill="#12639B" opacity=".8"/>
  <path d="M240 300c8-34 24-50 44-50s34 18 42 50z" fill="#0E5080" opacity=".85"/>
  <g stroke="#EAF7FD" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round">
    <path d="M40 20v30M92 8v26M348 14v24"/>
  </g>
</symbol>

<symbol id="s-adventure" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-sky)"/>
  <circle cx="80" cy="62" r="40" fill="url(#g-sun)"/>
  <path d="M180 158c26-76 46-104 70-104s44 30 66 104z" fill="#123A5A" opacity=".3"/>
  <path d="M0 300c0-96 34-142 76-142s70 44 92 142z" fill="url(#g-jungle)"/>
  <path d="M120 300c14-72 44-108 82-108s68 34 88 108z" fill="#12639B"/>
  <path d="M0 262h400v38H0z" fill="#0C2A42" opacity=".55"/>
  <g stroke="#DBEDFA" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M18 96 382 66"/>
  </g>
  <g fill="#E08A3C">
    <rect x="188" y="98" width="34" height="10" rx="5"/>
    <circle cx="205" cy="126" r="14"/>
    <path d="M198 138h14l6 30h-26z"/>
  </g>
  <path d="M205 108v6" stroke="#123A5A" stroke-width="3"/>
  <g fill="#EAF7FD" opacity=".35">
    <ellipse cx="316" cy="46" rx="40" ry="12"/><ellipse cx="132" cy="34" rx="30" ry="9"/>
  </g>
</symbol>

<symbol id="s-show" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-stage)"/>
  <g fill="#F5A055" opacity=".2">
    <path d="M60 300 130 40h24L104 300zM340 300 270 40h-24l50 260z"/>
  </g>
  <g fill="#EAF7FD" opacity=".8">
    <circle cx="60" cy="48" r="3"/><circle cx="120" cy="30" r="2"/><circle cx="200" cy="40" r="2.5"/>
    <circle cx="286" cy="26" r="2"/><circle cx="340" cy="52" r="3"/><circle cx="158" cy="66" r="1.8"/>
    <circle cx="248" cy="70" r="1.8"/>
  </g>
  <ellipse cx="200" cy="252" rx="150" ry="30" fill="#F5A055" opacity=".22"/>
  <g fill="#E08A3C">
    <circle cx="200" cy="150" r="20"/>
    <path d="M182 176h36l14 76h-64z"/>
    <path d="M182 178 148 138l-9 10 34 46zM218 178l34-40 9 10-34 46z"/>
  </g>
  <g fill="#F5A055">
    <path d="M200 116c14-16 30-6 22 10-6 12-22 18-22 18s-16-6-22-18c-8-16 8-26 22-10z"/>
  </g>
  <g fill="#2E8AC6" opacity=".9">
    <circle cx="126" cy="184" r="14"/><path d="M112 204h28l10 48h-48z"/>
    <circle cx="274" cy="184" r="14"/><path d="M260 204h28l10 48h-48z"/>
  </g>
  <rect y="252" width="400" height="48" fill="#0C2A42"/>
</symbol>

<symbol id="s-local" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-sky-dusk)"/>
  <g fill="#EAF7FD" opacity=".9">
    <path d="M60 300V150h64v150z"/><path d="M132 300V178h54v122z"/><path d="M212 300V138h58v162z"/><path d="M278 300V186h52v114z"/>
  </g>
  <g fill="#1677B8">
    <path d="M52 152h80l-14-22H66z"/><path d="M126 180h66l-12-20h-42z"/>
    <path d="M204 140h74l-14-22h-46z"/><path d="M272 188h64l-12-20h-40z"/>
  </g>
  <g fill="#123A5A" opacity=".85">
    <rect x="74" y="176" width="16" height="22" rx="2"/><rect x="96" y="176" width="16" height="22" rx="2"/>
    <rect x="146" y="204" width="14" height="20" rx="2"/><rect x="166" y="204" width="14" height="20" rx="2"/>
    <rect x="226" y="164" width="16" height="24" rx="2"/><rect x="248" y="164" width="16" height="24" rx="2"/>
    <rect x="292" y="212" width="14" height="20" rx="2"/>
  </g>
  <g fill="#E08A3C">
    <rect x="66" y="214" width="52" height="12" rx="3"/><rect x="212" y="204" width="58" height="12" rx="3"/>
  </g>
  <path d="M0 262h400v38H0z" fill="#0C2A42" opacity=".7"/>
  <g fill="#F5A055" opacity=".95">
    <circle cx="40" cy="228" r="7"/><circle cx="360" cy="222" r="7"/><circle cx="196" cy="244" r="5"/>
  </g>
  <g stroke="#FFE3C6" stroke-width="2" opacity=".35" fill="none">
    <path d="M0 208h400"/>
  </g>
  <g fill="#12639B">
    <path d="M0 300c0-30 12-44 26-44s22 14 26 44z"/><path d="M348 300c4-28 16-40 28-40s22 12 24 40z"/>
  </g>
</symbol>

<symbol id="s-transfer" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="url(#g-sky)"/>
  <circle cx="330" cy="58" r="34" fill="url(#g-sun)"/>
  <path d="M0 150c40-8 80 6 132 0s96-12 148-4 84 6 120-2v56H0z" fill="#12639B" opacity=".45"/>
  <path d="M0 300V182h400v118z" fill="#123A5A" opacity=".9"/>
  <path d="M0 182h400v14H0z" fill="#0C2A42"/>
  <g stroke="#EAF7FD" stroke-width="6" stroke-dasharray="34 26" opacity=".7" fill="none">
    <path d="M0 250h400"/>
  </g>
  <g>
    <path d="M104 224h150l24 6 14 12v22h-198v-24l10-16z" fill="#EAF7FD"/>
    <path d="M118 228h46v22h-52z" fill="#62B6E7"/>
    <path d="M172 228h50v22h-50z" fill="#62B6E7"/>
    <path d="M230 228h24l18 22h-42z" fill="#62B6E7"/>
    <rect x="96" y="256" width="200" height="10" rx="4" fill="#1677B8"/>
    <circle cx="136" cy="272" r="14" fill="#0C2A42"/><circle cx="136" cy="272" r="6" fill="#F5A055"/>
    <circle cx="256" cy="272" r="14" fill="#0C2A42"/><circle cx="256" cy="272" r="6" fill="#F5A055"/>
    <rect x="286" y="234" width="12" height="10" rx="3" fill="#123A5A"/>
  </g>
  <g fill="#12639B">
    <path d="M0 214c0-26 10-38 22-38s20 12 22 38zM356 214c2-24 12-34 22-34s20 10 22 34z"/>
  </g>
  <g fill="#EAF7FD" opacity=".4">
    <ellipse cx="90" cy="52" rx="44" ry="13"/><ellipse cx="210" cy="34" rx="32" ry="10"/>
  </g>
</symbol>

<!-- Category tile backgrounds (16:9-ish, cropped) -->
<symbol id="c-sea" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="url(#g-sea)"/>
  <path d="M0 0h320v70c-40 16-70-6-110 4S130 92 90 80 40 68 0 78z" fill="#62B6E7" opacity=".4"/>
  <path d="M0 200c0-42 16-60 34-60s28 20 34 60zM200 200c6-52 26-76 52-76s44 26 52 76z" fill="#0C2A42" opacity=".6"/>
  <path d="M0 200V178h320v22z" fill="#0C2A42" opacity=".5"/>
</symbol>
<symbol id="c-dive" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="#1677B8"/>
  <path d="M0 0h320v40c-46 14-88-8-140 2S110 58 60 46 34 34 0 42z" fill="#DBEDFA" opacity=".4"/>
  <g fill="#0C2A42" opacity=".55"><path d="M0 200c0-40 18-58 40-58s30 22 36 58zM110 200c6-44 26-64 50-64s40 22 48 64zM240 200c6-32 20-46 36-46s28 16 34 46z"/></g>
  <g fill="#EAF7FD" opacity=".35"><circle cx="230" cy="70" r="16"/><circle cx="262" cy="94" r="9"/></g>
</symbol>
<symbol id="c-adventure" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="url(#g-jungle)"/>
  <circle cx="264" cy="42" r="30" fill="#F5A055" opacity=".72"/>
  <path d="M0 200c0-72 26-108 58-108s52 34 70 108z" fill="#0C2A42" opacity=".55"/>
  <path d="M120 200c10-56 34-84 62-84s52 26 68 84z" fill="#0C2A42" opacity=".7"/>
  <path d="M12 68 308 46" stroke="#DBEDFA" stroke-width="4" opacity=".7" fill="none"/>
</symbol>
<symbol id="c-show" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="url(#g-stage)"/>
  <g fill="#F5A055" opacity=".18"><path d="M40 200 104 20h20L82 200zM280 200 216 20h-20l42 180z"/></g>
  <ellipse cx="160" cy="176" rx="120" ry="24" fill="#F5A055" opacity=".2"/>
  <g fill="#E08A3C"><circle cx="160" cy="96" r="16"/><path d="M146 118h28l10 58h-48z"/></g>
  <g fill="#EAF7FD" opacity=".7"><circle cx="60" cy="34" r="2.5"/><circle cx="130" cy="22" r="2"/><circle cx="240" cy="30" r="2.5"/><circle cx="290" cy="52" r="2"/></g>
</symbol>
<symbol id="c-local" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="url(#g-sky-dusk)"/>
  <g fill="#EAF7FD" opacity=".85"><path d="M40 200V96h50v104z"/><path d="M98 200V118h44v82z"/><path d="M170 200V84h48v116z"/><path d="M226 200V126h44v74z"/></g>
  <g fill="#1677B8"><path d="M32 98h66l-12-18H44z"/><path d="M92 120h56l-10-16h-36z"/><path d="M162 86h64l-12-18h-40z"/><path d="M220 128h56l-10-16h-36z"/></g>
  <g fill="#E08A3C"><rect x="46" y="146" width="38" height="9" rx="3"/><rect x="176" y="132" width="40" height="9" rx="3"/></g>
  <path d="M0 176h320v24H0z" fill="#0C2A42" opacity=".7"/>
  <g fill="#F5A055"><circle cx="24" cy="152" r="5"/><circle cx="296" cy="148" r="5"/></g>
</symbol>
<symbol id="c-transfer" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="200" fill="url(#g-sky)"/>
  <circle cx="266" cy="40" r="26" fill="#F5A055" opacity=".5"/>
  <path d="M0 200V74h320v126z" fill="#123A5A" opacity=".88"/>
  <path d="M0 74h320v10H0z" fill="#0C2A42"/>
  <g stroke="#EAF7FD" stroke-width="5" stroke-dasharray="26 20" opacity=".6" fill="none"><path d="M0 128h320"/></g>
  <g transform="translate(0,-64)"><path d="M92 146h124l20 6 12 10v18H80v-20l12-14z" fill="#EAF7FD"/><path d="M104 150h44v18h-50z" fill="#62B6E7"/><path d="M156 150h44v18h-44z" fill="#62B6E7"/><circle cx="118" cy="184" r="11" fill="#0C2A42"/><circle cx="216" cy="184" r="11" fill="#0C2A42"/></g>
</symbol>

</defs>
</svg>`;
  var s = document.currentScript;
  if (s) s.insertAdjacentHTML('afterend', SPRITE);
  else document.body.insertAdjacentHTML('afterbegin', SPRITE);
})();
