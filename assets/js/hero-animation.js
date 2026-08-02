(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ════════════════════════════════════════════════════════════
      STEP 1 — HEADING PREP (HT common function ব্যবহার করা হচ্ছে)
      প্রতিটি h2-এর ভেতরে একটি wrapper div তৈরি করা হয়
      যাতে overflow:hidden দিয়ে নিচ থেকে clip-reveal হয়।
   ════════════════════════════════════════════════════════════ */
  function prepareHeadings() {
    HT.prepareHeadingLines('.hero__heading h2');
  }

  /* ════════════════════════════════════════════════════════════
      STEP 2 — INITIAL STATES
      Flash of Un-Animated Content (FOUC) রোধ করার জন্য
      সব animatable element আগেই hide করা হচ্ছে।
   ════════════════════════════════════════════════════════════ */
  function setInitialStates() {
    // hero__tested — reveal (উপর থেকে নিচে ফেড করে আসবে)
    gsap.set('.hero__tested', { autoAlpha: 0, y: -24 });

    // hero__autoplay-video-wrap — clip reveal (নিচ থেকে height 0 → full)
    gsap.set('.hero__autplay-video-wrap', {
      clipPath: 'inset(0% 0% 100% 0% round 20px)',
    });

    // hero__count-item — নিচ থেকে stagger করে উঠে আসবে
    gsap.set('.hero__count-item', { autoAlpha: 0, y: 44 });

    // hero__right-video-content p — text effect
    gsap.set('.hero__right-video-content p', { autoAlpha: 0, y: 22 });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 3 — NUMBER COUNTER (HT.counterUp ব্যবহার করা হচ্ছে)
      expo.out easing দিয়ে slot-machine / snap effect তৈরি।
      প্রতিটি h4 থেকে number parse করে 0 থেকে count-up করে।
   ════════════════════════════════════════════════════════════ */
  function runCounters() {
    HT.counterUp('.hero__count-item h4', { duration: 2.4, stagger: 0.15, ease: 'expo.out' });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 4 — ENTRANCE TIMELINE
      শুধু ৫টা প্রয়োজনীয় animation একসাথে সাজানো হয়েছে।
   ════════════════════════════════════════════════════════════ */
  function buildEntrance() {
    const tl = gsap.timeline({
      defaults : { ease: 'power4.out' },
      delay    : 0.1,
    });

    // ① hero__tested — reveal
    tl.to('.hero__tested',
      { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      0
    );

    // ② H2 headings — Webflow / Framer-style clip-reveal
    tl.fromTo('.js-h2-inner',
      { yPercent: 115, skewY: 3.5 },
      {
        yPercent : 0,
        skewY    : 0,
        duration : 1.3,
        stagger  : { amount: 0.22 },
      },
      0.1
    );

    // ③ hero__autoplay-video-wrap — reveal (0 → full height)
    tl.to('.hero__autplay-video-wrap',
      {
        clipPath : 'inset(0% 0% 0% 0% round 20px)',
        duration : 1.55,
        ease     : 'expo.inOut',
      },
      0.28
    );

    // ④ Count items — stagger করে উপরে উঠে আসে
    tl.to('.hero__count-item',
      {
        autoAlpha : 1,
        y         : 0,
        duration  : 0.82,
        stagger   : 0.1,
        onComplete: runCounters,
      },
      1.12
    );

    // ⑤ Right-side description paragraph — text effect
    tl.to('.hero__right-video-content p',
      { autoAlpha: 1, y: 0, duration: 0.78 },
      1.24
    );

    return tl;
  }

  /* ════════════════════════════════════════════════════════════
      BOOT — সব function একসাথে চালানো হচ্ছে
   ════════════════════════════════════════════════════════════ */
  function boot() {
    prepareHeadings();
    setInitialStates();
    buildEntrance();
  }

  // DOM ready হলে boot করো
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();