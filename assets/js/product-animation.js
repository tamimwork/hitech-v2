(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP / ScrollTrigger not found — load both scripts before product-horizontal-scroll.js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
 
  function initProductHorizontalScroll() {
    var section = document.querySelector('.product');
    var track   = document.querySelector('.product__content'); // the visible "window"
    var wrapper = document.querySelector('.product__items');   // the row that slides
 
    if (!section || !track || !wrapper) return;
 
    // safe to call again on resize/refresh without stacking duplicate triggers
    ScrollTrigger.getAll().forEach(function (st) {
      if (st.vars && st.vars.id === 'product-h-scroll') st.kill();
    });

    // MatchMedia use kore screen size onujayi animation trigger kora holo
    var mm = gsap.matchMedia();

    // Shudhumatro 992px theke boro screen e horizontal scroll hobe
mm.add("(min-width: 992px)", function() {
  gsap.to(wrapper, {
    x: function () {
      return -(wrapper.scrollWidth - track.clientWidth);
    },
    ease: 'none',
    scrollTrigger: {
      id: 'product-h-scroll',
      trigger: track,        // ⬅️ section এর বদলে card row (.product__content) এ trigger
      start: 'center center',      // card row VP এর top এ পৌঁছালে তবেই pin শুরু হবে
      end: function () {
        return '+=' + (wrapper.scrollWidth - track.clientWidth);
      },
      scrub: true,
      pin: track,             // ⬅️ পুরো section না, শুধু card row (.product__content) pin হবে
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 1
    }
  });
});
  }
 
  window.addEventListener('load', initProductHorizontalScroll);
  // MatchMedia automatically handle kore resize, tobuo purano code er backup rakhlam
  window.addEventListener('resize', function () {
    ScrollTrigger.refresh();
  });
})();

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[product-anim] GSAP + ScrollTrigger must be loaded first.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════════
     1. SHAPE
        • Infinite scale breath  (sine in-out, linear feel, yoyo)
        • Scroll-driven Y parallax (scrub, no pin conflict)
  ══════════════════════════════════════════════════════════════ */
  function animShape() {
    var shape = document.querySelector('.product__shape');
    if (!shape) return;

    /* --- Infinite scale pulse ---
       starts at scale 0.88, breathes out to 1.35, back, forever.
       The CSS `rotate: 183deg` is left untouched — GSAP only
       touches `scale` and `y` here, which compose safely.         */
    gsap.fromTo(shape,
      { scale: 0.88 },
      {
        scale:           1.35,
        duration:        4,
        repeat:          -1,
        yoyo:            true,
        ease:            'sine.inOut',   // smooth rhythmic pulse
        transformOrigin: 'center center'
      }
    );

    /* --- Scroll Y drift ---
       shape drifts upward as the user scrolls through the section. */
    gsap.to(shape, {
      y:    -200,
      ease: 'none',
      scrollTrigger: {
        id:      'product-shape-parallax',
        trigger: '.product',
        start:   'top bottom',
        end:     'bottom top',
        scrub:   1.8           // lag = silky feel
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     2. TITLE BOX
        • Tag dot  → scale pop
        • Tag text → slide from left
        • h2       → clip-path swipe-up + y drift (no SplitText dep)
  ══════════════════════════════════════════════════════════════ */
  function animTitle() {
    var dot     = document.querySelector('.product .heading-tag-box__dot');
    var tagText = document.querySelector('.product .heading-tag-box__text');
    var h2      = document.querySelector('.product__heading h2');
    if (!h2) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.product__title-box',
        start:   'top 78%',
        once:    true
      }
    });

    /* Dot — back-out pop */
    if (dot) {
      tl.from(dot, {
        scale:    0,
        opacity:  0,
        duration: 0.4,
        ease:     'back.out(3)'
      }, 0);
    }

    /* Tag text — slide right */
    if (tagText) {
      tl.from(tagText, {
        x:        -32,
        opacity:  0,
        duration: 0.65,
        ease:     'power3.out'
      }, 0.1);
    }

    /* h2 — clip-path curtain reveal from bottom edge, text floats up.
       inset(0% 0% 100% 0%) = bottom clip covers 100% → nothing visible.
       inset(0% 0% 0%   0%) = no clip → fully visible.
       Combined y drift creates the "rising out of ground" feel.          */
    tl.fromTo(h2,
      { clipPath: 'inset(0% 0% 100% 0%)', y: 55 },
      { clipPath: 'inset(0% 0% 0%   0%)', y: 0,
        duration: 1.15,
        ease:     'power4.out'
      },
      0.18
    );
  }

  /* ══════════════════════════════════════════════════════════════
     3. CARD ENTRANCE
        Each card's left-side elements stagger in.
        The image panel slides in from the right simultaneously.

        • Card 0  → triggered by section entering viewport
          (it's already on-screen when the section pins)
        • Card 1+ → triggered via containerAnimation, so the
          h-scroll scrub drives the reveal timing naturally.
  ══════════════════════════════════════════════════════════════ */
  function animCards() {
    var hST   = ScrollTrigger.getById('product-h-scroll');
    var cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    cards.forEach(function (card, idx) {
      var num   = card.querySelector('h3');
      var h4    = card.querySelector('h4');
      var desc  = card.querySelector('.product-card__content p');
      var infos = card.querySelectorAll('.product-card__info');
      var btn   = card.querySelector('.product-card__btns');
      var right = card.querySelector('.product-card__right');
      var badge = card.querySelector('.product-card__badge');

      /* ScrollTrigger config ─────────────────────────────────── */
      var stConfig;
      if (idx === 0) {
        // First card — already visible when section pins
        stConfig = {
          trigger: '.product',
          start:   'top 58%',
          once:    true
        };
      } else {
        // Subsequent cards — tied to horizontal scroll progress
        stConfig = {
          trigger:            card,
          start:              'left 88%',
          once:               true,
          containerAnimation: hST || undefined
        };
      }

      var tl = gsap.timeline({ scrollTrigger: stConfig });

      /* Image panel — slides in from right */
      if (right) {
        tl.from(right, {
          x:        110,
          opacity:  0,
          duration: 1,
          ease:     'expo.out'
        }, 0);
      }

      /* Number watermark */
      if (num) {
        tl.from(num, {
          y:        65,
          opacity:  0,
          duration: 0.8,
          ease:     'power3.out'
        }, 0.04);
      }

      /* Product title */
      if (h4) {
        tl.from(h4, {
          y:        45,
          opacity:  0,
          duration: 0.72,
          ease:     'power3.out'
        }, 0.18);
      }

      /* Description */
      if (desc) {
        tl.from(desc, {
          y:        28,
          opacity:  0,
          duration: 0.6,
          ease:     'power2.out'
        }, 0.3);
      }

      /* Spec info boxes — stagger */
      if (infos.length) {
        tl.from(Array.from(infos), {
          y:        22,
          opacity:  0,
          stagger:  0.1,
          duration: 0.55,
          ease:     'power2.out'
        }, 0.42);
      }

      /* CTA button */
      if (btn) {
        tl.from(btn, {
          y:        20,
          opacity:  0,
          duration: 0.5,
          ease:     'power2.out'
        }, 0.68);
      }

      /* Size badge — back-out pop */
      if (badge) {
        tl.from(badge, {
          scale:    0,
          opacity:  0,
          duration: 0.38,
          ease:     'back.out(2.5)'
        }, 0.27);
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     4. HOVER  —  water / glass shimmer on card images
        The shimmer div (injected once per card) uses two CSS custom
        properties (--gx / --gy) set directly on mousemove.
        The layered radial gradients in the CSS give the refraction
        depth. GSAP only drives opacity; the cursor-tracking is
        pure setProperty for zero overhead.
  ══════════════════════════════════════════════════════════════ */
  function animHover() {
    document.querySelectorAll('.product-card').forEach(function (card) {
      var right = card.querySelector('.product-card__right');
      var img   = card.querySelector('.product__card-img img');
      if (!right || !img) return;

      /* Create shimmer layer (guard: don't duplicate on re-init) */
      if (right.querySelector('.pc-shimmer')) return;
      var shimmer = document.createElement('div');
      shimmer.className = 'pc-shimmer';
      right.appendChild(shimmer);

      var active = false;

      /* Enter ─────────────────────────────────────────────────── */
      card.addEventListener('mouseenter', function () {
        active = true;
        gsap.to(img, {
          scale:    1.08,
          duration: 0.72,
          ease:     'power2.out'
        });
        gsap.to(shimmer, {
          opacity:  1,
          duration: 0.42,
          ease:     'power2.out'
        });
      });

      /* Move — ripple follows cursor with no interpolation lag ── */
      right.addEventListener('mousemove', function (e) {
        if (!active) return;
        var r = right.getBoundingClientRect();
        shimmer.style.setProperty(
          '--gx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%'
        );
        shimmer.style.setProperty(
          '--gy', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%'
        );
      });

      /* Leave ──────────────────────────────────────────────────── */
      card.addEventListener('mouseleave', function () {
        active = false;
        gsap.to(img, {
          scale:    1,
          duration: 0.82,
          ease:     'power2.inOut'
        });
        gsap.to(shimmer, {
          opacity:  0,
          duration: 0.5,
          ease:     'power2.out'
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     BOOT
     Double rAF so product-horizontal-scroll.js has fully
     registered its ScrollTrigger (id="product-h-scroll")
     before animCards() tries to grab it.
  ══════════════════════════════════════════════════════════════ */
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        animShape();
        animTitle();
        animCards();
        animHover();
        
        // 💡 আপডেট: DOM-এর সিরিয়াল অনুযায়ী ট্রিগারগুলো সাজিয়ে নিবে
        ScrollTrigger.sort(); 
        
        // এরপর সবগুলো মেজারমেন্ট নতুন করে ক্যালকুলেট করবে
        ScrollTrigger.refresh();  
      });
    });
  });

})();




























$(function () {
 
    var $overlay  = $('#pmOverlay');
    var $hero     = $('#pmHero');
    var $tag      = $('#pmTag');
    var $title    = $('#pmTitle');
    var $desc     = $('#pmDesc');
    var $infoGrid = $('#pmInfoGrid');
 
    // Open modal — reads everything from data-* attributes on the clicked .product__item
    $(document).on('click', '.product__item', function () {
        var $item = $(this);
 
        var image = $item.data('modal-image');
        var tag   = $item.data('tag');
        var title = $item.data('title');
        var desc  = $item.data('description');
        var info  = $item.data('info'); // jQuery auto-parses valid JSON in data-info
 
        $hero.css('background-image', 'url(' + image + ')');
        $tag.text(tag || '');
        $title.text(title || '');
        $desc.text(desc || '');
 
        $infoGrid.empty();
        if (Array.isArray(info)) {
            info.forEach(function (row) {
                var $card = $(
                    '<div class="pm-info-card">' +
                        '<div class="pm-info-label"></div>' +
                        '<div class="pm-info-value"></div>' +
                    '</div>'
                );
                $card.find('.pm-info-label').text(row.label);
                $card.find('.pm-info-value').text(row.value);
                $infoGrid.append($card);
            });
        }
 
        $overlay.addClass('is-open');
        $('body').addClass('pm-locked');
    });
 
    // Close on: close button, overlay click, or Escape key
    $('#pmClose').on('click', closeModal);
    $overlay.on('click', function (e) {
        if (e.target === this) closeModal();
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $overlay.hasClass('is-open')) closeModal();
    });
 
    function closeModal() {
        $overlay.removeClass('is-open');
        $('body').removeClass('pm-locked');
    }
 
});