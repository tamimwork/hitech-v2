// =====================================================
//  ABOUT SECTION — GSAP ANIMATIONS
//  Requires: gsap.min.js + ScrollTrigger.min.js
// =====================================================

gsap.registerPlugin(ScrollTrigger);

$(document).ready(function () {

    /* =====================================================
       1. SHAPE ANIMATIONS
          · Infinite float  → x + rotation  (property আলাদা)
          · Scroll fade-in  → opacity        (property আলাদা)
          · Scroll parallax → y              (property আলাদা)
          তিনটা আলাদা property ব্যবহার করা হয়েছে,
          কোনো conflict নেই।
    ===================================================== */

    // প্রথমে shapes লুকিয়ে রাখো, তারপর scroll এ fade-in (HT.fadeUp ব্যবহার করা হচ্ছে, y না দিয়ে শুধু opacity)
    HT.fadeUp(".about__shape1", { y: 0, duration: 0.9, trigger: ".about", start: "top 12%" });
    HT.fadeUp(".about__shape2", { y: 0, duration: 0.9, delay: 0.25, trigger: ".about", start: "top 80%" });

    // ── Scroll Parallax (y) ────────────────────────────
    gsap.to(".about__shape1", {
        y: 220,
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });

    gsap.to(".about__shape2", {
        y: 20,
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });


    /* =====================================================
       2. HEADING H2 — WORD-BY-WORD REVEAL
    ===================================================== */

    const headingEl = document.querySelector(".about__heading h2");

    if (headingEl) {

        // প্রতিটি word কে আলাদা span এ মুড়িয়ে দাও
        headingEl.innerHTML = headingEl.innerText
            .split(" ")
            .map(w => `<span class="abt-word-mask"><span class="abt-word">${w}</span></span>`)
            .join(" ");

        gsap.set(".abt-word-mask", {
            overflow: "hidden",
            display: "inline-block",
            verticalAlign: "bottom",
            lineHeight: "inherit"
        });

        gsap.set(".abt-word", { display: "inline-block" });

        // Heading Tag Box — left থেকে slide in
        gsap.fromTo(".about__title-box .heading-tag-box",
            { opacity: 0, x: -28 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".about__title-box",
                    start: "top 82%",
                    once: true
                }
            }
        );

        // Words — নিচ থেকে উপরে স্লাইড (stagger)
        gsap.fromTo(".about__heading h2 .abt-word",
            { y: "110%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                duration: 0.9,
                stagger: 0.045,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".about__title-box",
                    start: "top 80%",
                    once: true
                }
            }
        );
    }


    /* =====================================================
       3. ABOUT LEFT — CLIP-PATH WIDTH REVEAL
          width: 0 → 100% effect (inset right side থেকে খুলবে)
    ===================================================== */

    HT.clipReveal(".about__left", {
        fromInset: "inset(0 100% 0 0)",
        toInset: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "power4.inOut",
        trigger: ".about__content",
        start: "top 78%"
    });
    gsap.set(".about__left", {
        overflow: "hidden"
    });

    gsap.fromTo(".about__left img",
        {
            scale: 1.28,
            y: "6%"     // scroll শুরুতে: নিচে shifted (image উপর দেখাবে)
        },
        {
            scale: 1.28,
            y: "-6%",   // scroll শেষে: উপরে shifted (image নিচ দেখাবে)
            ease: "none",
            scrollTrigger: {
                trigger: ".about__left",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5   // smooth inertia lag
            }
        }
    );

    /* =====================================================
       4. ABOUT RIGHT — CLIP-PATH REVEAL + CONTENT STAGGER
          Left side থেকে খুলবে (left mirror)
    ===================================================== */

    HT.clipReveal(".about__right", {
        fromInset: "inset(0 0 0 100%)",
        toInset: "inset(0 0 0 0%)",
        duration: 1.4,
        delay: 0.22,
        ease: "power4.inOut",
        trigger: ".about__content",
        start: "top 78%"
    });

    // Right panel এর ভেতরের content গুলো stagger এ আসবে
    gsap.fromTo(
        [".about__tab-btns", ".about__tab-items", ".about__quets", ".about__btn-wrap"],
        { opacity: 0, y: 28 },
        {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.13,
            ease: "power2.out",
            delay: 1.1, // clip animation শেষ হওয়ার পর শুরু হবে
            scrollTrigger: {
                trigger: ".about__content",
                start: "top 78%",
                once: true
            }
        }
    );


    /* =====================================================
       5. ABOUT LEFT YEAR H3
          · letter-spacing থেকে compress হয়ে reveal
          · Number counter roll-up (1900 → 1980)
          · Scroll parallax drift
    ===================================================== */

    // Initial hidden state — wide letter-spacing দিয়ে শুরু
    gsap.set(".about__left-year h3", {
        opacity: 0,
        letterSpacing: "60px"
    });

    // Scroll এ reveal: opacity + letterSpacing compress
    gsap.to(".about__left-year h3", {
        opacity: 0.5,
        letterSpacing: "10px",
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about__wrapper",
            start: "top 72%",
            once: true
        }
    });

    // Number Counter: 1900 → 1980 roll-up
    ScrollTrigger.create({
        trigger: ".about__wrapper",
        start: "top 72%",
        once: true,
        onEnter() {
            const counter = { val: 1900 };
            const yearEl = document.querySelector(".about__left-year h3");
            if (yearEl) {
                gsap.to(counter, {
                    val: 1980,
                    duration: 2.5,
                    delay: 0.4,
                    ease: "power2.out",
                    onUpdate() {
                        yearEl.textContent = Math.round(counter.val);
                    }
                });
            }
        }
    });

    // Continuous parallax — 270deg rotation এর কারণে
    // y movement টা screen এ horizontally drift করবে (cool effect!)
    gsap.to(".about__left-year", {
        y: -70,
        scrollTrigger: {
            trigger: ".about__wrapper",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });

});
























