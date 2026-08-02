(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);


  /* ════════════════════════════════════════════════════════════
      STEP 2 — INITIAL STATES (FOUC রোধ করার জন্য)
  ════════════════════════════════════════════════════════════ */
  function setInitialStates() {
    gsap.set('.heading-tag-box', { autoAlpha: 0, y: 20 });
    gsap.set('.tab-toggle',      { autoAlpha: 0, y: 30 });
    gsap.set('.gallery-grid',    { autoAlpha: 0, y: 40 });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 3 — ENTRANCE ANIMATION (Timeline)
  ════════════════════════════════════════════════════════════ */
  function buildEntrance() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.media',
        start: 'top 80%',
      }
    });

    tl.to('.heading-tag-box', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.js-h2-inner', 
        { yPercent: 115, skewY: 3.5 }, 
        { yPercent: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, 
        "-=0.5"
      )
      .to('.tab-toggle', { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.8")
      .to('.gallery-grid', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, "-=0.5");
  }

  /* ════════════════════════════════════════════════════════════
      STEP 4 — MEDIA SHAPE ANIMATION (আপনার রিকোয়ারমেন্ট অনুযায়ী)
      - scroll-এর সাথে top থেকে bottom-এ নামবে
      - scale হবে 1 থেকে 1.1
  ════════════════════════════════════════════════════════════ */
  function initShapeAnimation() {
    gsap.to('.media__shape', {
      top: '100%',         // top থেকে নিচে নামবে
      scale: 1.1,          // 1 থেকে 1.1 পর্যন্ত স্কেল হবে
      ease: 'none',
      scrollTrigger: {
        trigger: '.media',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  /* ════════════════════════════════════════════════════════════
      BOOT
  ════════════════════════════════════════════════════════════ */
  function boot() {
    setInitialStates();
    buildEntrance();
    initShapeAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();