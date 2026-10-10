/* BX Fitness Hub — interactions */
(function () {
  'use strict';

  /* Header background on scroll + back-to-top */
  var header = document.querySelector('.site-header');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Service tabs — scoped per .menu section (Gym + Spa both use it) */
  document.querySelectorAll('.menu__tabs').forEach(function (group) {
    var scope = group.closest('.menu') || group.parentElement;
    var btns = group.querySelectorAll('[role="tab"]');
    btns.forEach(function (tab) {
      tab.addEventListener('click', function () {
        btns.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        scope.querySelectorAll('.menu__panel').forEach(function (p) { p.classList.remove('is-active'); });
        var panel = scope.querySelector('#panel-' + tab.dataset.tab);
        if (panel) panel.classList.add('is-active');
      });
    });
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Booking forms -> WhatsApp (each form carries its own number in data-wa) */
  var isAr = (document.documentElement.lang || 'ar').slice(0, 2) === 'ar';
  document.querySelectorAll('form[data-wa]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var wa = form.getAttribute('data-wa') || '201040001413';
      var get = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      var name = get('name');
      if (!name) {
        var n = form.querySelector('[name="name"]');
        if (n) { n.focus(); n.style.borderColor = '#C8F134'; }
        return;
      }
      var phone = get('phone');
      var service = get('service');
      var when = get('when');
      var notes = get('notes');
      var isSpa = form.getAttribute('data-wa') === '201040001409';

      var lines;
      if (isAr) {
        lines = isSpa
          ? ['مرحبًا BX Spa! أرغب في حجز جلسة سبا 🧖‍♀️']
          : ['مرحبًا BX Fitness Hub! أرغب في حجز تدريب 💪'];
        lines.push('الاسم: ' + name);
        lines.push('الهاتف: ' + (phone || '—'));
        lines.push('الخدمة: ' + (service || '—'));
        lines.push('الموعد المفضل: ' + (when || '—'));
        if (notes) lines.push('ملاحظات: ' + notes);
      } else {
        lines = isSpa
          ? ['Hello BX Spa! I would like to book a spa session 🧖‍♀️']
          : ['Hello BX Fitness Hub! I would like to book a training session 💪'];
        lines.push('Name: ' + name);
        lines.push('Phone: ' + (phone || '—'));
        lines.push('Service: ' + (service || '—'));
        lines.push('Preferred time: ' + (when || '—'));
        if (notes) lines.push('Notes: ' + notes);
      }

      var url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  });

  /* Year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();