$(function () {
 
  // Edit this array to change what shows on the right side of the modal.
  var timeline = [
    { year: "1980", text: "The Rahman brothers begin iron and steel business to a modest extent, building expertise in the trade." },
    { year: "Expansion", text: "Successful business growth leads to founding Rahman Knit Garments Ltd., now an internationally reputed knit composite factory." },
    { year: "Founding Hi-Tech Steel", text: "With the ambition to be a bright figure in steel, the brothers re-established the business in an entirely new and broadened way, creating Hi-Tech Steel and Re-rolling Mills Ltd." },
    { year: "World-Class Facility", text: "The mill is built on a 3 acre premises in Bhulta, Rupganj, Narayanganj, equipped with all vertical equipment as a high-end steel re-rolling operation capable of 100 MT daily production." },
    { year: "Today", text: "Hi-Tech Steel is ready to meet the challenges to produce strong, durable and premium quality steel, building a nation with enriched infrastructure and a progressive economy." }
  ];
 
  function buildTimeline() {
    var $body = $('#aboutModalBody').empty();
    $.each(timeline, function (i, item) {
      var $item = $('<div class="about-modal__item"></div>');
      $item.append($('<h4 class="about-modal__item-year"></h4>').text(item.year));
      $item.append($('<p class="about-modal__item-text"></p>').text(item.text));
      $body.append($item);
    });
  }
 
  function openModal() {
    // pull the image already sitting in the About section, so the modal mirrors the markup
    var $sourceImg = $('.about__left img').first();
    $('#aboutModalImage').attr({
      src: $sourceImg.attr('src'),
      alt: $sourceImg.attr('alt') || 'Founder'
    });
 
    buildTimeline();
 
    $('#aboutModalOverlay').addClass('is-open').attr('aria-hidden', 'false');
    $('body').addClass('modal-open-lock');
  }
 
  function closeModal() {
    $('#aboutModalOverlay').removeClass('is-open').attr('aria-hidden', 'true');
    $('body').removeClass('modal-open-lock');
  }
 
  $(document).on('click', '#aboutViewMoreBtn', function (e) {
    e.preventDefault();
    openModal();
  });
 
  $(document).on('click', '.about-modal__close', closeModal);
  $(document).on('click', '.about-modal-overlay', function (e) { if (e.target === this) closeModal(); });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#aboutModalOverlay').hasClass('is-open')) closeModal();
  });
 
});