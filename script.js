/* ============================================================
   script.js - Trung Tâm Ngoại Ngữ Và Toán Tư Duy Trẻ
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // 1. AOS - SCROLL REVEAL (Custom lightweight implementation)
  // ============================================================
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('aos-animate');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }
  initAOS();

  // ============================================================
  // 2. STICKY HEADER
  // ============================================================
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ============================================================
  // 3. FLOATING CTA + MOBILE FAB
  // ============================================================
  var floatingCta = document.getElementById('floating-cta');
  var mobileFab = document.getElementById('mobile-phone-fab');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      floatingCta.classList.add('visible');
      if (mobileFab) mobileFab.classList.add('has-floating-cta');
    } else {
      floatingCta.classList.remove('visible');
      if (mobileFab) mobileFab.classList.remove('has-floating-cta');
    }
  });

  // ============================================================
  // 4. MOBILE MENU
  // ============================================================
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileOverlay = document.getElementById('mobile-overlay');
  var mobileClose = document.getElementById('mobile-close');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-menu a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ============================================================
  // 5. HERO SLIDER
  // ============================================================
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots  = document.querySelectorAll('.hero-dot');
  var heroIndex = 0;
  var heroTimer = null;

  function goHeroSlide(n) {
    heroSlides[heroIndex].classList.remove('active');
    heroDots[heroIndex].classList.remove('active');
    heroIndex = (n + heroSlides.length) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
    heroDots[heroIndex].classList.add('active');
  }
  function heroAutoPlay() {
    heroTimer = setInterval(function () { goHeroSlide(heroIndex + 1); }, 5500);
  }
  heroAutoPlay();

  document.getElementById('hero-prev').addEventListener('click', function () {
    clearInterval(heroTimer);
    goHeroSlide(heroIndex - 1);
    heroAutoPlay();
  });
  document.getElementById('hero-next').addEventListener('click', function () {
    clearInterval(heroTimer);
    goHeroSlide(heroIndex + 1);
    heroAutoPlay();
  });
  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      clearInterval(heroTimer);
      goHeroSlide(parseInt(this.getAttribute('data-slide'), 10));
      heroAutoPlay();
    });
  });

  // ============================================================
  // 6. VIDEO MODAL
  // ============================================================
  var videoModal  = document.getElementById('video-modal');
  var modalVideo  = document.getElementById('modal-video');
  var modalVideoSrc = modalVideo.querySelector('source');

  function openVideoModal(src) {
    modalVideoSrc.src = src;
    modalVideo.load();
    modalVideo.play();
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeVideoModal() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideoSrc.src = '';
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('video-modal-close').addEventListener('click', closeVideoModal);
  document.getElementById('video-modal-overlay').addEventListener('click', closeVideoModal);

  // Hero video button
  var heroPlayBtn = document.getElementById('hero-play-btn');
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', function () {
      openVideoModal(this.getAttribute('data-video'));
    });
  }

  // Video thumbnails
  document.querySelectorAll('.video-thumb:not(.photo-thumb)').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      openVideoModal(this.getAttribute('data-video'));
    });
    // Hover preview play
    thumb.addEventListener('mouseenter', function () {
      var vid = this.querySelector('.video-preview');
      if (vid) vid.play();
    });
    thumb.addEventListener('mouseleave', function () {
      var vid = this.querySelector('.video-preview');
      if (vid) { vid.pause(); vid.currentTime = 0; }
    });
  });

  // ============================================================
  // 7. IMAGE MODAL (for photo thumbnails)
  // ============================================================
  var imgModal     = document.getElementById('img-modal');
  var modalImgEl   = document.getElementById('modal-img');

  function openImgModal(src, alt) {
    modalImgEl.src = src;
    modalImgEl.alt = alt || '';
    imgModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeImgModal() {
    imgModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('img-modal-close').addEventListener('click', closeImgModal);
  document.getElementById('img-modal-overlay').addEventListener('click', closeImgModal);

  document.querySelectorAll('.photo-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var src = this.getAttribute('data-img');
      var alt = this.querySelector('.video-title-text').textContent;
      openImgModal(src, alt);
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeImgModal();
      closeMobileMenu();
    }
  });

  // ============================================================
  // 8. PROMO SLIDER
  // ============================================================
  var promoSlides = document.querySelectorAll('.promo-slide');
  var promoIndex  = 0;
  var promoTimer  = null;

  function goPromoSlide(n) {
    promoSlides[promoIndex].classList.remove('active');
    promoIndex = (n + promoSlides.length) % promoSlides.length;
    promoSlides[promoIndex].classList.add('active');
  }
  function promoAutoPlay() {
    promoTimer = setInterval(function () { goPromoSlide(promoIndex + 1); }, 6000);
  }
  promoAutoPlay();

  document.getElementById('promo-prev').addEventListener('click', function () {
    clearInterval(promoTimer);
    goPromoSlide(promoIndex - 1);
    promoAutoPlay();
  });
  document.getElementById('promo-next').addEventListener('click', function () {
    clearInterval(promoTimer);
    goPromoSlide(promoIndex + 1);
    promoAutoPlay();
  });

  // ============================================================
  // 9. HALL OF GREATNESS SLIDER
  // ============================================================
  var hallSlider = document.getElementById('hall-slider');
  var hallCards  = document.querySelectorAll('.hall-card');
  var hallIdx    = 0;
  var visibleHall = getVisibleHallCards();

  function getVisibleHallCards() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  }

  function updateHall() {
    visibleHall = getVisibleHallCards();
    var cardWidth = hallSlider.offsetWidth / visibleHall;
    hallSlider.style.transform = 'translateX(-' + (hallIdx * cardWidth) + 'px)';
    hallSlider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    // Apply flex basis
    hallCards.forEach(function (card) {
      card.style.flex = '0 0 calc(' + (100 / visibleHall) + '% - ' + (24 * (visibleHall - 1) / visibleHall) + 'px)';
    });
  }

  document.getElementById('hall-prev').addEventListener('click', function () {
    if (hallIdx > 0) { hallIdx--; updateHall(); }
  });
  document.getElementById('hall-next').addEventListener('click', function () {
    visibleHall = getVisibleHallCards();
    if (hallIdx < hallCards.length - visibleHall) { hallIdx++; updateHall(); }
  });
  window.addEventListener('resize', function () { visibleHall = getVisibleHallCards(); updateHall(); });
  updateHall();

  // ============================================================
  // 10. FACILITIES SLIDER
  // ============================================================
  var facSlides = document.querySelectorAll('.fac-slide');
  var facDots   = document.querySelectorAll('.fac-dot');
  var facIdx    = 0;
  var facTimer  = null;

  function goFacSlide(n) {
    facSlides[facIdx].classList.remove('active');
    facDots[facIdx].classList.remove('active');
    facIdx = (n + facSlides.length) % facSlides.length;
    facSlides[facIdx].classList.add('active');
    facDots[facIdx].classList.add('active');
  }
  function facAutoPlay() {
    facTimer = setInterval(function () { goFacSlide(facIdx + 1); }, 4500);
  }
  facAutoPlay();

  document.getElementById('fac-prev').addEventListener('click', function () {
    clearInterval(facTimer);
    goFacSlide(facIdx - 1);
    facAutoPlay();
  });
  document.getElementById('fac-next').addEventListener('click', function () {
    clearInterval(facTimer);
    goFacSlide(facIdx + 1);
    facAutoPlay();
  });
  facDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      clearInterval(facTimer);
      goFacSlide(parseInt(this.getAttribute('data-fac'), 10));
      facAutoPlay();
    });
  });

  // ============================================================
  // 11. REGISTER FORM
  // ============================================================
  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 500);
    }, 3500);
  }

  window.handleRegister = function (e) {
    e.preventDefault();
    showToast('Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
    e.target.reset();
  };

  window.handleNewsletter = function (e) {
    e.preventDefault();
    showToast('Đăng ký nhận bản tin thành công!');
    e.target.reset();
  };

  // ============================================================
  // 12. SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 13. TOPBAR HIDE ON SCROLL DOWN
  // ============================================================
  var topbar = document.getElementById('topbar');
  var lastScrollY = 0;
  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;
    if (currentY > 200) {
      topbar.style.transform = 'translateY(-100%)';
      topbar.style.transition = 'transform 0.3s ease';
    } else {
      topbar.style.transform = 'translateY(0)';
    }
    lastScrollY = currentY;
  });

});
