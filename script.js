// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animar los elementos del menú
            if (navMenu.classList.contains('active')) {
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach((link, index) => {
                    link.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
                });
            }
        });
    }
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Toggle del tema
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
    const animatedCounters = new Set();
    
    const animateCounter = (counter) => {
        if (animatedCounters.has(counter)) return;
        
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / 200;
        const speed = target > 100 ? 1 : 2;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), speed);
        } else {
            counter.innerText = target;
            animatedCounters.add(counter);
            
            // Agregar efecto de celebración para números grandes
            if (target >= 50) {
                counter.style.color = '#58a6ff';
                setTimeout(() => {
                    counter.style.color = '';
                }, 1000);
            }
        }
    };
    
    // Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Contadores
                if (entry.target.classList.contains('stat-card')) {
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter) setTimeout(() => animateCounter(counter), 300);
                }
                
                // Barras de habilidades
                if (entry.target.classList.contains('skill-card')) {
                    const levelBar = entry.target.querySelector('.level-bar');
                    if (levelBar) {
                        const width = levelBar.style.width;
                        levelBar.style.width = '0';
                        setTimeout(() => {
                            levelBar.style.width = width;
                            levelBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        }, 300);
                    }
                }
                
                // Fade-in general
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);
    
    // Observar elementos
    document.querySelectorAll('.stat-card, .skill-card, .project-card, .process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
    
    // Tabs de habilidades
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Remover clase active de todos los tabs y contenidos
            categoryTabs.forEach(t => t.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // Agregar clase active al tab clickeado y su contenido
            tab.classList.add('active');
            document.getElementById(category).classList.add('active');
            
            // Efecto visual
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 150);
        });
    });
    
    // Filtro de proyectos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar proyectos
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Efecto visual
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'Este campo es requerido');
                } else {
                    clearError(input);
                }
            });
            
            // Validar email
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    showError(emailInput, 'Email inválido');
                }
            }
            
            if (isValid) {
                // Mostrar loading
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                const originalWidth = submitBtn.offsetWidth;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.style.width = `${originalWidth}px`;
                submitBtn.disabled = true;
                
                // Simular envío (en producción esto sería una petición AJAX)
                setTimeout(() => {
                    // Mostrar éxito
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
                    submitBtn.style.backgroundColor = 'var(--github-green)';
                    
                    // Resetear después de 3 segundos
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.width = '';
                        submitBtn.disabled = false;
                        
                        // Mostrar notificación
                        showNotification('Mensaje enviado exitosamente. Te responderé pronto.', 'success');
                    }, 3000);
                }, 1500);
            } else {
                showNotification('Por favor completa todos los campos requeridos correctamente.', 'error');
            }
        });
        
        // Validación en tiempo real
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    showError(this, 'Este campo es requerido');
                } else if (this.type === 'email' && this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value.trim())) {
                        showError(this, 'Email inválido');
                    } else {
                        clearError(this);
                    }
                } else {
                    clearError(this);
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearError(this);
                }
            });
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
                // Cerrar menú móvil si está abierto
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to top button
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
        box-shadow: var(--shadow-md);
    `;
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.backgroundColor = 'var(--github-accent)';
        scrollTopBtn.style.color = 'white';
        scrollTopBtn.style.transform = 'translateY(-3px)';
        scrollTopBtn.style.boxShadow = 'var(--shadow-lg)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.backgroundColor = 'var(--github-header)';
        scrollTopBtn.style.color = 'var(--github-text)';
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = 'var(--shadow-md)';
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
            scrollTopBtn.style.animation = 'fadeIn 0.3s ease';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Efecto de parallax en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < 500) {
            const rate = scrolled * -0.3;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Animación de typing en el código
    const codeElement = document.querySelector('.code-content code');
    if (codeElement) {
        const originalCode = codeElement.innerHTML;
        codeElement.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalCode.length) {
                codeElement.innerHTML += originalCode.charAt(i);
                i++;
                setTimeout(typeWriter, 10);
            }
        };
        
        // Iniciar typing cuando sea visible
        const codeObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(typeWriter, 500);
                codeObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        
        codeObserver.observe(codeElement);
    }
    
    // Tooltips
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('title');
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            
            element.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', () => {
            if (element.tooltip) {
                element.tooltip.remove();
                element.tooltip = null;
            }
        });
    });
    
    // Funciones auxiliares
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
        document.documentElement.style.setProperty('--github-orange', '#bc4c00');
        
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
    
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
        document.documentElement.style.setProperty('--github-orange', '#f78166');
        
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    
    function showError(input, message) {
        clearError(input);
        
        input.classList.add('error');
        input.style.borderColor = 'var(--github-red)';
        
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = `
            color: var(--github-red);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(error);
    }
    
    function clearError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const error = input.parentNode.querySelector('.error-message');
        if (error) error.remove();
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            background: ${type === 'success' ? 'var(--github-green)' : 'var(--github-red)'};
            color: white;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: var(--shadow-lg);
            max-width: 400px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .tooltip {
            position: fixed;
            background: var(--github-header);
            border: 1px solid var(--github-border);
            color: var(--github-text);
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 9999;
            pointer-events: none;
            box-shadow: var(--shadow-md);
        }
        
        .tooltip::before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid var(--github-border);
        }
    `;
    document.head.appendChild(style);
    
    // Cargar proyectos dinámicamente (ejemplo)
    console.log('Portafolio de KungFuPalta cargado');
    console.log('Tecnologías: Python, MySQL, HTML5, CSS3, JavaScript, WordPress, Photoshop, Illustrator, Canva, CapCut');
    console.log('Contacto: kungfupaltazz@gmail.com');
    console.log('GitHub: https://github.com/kungfupalta');
});