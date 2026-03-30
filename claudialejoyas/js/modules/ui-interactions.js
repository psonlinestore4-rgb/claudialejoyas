export function initUI(camera, model) {
    // Navbar ocultar al hacer scroll
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;

        // Aquí puedes agregar efectos de scroll relacionados con la cámara (como el about.js)
        // Por ejemplo, mover la cámara según el scroll
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = Math.min(currentScrollY / maxScroll, 1);
        if (camera) {
            // Efecto sutil de acercamiento (opcional)
            camera.position.z = 4 - scrollFraction * 1.5; // de 4 a 2.5
            camera.lookAt(0, 0, 0);
        }
    });

    // Menú móvil toggle
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}