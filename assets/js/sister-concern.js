/* ════════════════════════════════════════════════════════════
   SISTER CONCERNS — dynamic modal only (jQuery, no GSAP)

   Load order on the page:
     jQuery → sister-concerns-modal.js

   এই file টা শুধু modal এর কাজ করে:
     ক্লিক করলে jQuery দিয়ে dynamically modal বানিয়ে খোলে —
     content + gallery সবই SISTER_CONCERNS_DATA থেকে আসে।
     কোনো GSAP animation নেই — class add/remove করেই
     show/hide হয় (CSS এ যা transition আছে সেটাই কাজ করবে)।
   ════════════════════════════════════════════════════════════ */

(function ($) {
    'use strict';

    /* ────────────────────────────────────────────────────────
        DATA SOURCE
        modal এর "নাম" section এর নামের সাথে মিল রেখে (sister-concerns
        prefix) class বানানো হয়েছে। id গুলো HTML এর data-modal এর
        সাথে মিলতে হবে। gallery path গুলো placeholder — client এর
        আসল ছবি বসালে replace করে দিও।
     ──────────────────────────────────────────────────────── */
    const SISTER_CONCERNS_DATA = [
        {
            id: 'rahman',
            tag: 'RMG Industry',
            title: 'Rahman Knit Garments Ltd.',
            description:
                'A 100% export-oriented vertically integrated knit composite factory established in 1991 at Fatullah, Narayanganj, with spinning, knitting, fabric & yarn dyeing, and sewing & finishing units producing approximately 50,000–55,000 pieces per day.',
            points: [
                'Complete composite unit with knitting, dyeing, yarn dyeing, sewing and finishing divisions.',
                'Principal buyers include reputed companies across Europe — quality production and punctual shipment are the company\u2019s motto.',
                'Prime Customer Award from Janata Bank (2002) and a CSR Award for establishing Mahbubur Rahman Memorial Hospital.',
            ],
            website: 'https://rkgltd.com/',
            gallery: [
                'assets/images/sister-consern/rkg/rkg1.jpg',
                'assets/images/sister-consern/rkg/rkg2.jpg',
                'assets/images/sister-consern/rkg/rkg3.jpg',
                'assets/images/sister-consern/rkg/rkg4.jpg'
            ],
        },
        {
            id: 'maksuda',
            tag: 'Spinning & Yarn',
            title: 'Maksuda Spinning Mills Ltd.',
            description:
                'Acquired in 2018 to vertically integrate the textile business. The quality of any fabric depends on its yarn — here we never compromise, selecting the best raw cotton and processing it through advanced machinery.',
            points: [
                'Mission: to provide customers the best possible satisfaction by facilitating reliable, best-quality yarn.',
                'Vision: to emerge as a premier yarn manufacturer that fabric producers can rely on.',
                'Quality · Commitment · Consistency — the guiding principles of Maksuda Spinning Mills.',
            ],
            website: 'https://maksudaspinning.com/',
            gallery: [
                'assets/images/sister-consern/maksuda/1.jpg',
                'assets/images/sister-consern/maksuda/2.jpg',
                'assets/images/sister-consern/maksuda/3.jpg',
                'assets/images/sister-consern/maksuda/4.jpg',
                'assets/images/sister-consern/maksuda/5.jpg',
                'assets/images/sister-consern/maksuda/6.jpg',
            ],
        },
{
    id: 'hospital',
    tag: 'Healthcare & CSR',
    title: 'Mahbubur Rahman Memorial Hospital',
    description:
        'Mahbubur Rahman Memorial Hospital is a 120-bed non-profit healthcare institution dedicated to delivering affordable, high-quality, and compassionate medical care. Equipped with advanced medical technology and experienced specialists, the hospital ensures that people in rural communities receive healthcare services comparable to those available in major cities.',

    points: [
        'Comprehensive specialist care including NICU, Medicine, Gynecology & Obstetrics, Pediatrics, General Surgery, Gastroenterology, ENT, Chest Medicine, Neurology, Nephrology, and Cardiology.',
        'Advanced diagnostic facilities featuring Siemens CT Scan, modern laboratory services, Endoscopy, Laparoscopy, Dental Care, Physiotherapy, and 24/7 Ambulance support.',
        'Operates alongside Mahbubur Rahman Memorial Nursing Institute, empowering talented students with quality nursing education and preparing skilled healthcare professionals serving hospitals across Bangladesh.'
    ],

    website: 'https://mahbuburrahmanhospital.com/',

    gallery: [
        'assets/images/sister-consern/hospital/hospital1.jpg',
        'assets/images/sister-consern/hospital/hospital2.jpg',
        'assets/images/sister-consern/hospital/hospital3.jpg',
        'assets/images/sister-consern/hospital/hospital4.jpg',
        'assets/images/sister-consern/hospital/hospital5.jpg',
    ],
},
    ];

    let $overlay, $modal;
    let currentSlide = 0;

    /* ════════════════════════════════════════════════════════
        STEP 1 — BUILD MODAL SKELETON (একবারই body তে inject হয়)
     ════════════════════════════════════════════════════════ */
    function buildModalSkeleton() {
        const markup = `
            <div class="sister-concerns-overlay" id="sisterConcernsOverlay">
                <div class="sister-concerns-modal" id="sisterConcernsModal" role="dialog" aria-modal="true" aria-labelledby="sisterConcernsModalTitle">
                    <button type="button" class="sister-concerns-modal__close" aria-label="Close">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    </button>

                    <div class="sister-concerns-modal__gallery">
                        <div class="sister-concerns-modal__slides"></div>
                        <button type="button" class="sister-concerns-modal__nav sister-concerns-modal__nav--prev" aria-label="Previous image">
                            <svg viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="sister-concerns-modal__nav sister-concerns-modal__nav--next" aria-label="Next image">
                            <svg viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <div class="sister-concerns-modal__dots"></div>
                    </div>

                    <div class="sister-concerns-modal__content">
                        <div class="sister-concerns-modal__tag">
                            <span class="sister-concerns-modal__tag-dot"></span>
                            <span class="sister-concerns-modal__tag-text"></span>
                        </div>
                        <h3 class="sister-concerns-modal__title" id="sisterConcernsModalTitle"></h3>
                        <p class="sister-concerns-modal__desc"></p>
                        <ul class="sister-concerns-modal__points"></ul>
                        <a href="#" target="_blank" rel="noopener" class="btn btn-white sister-concerns-modal__cta">
                            <span class="btn__left-arrow"><img src="assets/images/icons/button-arrow-black.svg" alt=""></span>
                            <span class="btn__text">Visit company website</span>
                            <span class="btn__right-arrow"><img src="assets/images/icons/btn-arrow-white.svg" alt=""></span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        $('body').append(markup);
        $overlay = $('#sisterConcernsOverlay');
        $modal = $('#sisterConcernsModal');
    }

    /* ════════════════════════════════════════════════════════
        STEP 2 — POPULATE MODAL FROM DATA
     ════════════════════════════════════════════════════════ */
    function populateModal(data) {
        $modal.attr('data-modal-name', 'sister-concerns-modal--' + data.id);
        $modal.find('.sister-concerns-modal__tag-text').text(data.tag);
        $modal.find('.sister-concerns-modal__title').text(data.title);
        $modal.find('.sister-concerns-modal__desc').text(data.description);

        const $points = $modal.find('.sister-concerns-modal__points').empty();
        data.points.forEach((point) => {
            $points.append(`
                <li class="sister-concerns-modal__point">
                    <span class="sister-concerns-modal__point-icon">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M2 7.2L5.3 10.5L12 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="sister-concerns-modal__point-text">${point}</span>
                </li>
            `);
        });

        $modal.find('.sister-concerns-modal__cta').attr('href', data.website);
        renderGallery(data.gallery);
    }

    /* ────────────────────────────────────────────────────────
        Gallery (slick-style prev/next + dots, plain opacity swap)
        — image অথবা video, যেটাই হোক, একই class দিয়ে একইভাবে
          width:100% / height:100% / object-fit:cover বসে (CSS দেখো)
     ──────────────────────────────────────────────────────── */
    const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)$/i;
    const isVideoSrc = (src) => VIDEO_EXT.test(src);

    function buildSlideMarkup(src, isFirst) {
        const visibility = `style="opacity:${isFirst ? 1 : 0}"`;

        if (isVideoSrc(src)) {
            return `
                <video class="sister-concerns-modal__slide" ${visibility}
                    muted playsinline loop preload="metadata">
                    <source src="${src}" type="video/mp4">
                </video>
            `;
        }

        return `<img src="${src}" class="sister-concerns-modal__slide" ${visibility} alt="">`;
    }

    function renderGallery(images) {
        const $slides = $modal.find('.sister-concerns-modal__slides').empty();
        const $dots = $modal.find('.sister-concerns-modal__dots').empty();

        images.forEach((src, i) => {
            $slides.append(buildSlideMarkup(src, i === 0));
            $dots.append(`<span class="sister-concerns-modal__dot${i === 0 ? ' is-active' : ''}"></span>`);
        });

        currentSlide = 0;
        $modal.find('.sister-concerns-modal__nav').toggle(images.length > 1);
        $modal.find('.sister-concerns-modal__dots').toggle(images.length > 1);
        playActiveSlide();
    }

    // active slide-এ যদি video থাকে তাহলে play করো, বাকি সব video pause
    function playActiveSlide() {
        const $slides = $modal.find('.sister-concerns-modal__slide');

        $slides.each(function (i) {
            if (this.tagName !== 'VIDEO') return;
            if (i === currentSlide) {
                const playPromise = this.play();
                if (playPromise && playPromise.catch) playPromise.catch(() => {});
            } else {
                this.pause();
            }
        });
    }

    function pauseAllSlides() {
        $modal.find('.sister-concerns-modal__slide').each(function () {
            if (this.tagName === 'VIDEO') this.pause();
        });
    }

    function goToSlide(index) {
        const $slides = $modal.find('.sister-concerns-modal__slide');
        const total = $slides.length;
        if (!total) return;

        index = (index + total) % total;
        if (index === currentSlide) return;

        $slides.eq(currentSlide).css('opacity', 0);
        $slides.eq(index).css('opacity', 1);

        $modal.find('.sister-concerns-modal__dot').removeClass('is-active').eq(index).addClass('is-active');
        currentSlide = index;
        playActiveSlide();
    }

    /* ════════════════════════════════════════════════════════
        STEP 3 — OPEN / CLOSE MODAL (plain show/hide, no GSAP)
     ════════════════════════════════════════════════════════ */
    function openModal(id) {
        const data = SISTER_CONCERNS_DATA.find((d) => d.id === id);
        if (!data) return;

        populateModal(data);
        $('html, body').addClass('sister-concerns-lock');
        $overlay.addClass('is-active');
    }

    function closeModal() {
        if (!$overlay.hasClass('is-active')) return;

        $overlay.removeClass('is-active');
        $('html, body').removeClass('sister-concerns-lock');
        pauseAllSlides();
    }

    /* ════════════════════════════════════════════════════════
        STEP 4 — EVENT BINDINGS
     ════════════════════════════════════════════════════════ */
    function bindEvents() {
        // card click → open modal (Visit button click বাদ দিয়ে)
        $(document).on('click', '.sister-concerns__item', function (e) {
            if ($(e.target).closest('.sister-concerns__btn').length) return;
            openModal($(this).data('modal'));
        });

        // keyboard accessibility (Enter / Space)
        $(document).on('keydown', '.sister-concerns__item', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            if ($(e.target).closest('.sister-concerns__btn').length) return;
            e.preventDefault();
            openModal($(this).data('modal'));
        });

        // close: close-button, overlay backdrop click, ESC
        $(document).on('click', '.sister-concerns-modal__close', closeModal);

        $(document).on('click', '.sister-concerns-overlay', function (e) {
            if (e.target === this) closeModal();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $overlay.hasClass('is-active')) closeModal();
        });

        // gallery nav
        $(document).on('click', '.sister-concerns-modal__nav--next', () => goToSlide(currentSlide + 1));
        $(document).on('click', '.sister-concerns-modal__nav--prev', () => goToSlide(currentSlide - 1));
        $(document).on('click', '.sister-concerns-modal__dot', function () {
            goToSlide($(this).index());
        });
    }

    /* ════════════════════════════════════════════════════════
        BOOT
     ════════════════════════════════════════════════════════ */
    $(function () {
        buildModalSkeleton();
        bindEvents();
    });
})(jQuery);