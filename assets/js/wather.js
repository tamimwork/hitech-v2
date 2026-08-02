/* ==========================================================================
   HI-TECH STEEL — jQuery + GSAP interactions
   Sections: Air-to-Exports/Achievements, Our Clients accordion, Sticky social bar
   ========================================================================== */

$(function () {

  gsap.registerPlugin(ScrollTrigger);

  /* -----------------------------------------------------------------------
     1. SUBTLE PARALLAX ON THE LEFT-SIDE IMAGE
     ----------------------------------------------------------------------- */
  // gsap.to("[data-parallax] img", {
  //   yPercent: 14,
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: "#hts-impact",
  //     start: "top bottom",
  //     end: "bottom top",
  //     scrub: true,
  //   },
  // });

  /* -----------------------------------------------------------------------
     2. TITLE SPLIT + REVEAL (per word) for headings
     ----------------------------------------------------------------------- */
  $("[data-split-title]").each(function () {
    var $el = $(this);
    var html = $el.html();
    var wrapped = html
      .split(/(<span[\s\S]*?<\/span>|\s+)/)
      .filter(function (chunk) { return chunk && chunk.trim() !== ""; })
      .map(function (chunk) {
        return '<span class="word-wrap"><span class="word-inner">' + chunk + '</span></span>';
      })
      .join(" ");
    $el.html(wrapped);
    $el.find(".word-wrap").css({ display: "inline-block", overflow: "hidden" });
    $el.find(".word-inner").css({ display: "inline-block" });
  });

  gsap.utils.toArray("[data-split-title]").forEach(function (title) {
    gsap.from(title.querySelectorAll(".word-inner"), {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
      },
    });
  });

  /* -----------------------------------------------------------------------
     3. GENERAL FADE-UP REVEALS (paragraphs, eyebrows, notes)
     ----------------------------------------------------------------------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });
  });

  /* -----------------------------------------------------------------------
     4. ACHIEVEMENT / CERTIFICATION CARDS — staggered reveal + counters
     ----------------------------------------------------------------------- */
  gsap.timeline({
    scrollTrigger: {
      trigger: ".hts-impact__cards",
      start: "top 85%",
    },
  }).to("[data-card].hts-impact__card, .hts-impact__card[data-card]", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.15,
  });

  // animated number counters
  $(".hts-impact__card [data-counter]").each(function () {
    var $counter = $(this);
    var target = parseFloat($counter.data("to"));
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: $counter[0],
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: function () {
            $counter.text(Math.round(this.targets()[0].val));
          },
        });
      },
    });
  });

  /* -----------------------------------------------------------------------
     5. OUR CLIENTS — hover-expand accordion with autoplay
     ----------------------------------------------------------------------- */
  var $clientCards = $(".hts-clients__card");
  var clientIndex = 0;
  var autoplayTimer = null;
  var AUTOPLAY_DELAY = 2600;

  function activateClient(index) {
    $clientCards.removeClass("is-active");
    $clientCards.eq(index).addClass("is-active");
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(function () {
      clientIndex = (clientIndex + 1) % $clientCards.length;
      activateClient(clientIndex);
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  $clientCards.on("mouseenter focus", function () {
    stopAutoplay();
    clientIndex = $clientCards.index(this);
    activateClient(clientIndex);
  });

  $(".hts-clients__accordion").on("mouseleave", function () {
    startAutoplay();
  });

  startAutoplay();

  gsap.from(".hts-clients__accordion", {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".hts-clients__accordion",
      start: "top 85%",
    },
  });

  /* -----------------------------------------------------------------------
     6. STICKY SOCIAL BAR — WhatsApp stays put; "+" reveals the rest on hover
     ----------------------------------------------------------------------- */
  var $cluster = $("[data-cluster]");
  var $toggle = $("[data-toggle]");

  function isTouchDevice() {
    return window.matchMedia("(hover: none)").matches;
  }

  // desktop: hover to reveal
  $cluster.on("mouseenter", function () {
    if (!isTouchDevice()) {
      $cluster.addClass("is-active");
      $toggle.addClass("is-open");
    }
  });
  $cluster.on("mouseleave", function () {
    if (!isTouchDevice()) {
      $cluster.removeClass("is-active");
      $toggle.removeClass("is-open");
    }
  });

  // touch devices (and keyboard users): tap/click to toggle
  $toggle.on("click", function (e) {
    e.preventDefault();
    $cluster.toggleClass("is-active");
    $toggle.toggleClass("is-open");
  });

  // gentle entrance for the whole bar on load
  gsap.from("#hts-social", {
    x: 60,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: "power3.out",
  });

});




/* -----------------------------------------------------------------------
   5. OUR CLIENTS — Slick slider, autoplay, center-active bigger card
   ----------------------------------------------------------------------- */
$("[data-clients-slider]").slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2600,
  speed: 600,
  arrows: true,
  prevArrow: $(".hts-clients__arrow--prev"),
  nextArrow: $(".hts-clients__arrow--next"),
  dots: true,
  appendDots: $(".hts-clients__dots"),
  pauseOnHover: true,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 991,  settings: { slidesToShow: 2 } },
    { breakpoint: 640,  settings: { slidesToShow: 1, centerPadding: "20px" } },
    { breakpoint: 480,  settings: { slidesToShow: 1, centerPadding: "20px" } }
  ]
});

gsap.from(".hts-clients__slider", {
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".hts-clients__slider",
    start: "top 85%",
  },
});