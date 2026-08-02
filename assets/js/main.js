// -----------smooth scroll start------------


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

if ($('#smooth-wrapper').length && $('#smooth-content').length) {
    ScrollSmoother.create({
        smooth: 1.85,
        effects: true,
        smoothTouch: .1,
        ignoreMobileResize: false
    });
}

// -----------smooth scroll end------------

// Start Header Fixed & Scroll

$(document).ready(function () {

    function checkHeaderBg() {
        if ($(window).scrollTop() > 25) {
            $('.header__inner').addClass('active');
        } else {
            $('.header__inner').removeClass('active');
        }
    }

    // normal scroll এ background toggle
    $(window).on('scroll', function () {
        checkHeaderBg();
    });

    // menu click করলে smooth scroll + header active রাখা
    $('.header__menu a, .mobile-menu a').on('click', function (e) {
        const href = $(this).attr('href');

        // শুধু hash link (#section) হলেই smooth scroll
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = $(href);

            if (target.length) {
                const headerHeight = $('.header').outerHeight();

                $('html, body').animate({
                    scrollTop: target.offset().top - headerHeight + 1
                }, 700, function () {
                    // scroll শেষ হওয়ার পর header active থাকবে যদি scroll position 25 এর বেশি হয়
                    checkHeaderBg();
                });

                // scroll শুরু হওয়ার সাথে সাথেই active class যোগ করে দিন
                // যাতে animation চলাকালীন header transparent না দেখায়
                $('.header__inner').addClass('active');

                // mobile menu খোলা থাকলে বন্ধ করে দিন
                closeMobileMenu();
            }
        } else {
            closeMobileMenu();
        }
    });

    // ================= Mobile Menu =================
    function openMobileMenu() {
        $('.mobile-menu-overlay').addClass('active');
        $('.mobile-menu').addClass('active');
        $('.header__hamburger-btn').addClass('active');
        $('body').addClass('mobile-menu-open');
    }

    function closeMobileMenu() {
        $('.mobile-menu-overlay').removeClass('active');
        $('.mobile-menu').removeClass('active');
        $('.header__hamburger-btn').removeClass('active');
        $('body').removeClass('mobile-menu-open');
    }

    $('.header__hamburger-btn').on('click', function () {
        if ($('.mobile-menu').hasClass('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    $('.mobile-menu-close, .mobile-menu-overlay').on('click', function () {
        closeMobileMenu();
    });

    // initial check (page reload হলে যদি scroll position থাকে)
    checkHeaderBg();
});

// End Header Fixed & Scroll


// Start About Tab 

$(document).ready(function() {
    $('.about__tab-btn').on('click', function() {
        if ($(this).hasClass('active')) return;
        $('.about__tab-btn').removeClass('active');
        $(this).addClass('active');
        var targetContent = $(this).attr('data-btn');
        var $targetItem = $('.about__tab-item[data-content="' + targetContent + '"]');
        $('.about__tab-item.active').fadeOut(300, function() {
            $(this).removeClass('active');
            $targetItem.addClass('active').hide().fadeIn(400);
        });
    });
});

// End About Tab 


// Start White Hitech Item Hover Tab

$(document).ready(function() {
    $('.why-hitech__item').on('mouseenter', function() {
        const targetId = $(this).attr('data-content');
        $('.why-hitech__img').stop().animate({ opacity: 0 }, 400); 
        $(`.why-hitech__img[data-img="${targetId}"]`).stop().animate({ opacity: 1 }, 400);
    });
});

// End White Hitech Item Hover Tab


// Start Manufacturing Card Swipe

$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger);

    // ধাপ ১: HTML স্পর্শ না করেই card-কে wrap করা
    $('.manufacturing__item').each(function () {
        $(this).wrap('<div class="manufacturing__item-wrap"></div>');
    });

    let scrollTriggersReady = false;
    let mm = gsap.matchMedia();

    function setupScrollTriggers() {
        mm.add("(min-width: 1025px)", () => {
            const wraps = gsap.utils.toArray('.manufacturing__item-wrap');
            let triggers = [];

            wraps.forEach((wrap, i) => {
                const card = wrap.querySelector('.manufacturing__item');
                card.style.zIndex = i + 1;

                const pinST = ScrollTrigger.create({
                    trigger: wrap,
                    start: 'top top+=80',
                    end: 'bottom top+=80',
                    pin: card,
                    pinSpacing: false,
                    invalidateOnRefresh: true, // refresh হলে নতুন করে height মাপবে
                });

                let scaleST = null;
                if (i < wraps.length - 1) {
                    scaleST = gsap.to(card, {
                        scale: 0.95,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: wrap,
                            start: 'top top+=80',
                            end: 'bottom top+=80',
                            scrub: true,
                            invalidateOnRefresh: true,
                        }
                    }).scrollTrigger;
                }

                triggers.push(pinST, scaleST);
            });

            return () => triggers.forEach(t => t && t.kill());
        });
    }

    setupScrollTriggers();

    // ================================
    // ধাপ ২: সব ছবি লোড হওয়ার পর height ঠিকভাবে recalculate
    // এইটাই মূল ফিক্স — কালো গ্যাপ এখান থেকেই হচ্ছিল
    // ================================
    function refreshAfterImages() {
        const images = document.querySelectorAll('.manufacturing__item img');
        let loaded = 0;
        const total = images.length;

        if (total === 0) {
            ScrollTrigger.refresh();
            return;
        }

        images.forEach((img) => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener('load', () => {
                    loaded++;
                    if (loaded === total) {
                        ScrollTrigger.refresh();
                    }
                });
                img.addEventListener('error', () => {
                    loaded++;
                    if (loaded === total) {
                        ScrollTrigger.refresh();
                    }
                });
            }
        });

        if (loaded === total) {
            ScrollTrigger.refresh();
        }
    }

    refreshAfterImages();

    // ================================
    // ধাপ ৩: window পুরোপুরি load হলে (fonts সহ) আরেকবার refresh
    // (at-char-animation টেক্সট অ্যানিমেশন থাকায় height পরে বদলাতে পারে)
    // ================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300); // animation/font settle হওয়ার জন্য সামান্য delay
    });

    // resize হলে recalc
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});

