// js/modules/navbar.js
export function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbar-toggle');
    let lastScrollY = window.scrollY;

    // Ocultar/mostrar al hacer scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
    });

    // Menú móvil (toggle)
    if (toggle) {
        toggle.addEventListener('click', () => {
            const menu = document.querySelector('.navbar-menu');
            menu.classList.toggle('active');
        });
    }

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}