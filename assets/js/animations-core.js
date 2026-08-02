/* ════════════════════════════════════════════════════════════════
   HT (Hi-Tech) ANIMATION CORE
   ------------------------------------------------------------------
   এইখানে সব সেকশনে বার বার লেখা GSAP প্যাটার্নগুলো (heading reveal,
   fade-up stagger, number counter, shape float, magnetic hover,
   image clip-reveal) একবারই লেখা হয়েছে — reusable function হিসেবে।

   প্রতিটা সেকশনের animation file (hero, about, manufacturing, media,
   why-hitech, product) এখন থেকে এই common function গুলো কল করবে,
   নিজে নিজে duplicate কোড লিখবে না।

   ব্যবহার: এই file-টা অন্য সব animation script-এর আগে load করতে হবে।
   ════════════════════════════════════════════════════════════════ */

(function (window) {
    'use strict';

    if (typeof gsap === 'undefined') {
        console.warn('[HT] GSAP not found — load gsap.js before animations-core.js');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var HT = {};

    /* ────────────────────────────────────────────────────────────
        1. HEADING REVEAL (line-based clip / slide-up)
        h2 কে একটা overflow:hidden wrapper দিয়ে মুড়ে, ভেতরের লাইনটাকে
        নিচ থেকে উপরে uncover করে। hero / manufacturing / media —
        সবাই একই প্যাটার্ন ব্যবহার করত, এখন এক জায়গায়।
    ──────────────────────────────────────────────────────────── */
    HT.prepareHeadingLines = function (selector, innerClass) {
        innerClass = innerClass || 'js-h2-inner';
        var els = document.querySelectorAll(selector);
        els.forEach(function (h2) {
            if (h2.querySelector('.' + innerClass)) return; // already prepared
            h2.style.overflow = 'hidden';
            h2.style.display = 'block';

            var inner = document.createElement('div');
            inner.className = innerClass;
            inner.style.cssText = 'display:block; will-change:transform;';
            inner.innerHTML = h2.innerHTML;

            h2.innerHTML = '';
            h2.appendChild(inner);
        });
        return innerClass;
    };

    // টাইমলাইনের ভেতরে "add" করার মতো tween রিটার্ন করে, চাইলে standalone-ও চালানো যায়
    HT.headingRevealTween = function (innerSelector, vars, tl, position) {
        var base = {
            yPercent: 0,
            skewY: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.045
        };
        gsap.set(innerSelector, { yPercent: 115, skewY: 3.5 });
        var tween = { yPercent: 0, skewY: 0, duration: base.duration, ease: base.ease, stagger: base.stagger };
        Object.assign(tween, vars);
        if (tl) return tl.to(innerSelector, tween, position);
        return gsap.to(innerSelector, tween);
    };

    /* ────────────────────────────────────────────────────────────
        2. CHARACTER-BY-CHARACTER HEADING SPLIT (why-hitech style)
    ──────────────────────────────────────────────────────────── */
    HT.prepareHeadingChars = function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
            if (el.querySelector('.js-char-word')) return;
            var words = el.textContent.trim().split(/\s+/);
            el.innerHTML = '';
            el.style.display = 'block';

            words.forEach(function (word, wi) {
                var wordSpan = document.createElement('span');
                wordSpan.className = 'js-char-word';
                wordSpan.style.cssText = 'display:inline-block; white-space:nowrap;';

                Array.prototype.forEach.call(word, function (ch) {
                    var outer = document.createElement('span');
                    outer.className = 'js-char-outer';
                    outer.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:top;';

                    var inner = document.createElement('span');
                    inner.className = 'js-char-inner';
                    inner.style.cssText = 'display:inline-block; will-change:transform;';
                    inner.textContent = ch;

                    outer.appendChild(inner);
                    wordSpan.appendChild(outer);
                });

                el.appendChild(wordSpan);
                if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
            });
        });
    };

    /* ────────────────────────────────────────────────────────────
        3. FADE / SLIDE-UP REVEAL (single elements or stagger groups)
    ──────────────────────────────────────────────────────────── */
    HT.fadeUp = function (selector, opts) {
        opts = opts || {};
        var y = opts.y != null ? opts.y : 30;
        gsap.set(selector, { autoAlpha: 0, y: y });

        var vars = {
            autoAlpha: 1,
            y: 0,
            duration: opts.duration || 0.8,
            ease: opts.ease || 'power3.out',
            stagger: opts.stagger || 0
        };
        if (opts.delay) vars.delay = opts.delay;

        if (opts.trigger) {
            vars.scrollTrigger = Object.assign({
                trigger: opts.trigger,
                start: opts.start || 'top 80%',
                once: opts.once !== false
            }, opts.scrollTriggerVars || {});
        }
        return gsap.to(selector, vars);
    };

    /* ────────────────────────────────────────────────────────────
        4. NUMBER COUNTER — text-এর ভেতরের সংখ্যাটা 0 থেকে count-up করে,
           prefix/suffix এবং leading-zero প্যাডিং বজায় রেখে।
    ──────────────────────────────────────────────────────────── */
    HT.counterUp = function (selector, opts) {
        opts = opts || {};
        document.querySelectorAll(selector).forEach(function (el, i) {
            var original = el.textContent.trim();
            var match = original.match(/(\d+)/);
            if (!match) return;

            var endVal = +match[0];
            var digits = opts.padZero ? match[0].length : 0;
            var prefix = original.slice(0, match.index);
            var suffix = original.slice(match.index + match[0].length);
            var proxy = { n: 0 };

            gsap.to(proxy, {
                n: endVal,
                duration: opts.duration || 2,
                delay: (opts.stagger || 0) * i,
                ease: opts.ease || 'expo.out',
                onUpdate: function () {
                    var val = digits ? String(Math.round(proxy.n)).padStart(digits, '0') : Math.round(proxy.n);
                    el.textContent = prefix + val + suffix;
                },
                onComplete: function () { el.textContent = original; }
            });
        });
    };

    HT.counterUpOnScroll = function (selector, triggerEl, opts) {
        opts = opts || {};
        ScrollTrigger.create({
            trigger: triggerEl,
            start: opts.start || 'top 85%',
            once: true,
            onEnter: function () { HT.counterUp(selector, opts); }
        });
    };

    /* ────────────────────────────────────────────────────────────
        5. SHAPE MOTION — load-in slide + infinite float(yoyo) +
           scroll-driven drift. Position property (left/right/bottom/x/y)
           প্যারামিটার হিসেবে দেওয়া যায়, যাতে ভিন্ন shape-এর সাথে conflict না হয়।
    ──────────────────────────────────────────────────────────── */
    HT.shapeMotion = function (el, opts) {
        if (!el) return;
        opts = opts || {};

        // ১. Load animation — একটা প্রপার্টি দিয়ে বাইরে থেকে ভেতরে আসবে
        if (opts.load) {
            gsap.fromTo(el, opts.load.from, Object.assign({
                duration: 1.6, ease: 'power3.out', delay: 0.2
            }, opts.load.to));
        }

        // ২. Infinite float — অন্য একটা প্রপার্টি দিয়ে yoyo loop
        if (opts.float) {
            gsap.fromTo(el, opts.float.from, Object.assign({
                duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2
            }, opts.float.to));
        }

        // ৩. Scroll parallax drift
        if (opts.scroll) {
            gsap.to(el, Object.assign({
                ease: 'none',
                scrollTrigger: Object.assign({
                    trigger: opts.triggerEl || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                }, opts.scroll.scrollTriggerVars || {})
            }, opts.scroll.to));
        }
    };

    /* ────────────────────────────────────────────────────────────
        6. MAGNETIC HOVER — cursor-এর কাছে গেলে element হালকা সেদিকে সরে
    ──────────────────────────────────────────────────────────── */
    HT.magneticHover = function (selector, strength) {
        strength = strength || 0.3;
        document.querySelectorAll(selector).forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var cx = rect.left + rect.width * 0.5;
                var cy = rect.top + rect.height * 0.5;
                var dx = (e.clientX - cx) * strength;
                var dy = (e.clientY - cy) * strength;

                gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
            });
        });
    };

    /* ────────────────────────────────────────────────────────────
        7. IMAGE / PANEL CLIP-REVEAL (height 0 → 100%, no parallax)
           নোট: এই ফাংশন ইচ্ছাকৃতভাবে কোনো ভেতরের image parallax যোগ করে
           না — শুধু reveal করে। হিরো ভিডিও ও ইমপ্যাক্ট ইমেজে parallax
           বাদ দেওয়ার requirement অনুযায়ী এইটাই ব্যবহার করা হয়েছে।
    ──────────────────────────────────────────────────────────── */
    HT.clipReveal = function (selector, opts) {
        opts = opts || {};
        var fromInset = opts.fromInset || 'inset(0% 0% 100% 0%)';
        var toInset = opts.toInset || 'inset(0% 0% 0% 0%)';

        gsap.set(selector, { clipPath: fromInset });

        var vars = {
            clipPath: toInset,
            duration: opts.duration || 1.4,
            ease: opts.ease || 'expo.inOut'
        };
        if (opts.delay) vars.delay = opts.delay;

        if (opts.trigger) {
            vars.scrollTrigger = Object.assign({
                trigger: opts.trigger,
                start: opts.start || 'top 80%',
                once: opts.once !== false
            }, opts.scrollTriggerVars || {});
        }
        return gsap.to(selector, vars);
    };

    /* ────────────────────────────────────────────────────────────
        8. SIMPLE SCROLL DRIFT (depth-style yPercent parallax for
           non-media elements like columns/tags — decorative only,
           NOT used on hero video or impact image per requirement)
    ──────────────────────────────────────────────────────────── */
    HT.scrollDrift = function (selector, triggerEl, yPercent, scrub) {
        return gsap.to(selector, {
            yPercent: yPercent,
            ease: 'none',
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: scrub || 1.2
            }
        });
    };

    window.HT = HT;

})(window);