// End Manufacturing Card Swipe











// Start Hero Button Modal Open

$(document).ready(function() {
    $('.hero__video').on('click', function(e) {
        e.preventDefault();
        var videoSrc = "assets/intro.mp4"; 
        var modalHtml = `
            <div class="hero__overlay"></div>
            <div class="hero__video-modal">
                <span class="close-modal">&times;</span>
                <div class="video-container">
                    <video src="${videoSrc}" controls autoplay playsinline></video>
                </div>
            </div>
        `;

        $('body').append(modalHtml);
        $('.hero__overlay, .hero__video-modal').fadeIn(300);
    });
    $(document).on('click', '.close-modal, .hero__overlay', function() {
        $('.hero__overlay, .hero__video-modal').fadeOut(300, function() {
            $(this).remove();
        });
    });
});

// End Hero Button Modal Open








        $(function () {

            var $overlay = $('#manufacturingModalOverlay');


            $(document).on('click', '.manufacturing__item .manufacturing__btn .btn', function (e) {
                e.preventDefault();
                var $item = $(this).closest('[data-modal-image]');
                openManufacturingModal($item);
            });


            $(document).on('click', '.manufacturing__item[data-modal-image]', function (e) {
                if ($(e.target).closest('.manufacturing__btn').length) return;
                openManufacturingModal($(this));
            });

            function openManufacturingModal($item) {
                if (!$item || !$item.length) return;

                var image = $item.attr('data-modal-image') || '';
                var tag = $item.attr('data-tag') || '';
                var title = $item.attr('data-title') || '';
                var description = $item.attr('data-description') || '';
                var info = [];

                try {
                    info = JSON.parse($item.attr('data-info') || '[]');
                } catch (err) {
                    info = [];
                }

                $('#manufacturingModalImage').attr('src', image).attr('alt', title);
                $('#manufacturingModalTag').text(tag);
                $('#manufacturingModalTitle').text(title);
                $('#manufacturingModalDesc').text(description);

                var $info = $('#manufacturingModalInfo').empty();
                $.each(info, function (i, row) {
                    $info.append(
                        $('<li></li>').append(
                            $('<span class="manufacturing-modal__info-label"></span>').text(row.label || ''),
                            $('<span class="manufacturing-modal__info-value"></span>').text(row.value || '')
                        )
                    );
                });
                $('.manufacturing-modal__content').scrollTop(0);
                $overlay.addClass('is-active');
                $('body').css('overflow', 'hidden');
            }

            function closeManufacturingModal() {
                $overlay.removeClass('is-active');
                $('body').css('overflow', '');
            }

            $('#manufacturingModalClose').on('click', closeManufacturingModal);
            $overlay.on('click', function (e) { if (e.target === this) closeManufacturingModal(); });
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape' && $overlay.hasClass('is-active')) closeManufacturingModal();
            });

        });











    (function () {
      var fill = document.getElementById('rodFill');
      var percentEl = document.getElementById('percentNum');
      var preloader = document.getElementById('preloader');
      var preContent = document.getElementById('preContent');
      var body = document.body;
      var progress = 0;
      var finished = false;
 
      function setProgress(p) {
        progress = Math.min(p, 100);
        fill.style.width = progress + '%';
        percentEl.textContent = Math.floor(progress);
      }
 
      // Fake-but-honest progress: creeps toward 90%, real window.load finishes it
      var fakeTimer = setInterval(function () {
        if (progress < 90) {
          var step = (90 - progress) / 16 + 0.15;
          setProgress(progress + step);
        }
      }, 90);
 
      function finish() {
        if (finished) return;
        finished = true;
        clearInterval(fakeTimer);
        setProgress(100);
 
        setTimeout(function () {
          preContent.classList.add('hide');
          setTimeout(function () {
            preloader.classList.add('opening');
            body.classList.remove('is-loading');
            setTimeout(function () {
              if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 1050);
          }, 420);
        }, 300);
      }
 
      if (document.readyState === 'complete') {
        finish();
      } else {
        window.addEventListener('load', finish);
      }
      // safety net — never trap the user behind the preloader
      setTimeout(finish, 6000);
    })();












