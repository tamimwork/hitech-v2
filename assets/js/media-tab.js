$(function () {

  /* ==================================================================
     DATA
     ------------------------------------------------------------------
     IMAGE — এখানে সব ছবির লিংক একটা সাধারণ ফ্ল্যাট লিস্টে বসান।
     কোনো গ্রুপ/সেকশন লাগবে না — যত ছবি খুশি এই একটা array-তে
     যোগ করে দিলেই গ্রিডে চলে আসবে এবং lightbox-এ সব ছবির মধ্যে
     prev/next দিয়ে ব্রাউজ করা যাবে।

     VIDEO — প্রতিটা এন্ট্রি একটা করে ভিডিও:
       source : 'youtube' -> videoId দিন (শুধু আইডি অংশ)
              : 'file'    -> videoSrc দিন (নিজের mp4/webm লিংক),
                              সাথে thumb অবশ্যই দিন
  ================================================================== */
  var flatImages = [
    'assets/images/gallery/img/hitech1.jpg',
    'assets/images/gallery/img/hitech2.jpg',
    'assets/images/gallery/img/hitech3.jpg',
    'assets/images/gallery/img/hitech4.jpg',
    'assets/images/gallery/img/hitech5.jpg',
    'assets/images/gallery/img/hitech6.jpg',
    'assets/images/gallery/img/hitech7.jpg',
    'assets/images/gallery/img/hitech8.jpg',
    'assets/images/gallery/img/hitech9.jpg',
    'assets/images/gallery/img/hitech10.jpg',
    'assets/images/gallery/img/hitech11.jpg',
    'assets/images/gallery/img/hitech12.jpg',
    'assets/images/gallery/img/hitech13.jpg',
    'assets/images/gallery/img/hitech14.jpg',
    'assets/images/gallery/img/hitech15.jpg',
    'assets/images/gallery/img/hitech16.jpg',
    'assets/images/gallery/img/hitech17.png'
  ];

  var videoData = [
    {
      source: 'youtube',
      title: 'Forging the Future',
      sub: 'Inside the rolling mill — raw billet takes shape under fire.',
      videoId: 'TLkA0RELQ1g'
    },
    {
      source: 'youtube',
      title: 'Forging the Future',
      sub: 'Sparks fly as the forging line runs around the clock.',
      videoId: 'aqz-KE-bpKQ'
    },
    {
      source: 'file',
      title: 'Factory Walkthrough',
      sub: 'A closer look, filmed on-site.',
      videoSrc: 'assets/videos/factory-walkthrough.mp4',
      thumb: 'assets/videos/factory-walkthrough-thumb.jpg'
    }
  ];

  var ICON_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  var currentTab = 'image';
  var currentList = flatImages;
  var currentIndex = 0;

  function getVideoThumb(item) {
    if (item.source === 'youtube') return item.thumb || ('https://img.youtube.com/vi/' + item.videoId + '/hqdefault.jpg');
    return item.thumb;
  }

  /* ----------------------------------------------------------------
     RENDER GRID — plain flat photo/video tiles, no album grouping
  ---------------------------------------------------------------- */
  function renderGrid(tab) {
    var $grid = $('#galleryGrid').empty();
    var list = tab === 'image' ? flatImages : videoData;

    list.forEach(function (item, i) {
      var thumb = tab === 'image' ? item : getVideoThumb(item);
      var $card = $(
        '<div class="g-card" data-idx="' + i + '">' +
        '<img src="' + thumb + '" alt="" loading="lazy">' +
        (tab === 'video' ? '<span class="play-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg></span>' : '') +
        '</div>'
      );
      $grid.append($card);
    });
  }

  renderGrid(currentTab);

  /* ----------------------------------------------------------------
     TAB SWITCH
  ---------------------------------------------------------------- */
  $('.tab-toggle button').on('click', function () {
    $('.tab-toggle button').removeClass('active');
    $(this).addClass('active');
    currentTab = $(this).data('tab');
    currentList = currentTab === 'image' ? flatImages : videoData;
    renderGrid(currentTab);
  });

  /* ----------------------------------------------------------------
     OPEN / CLOSE MODAL
  ---------------------------------------------------------------- */
  $('#galleryGrid').on('click', '.g-card', function () {
    currentList = currentTab === 'image' ? flatImages : videoData;
    openModal(parseInt($(this).data('idx'), 10));
  });

  function openModal(index) {
    currentIndex = index;
    renderStage();
    $('#modalOverlay').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {
    $('#modalOverlay').removeClass('open');
    $('body').css('overflow', '');
    $('#modalStage').empty(); // video/iframe বন্ধ করতে
  }

  function renderStage() {
    var item = currentList[currentIndex];
    var $stage = $('#modalStage').empty();

    if (currentTab === 'video') {
      var $frame = $('<div class="video-frame"></div>');
      if (item.source === 'youtube') {
        var $iframe = $('<iframe allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>')
          .attr('src', 'https://www.youtube.com/embed/' + item.videoId + '?autoplay=1&rel=0');
        $frame.append($iframe);
      } else {
        var $video = $('<video controls autoplay playsinline></video>').attr('src', item.videoSrc);
        $frame.append($video);
      }
      $stage.append($frame);
      $('#modalCaption').text(item.title || '');
    } else {
      $stage.append($('<img>').attr('src', item).attr('alt', ''));
      $('#modalCaption').text('');
    }

    $('#modalCounter').text(
      String(currentIndex + 1).padStart(2, '0') + ' / ' + String(currentList.length).padStart(2, '0')
    );

    var multi = currentList.length > 1;
    $('#modalPrev, #modalNext').toggleClass('hidden', !multi);
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    renderStage();
  }
  function goNext() {
    currentIndex = (currentIndex + 1) % currentList.length;
    renderStage();
  }

  $('#modalPrev').html(ICON_PREV).on('click', goPrev);
  $('#modalNext').html(ICON_NEXT).on('click', goNext);
  $('#modalClose').on('click', closeModal);

  // overlay-র খালি জায়গায় ক্লিক করলে বন্ধ হবে
  $('#modalOverlay').on('click', function (e) {
    if (e.target.id === 'modalOverlay') { closeModal(); }
  });

  // কীবোর্ড সাপোর্ট
  $(document).on('keydown', function (e) {
    if (!$('#modalOverlay').hasClass('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

});