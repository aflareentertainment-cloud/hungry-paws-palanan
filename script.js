const BOOKING_FORM_URL = "https://forms.gle/26qZEEqFuM4yJCnX7";

document.getElementById('year').textContent=new Date().getFullYear();const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));


document.querySelectorAll('.booking-link').forEach(link => {
  link.addEventListener('click', event => {
    if (BOOKING_FORM_URL === "PASTE_GOOGLE_FORM_LINK_HERE") {
      event.preventDefault();
      alert("Booking form is being connected. For now, please message The Hungry Paws Palanan team on Facebook.");
      window.open("https://www.facebook.com/THPPalananMakatiCity/", "_blank", "noopener");
      return;
    }
    event.preventDefault();
    window.open(BOOKING_FORM_URL, "_blank", "noopener");
  });
});
