// Yıl (eleman yoksa hata vermesin)
const yearEl = document.getElementById('y');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// WhatsApp linkleri (0542 110 55 65)
const waNumber = '905421105565';
const waText = encodeURIComponent('Merhaba Muhabbet Ocakbaşı, rezervasyon için yazıyorum.');
const waURL = `https://wa.me/${waNumber}?text=${waText}`;
const waFloat = document.getElementById('waFloat');
const waMain = document.getElementById('waMain');
if (waFloat) waFloat.href = waURL;
if (waMain) waMain.href = waURL;

// Rezervasyon formunu WhatsApp'a yönlendir
const rezForm = document.getElementById('rezForm');
if (rezForm) {
  rezForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const msg = `Merhaba, rezervasyon talebim var.%0A`
      + `Ad: ${fd.get('name')}%0A`
      + `Kişi: ${fd.get('people')}%0A`
      + `Tarih: ${fd.get('date')} Saat: ${fd.get('time')}%0A`
      + `Not: ${fd.get('note') || '-'}`;
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
  });
}

// Aktif nav link durumu (menu artık ayrı sayfa, listeden çıkarıldı)
const sections = ['home', 'about', 'reservation'];
// Sadece sayfa içi (#id) linkleri seç (menu.html linkini dahil etme)
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const opts = { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 };
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const id = entry.target.id;
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, opts);

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});
