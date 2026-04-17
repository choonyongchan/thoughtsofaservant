(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav-links');
  var heroScroll = document.querySelector('.hero-scroll');
  var mainContent = document.getElementById('main-content');
  var genreFilter = document.getElementById('genre-filter');
  var postSearch = document.getElementById('post-search');
  var backToTop = document.querySelector('.back-to-top');

  if (header && !document.body.classList.contains('home-page')) {
    header.classList.add('scrolled');
  }

  if (header && document.body.classList.contains('home-page')) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 200);
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  if (heroScroll && mainContent) {
    heroScroll.addEventListener('click', function (e) {
      e.preventDefault();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function applyPostFilters() {
    var cards = document.querySelectorAll('.post-card');
    if (!cards.length) return;

    var genreValue = genreFilter ? genreFilter.value : 'all';
    var query = postSearch ? postSearch.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardGenre = card.getAttribute('data-genre') || '';
      var haystack = (card.getAttribute('data-search') || '').toLowerCase();
      var show = (genreValue === 'all' || cardGenre === genreValue) &&
                 (!query || haystack.indexOf(query) !== -1);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    var visibleCountEl = document.querySelector('[data-post-visible-count]');
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
  }

  function debounce(fn, delay) {
    var timer;
    return function () { clearTimeout(timer); timer = setTimeout(fn, delay); };
  }

  if (genreFilter) genreFilter.addEventListener('change', applyPostFilters);
  if (postSearch) postSearch.addEventListener('input', debounce(applyPostFilters, 150));
})();
