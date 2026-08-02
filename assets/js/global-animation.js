// ফন্ট পুরোপুরি রেডি হওয়ার পর স্ক্রিপ্ট রান করবে
document.fonts.ready.then(function () {
    
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // at-char-animation সেকশন
    if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined' && $('.at-char-animation').length > 0) {
        let char_come = gsap.utils.toArray('.at-char-animation');
        
char_come.forEach((splitTextLine) => {
    if (!splitTextLine) return;

    const itemSplitted = new SplitText(splitTextLine, { type: 'chars, words' });
    if (!itemSplitted || !itemSplitted.chars || itemSplitted.chars.length === 0) return;

    gsap.set(splitTextLine, { perspective: 300 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: false,
            markers: false,
            toggleActions: 'play none none none',
        },
        onComplete: () => itemSplitted.revert(), // animation শেষে original text এ ফিরিয়ে দেয়
    });

    tl.from(itemSplitted.chars, {
        duration: 1,
        delay: 0.5,
        x: 100,
        autoAlpha: 0,
        stagger: 0.05,
    });
});
    }
});













gsap.registerPlugin(ScrollTrigger);

// Text-ti scroll er sathe left to right ba right to left move korbe
gsap.to(".video__text", {
    xPercent: 30, // Scroll korle text ti dandan-dike 30% bhese jabe
    ease: "none", // Parallax er jonyo linear/none mapping upojogi
    scrollTrigger: {
        trigger: ".video",       // Video section screen-e ashle start hobe
        start: "top bottom",     // Video section viewport-er bottom-e thaktei shuru
        end: "bottom top",       // Video section pure screen par hoye upore chole gele shesh
        scrub: 1.5,              // Joto scroll korben, toto e text ti move hobe (1.5 delay smooth feel day)
    }
});

// Logo ti ke jodi ektu alada dynamic feel dite chan (Optional)
gsap.to(".video__logo", {
    y: -30, // Logo-ti text er theke ulto ba slow move korbe (Depth/3D layering er jonyo)
    ease: "none",
    scrollTrigger: {
        trigger: ".video",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    }
});










  document.addEventListener('DOMContentLoaded', function () {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.contact__tag', { opacity: 1, y: 0, duration: 0.5 }, 0)
      .from('.contact__tag', { y: 16 }, 0)
      .to('.contact__heading-line span', {
          y: '0%',
          duration: 0.8,
          stagger: 0.12
        }, 0.15)
      .to('.contact__info-item', {
          opacity: 1,
          duration: 0.55,
          stagger: 0.12
        }, 0.55)
      .from('.contact__info-item', {
          x: -18,
          duration: 0.55,
          stagger: 0.12
        }, 0.55)
      .to('.contact__form', { opacity: 1, duration: 0.7 }, 0.45)
      .from('.contact__form', { x: 30, duration: 0.7 }, 0.45)
      .from('.contact__form-group, .contact__form-row > .contact__form-group', {
          opacity: 0,
          y: 14,
          duration: 0.5,
          stagger: 0.07
        }, 0.7)
      .from('.contact__form-submit', { opacity: 0, y: 10, duration: 0.5 }, 1.2)
      .to('.contact__map', { opacity: 1, duration: 0.8 }, 1.35)
      .from('.contact__map', { y: 40, duration: 0.8 }, 1.35);

    var btn = document.querySelector('.contact__form-submit');
    btn.addEventListener('mouseenter', function () {
      gsap.to(btn, { scale: 1.03, duration: 0.25, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
    });

    var inputs = document.querySelectorAll('.contact__form-input, .contact__form-textarea');
    inputs.forEach(function (el) {
      el.addEventListener('focus', function () {
        gsap.to(el, { y: -2, duration: 0.2, ease: 'power2.out' });
      });
      el.addEventListener('blur', function () {
        gsap.to(el, { y: 0, duration: 0.2, ease: 'power2.out' });
      });
    });
  });













// gsap.registerPlugin(ScrollTrigger);

// const cards = gsap.utils.toArray('.manufacturing__item');

// cards.forEach((card, i) => {
//     // শেষ card scale হবে না
//     if (i === cards.length - 1) return;

//     gsap.to(card, {
//         scale: 0.92,
//         transformOrigin: "center top",
//         ease: "none",
//         scrollTrigger: {
//             trigger: card,
//             start: "top top+=80",
//             end: "bottom top+=80",
//             scrub: true,
//         }
//     });
// });



