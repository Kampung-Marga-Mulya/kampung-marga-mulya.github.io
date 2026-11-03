/* Dipisah dari rpjmk.html agar halaman bisa memakai Content Security Policy tanpa skrip sebaris. */
    (function () {
      var links = [].slice.call(document.querySelectorAll('.toc a'));
      var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
      function on() {
        var y = window.scrollY + 100, cur = 0;
        secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
        links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
      }
      window.addEventListener('scroll', on, { passive: true }); on();
      if (window.matchMedia('(max-width: 900px)').matches) { var d = document.querySelector('.toc details'); if (d) d.open = false; }
    })();
