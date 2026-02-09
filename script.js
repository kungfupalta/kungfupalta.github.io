// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Toggle del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Toggle del tema claro/oscuro
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferencia del usuario
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'light') {
        setLightTheme();
    }
    
    themeToggle.addEventListener('click', () => {
        if (themeIcon.classList.contains('fa-moon')) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    });
    
    // Animación de contadores
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    };
    
    // Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
                
                // Animación de barras de habilidades
                if (entry.target.classList.contains('skill-level')) {
                    entry.target.style.width = entry.target.style.width;
                }
                
                // Animación de fade-in
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.about-stats, .skill-level, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación simple
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--github-red)';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Aquí normalmente enviarías el formulario a un servidor
                // Por ahora solo mostramos un mensaje de éxito
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Mensaje enviado ✓';
                submitBtn.style.backgroundColor = 'var(--github-green)';
                submitBtn.disabled = true;
                
                // Resetear después de 3 segundos
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de parallax en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Mostrar/ocultar botón de scroll to top
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-top';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background-color: var(--github-header);
        border: 1px solid var(--github-border);
        color: var(--github-text);
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        z-index: 1000;
        transition: all var(--transition-fast);
    `;
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.backgroundColor = 'var(--github-accent)';
        scrollTopBtn.style.color = 'white';
        scrollTopBtn.style.transform = 'translateY(-3px)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.backgroundColor = 'var(--github-header)';
        scrollTopBtn.style.color = 'var(--github-text)';
        scrollTopBtn.style.transform = 'translateY(0)';
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Función para establecer tema claro
    function setLightTheme() {
        document.documentElement.style.setProperty('--github-bg', '#ffffff');
        document.documentElement.style.setProperty('--github-header', '#f6f8fa');
        document.documentElement.style.setProperty('--github-border', '#d0d7de');
        document.documentElement.style.setProperty('--github-text', '#1f2328');
        document.documentElement.style.setProperty('--github-text-secondary', '#656d76');
        document.documentElement.style.setProperty('--github-accent', '#0969da');
        document.documentElement.style.setProperty('--github-green', '#1a7f37');
        document.documentElement.style.setProperty('--github-red', '#d1242f');
        document.documentElement.style.setProperty('--github-purple', '#8250df');
        document.documentElement.style.setProperty('--github-yellow', '#bf8700');
        
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
    
    // Función para establecer tema oscuro
    function setDarkTheme() {
        document.documentElement.style.setProperty('--github-bg', '#0d1117');
        document.documentElement.style.setProperty('--github-header', '#161b22');
        document.documentElement.style.setProperty('--github-border', '#30363d');
        document.documentElement.style.setProperty('--github-text', '#c9d1d9');
        document.documentElement.style.setProperty('--github-text-secondary', '#8b949e');
        document.documentElement.style.setProperty('--github-accent', '#58a6ff');
        document.documentElement.style.setProperty('--github-green', '#238636');
        document.documentElement.style.setProperty('--github-red', '#f85149');
        document.documentElement.style.setProperty('--github-purple', '#8957e5');
        document.documentElement.style.setProperty('--github-yellow', '#e3b341');
        
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    
    // Tooltips para iconos de redes
    document.querySelectorAll('.footer-social a').forEach(link => {
        const platform = link.getAttribute('aria-label');
        link.title = platform;
    });
    
    // Cargar proyectos dinámicamente desde GitHub (ejemplo)
    // En un caso real, usarías la API de GitHub
    console.log('Portafolio cargado. Visita https://github.com/kungfupalta para más proyectos.');
});