const bookData = [
    {
        left: {
            date: '26 de marzo de 2025',
            title: 'Presentación del Proyecto',
            icon: 'fa-users',
            description: 'Los profesores nos estuvieron hablando sobre la feria, nos comentaron cómo era, qué más o menos necesitamos, también cómo les fue al anterior curso y cómo ellos lo hicieron. Nos dejaron ver sus proyectos y poder tener una idea de cómo poder hacer los nuestros, eso nos ayudó mucho.'
        },
        right: {
            date: '3 de abril de 2025',
            title: 'Formación del Equipo',
            icon: 'fa-user-friends',
            description: 'Nos reunimos un rato en la hora libre para conversar y compartir ideas en base a la problemática que venimos desarrollando. Después de que los profesores nos propusieran ir y presentar un proyecto a la feria, empezamos armando nuestro grupo.'
        }
    },
    {
        left: {
            date: '10 de abril de 2025',
            title: 'Definición de la Problemática',
            icon: 'fa-lightbulb',
            description: 'Día importante, hoy nos enfocamos mucho en la determinación de lo que estábamos por hacer. Finalmente definimos la problemática ambiental en la que decidimos trabajar: los incendios forestales y su impacto en el ecosistema.'
        },
        right: {
            date: '23 de abril de 2025',
            title: 'Inicio del Desarrollo',
            icon: 'fa-laptop-code',
            description: 'Un buen día para el equipo. Empezamos a trabajar ya enfocadamente en las tareas destinadas de cada uno. En este momento se está creando una bitácora digital donde va a estar siendo proyectado todo este proceso increíble.'
        }
    },
    {
        left: {
            date: '1 de mayo de 2025',
            title: 'Diseño del Sistema',
            icon: 'fa-drafting-compass',
            description: 'Comenzamos a diseñar la arquitectura del sistema Firenova. Definimos los componentes principales: sensores ambientales, base de datos, plataforma web y aplicación móvil. Cada miembro del equipo tomó responsabilidad de áreas específicas.'
        },
        right: {
            date: '8 de mayo de 2025',
            title: 'Desarrollo de Hardware',
            icon: 'fa-microchip',
            description: 'Iniciamos el desarrollo del hardware con los sensores de temperatura, humedad, gases y velocidad del viento. Las primeras pruebas mostraron resultados prometedores en la captura de datos ambientales en tiempo real.'
        }
    },
    {
        left: {
            date: '14 de mayo de 2025',
            title: 'Programación de Sensores',
            icon: 'fa-code',
            description: 'Trabajamos en la programación de los sensores para que puedan comunicarse con la base de datos. Implementamos protocolos de comunicación Wi-Fi para transmisión de datos en tiempo real hacia el servidor.'
        },
        right: {
            date: '22 de mayo de 2025',
            title: 'Base de Datos',
            icon: 'fa-database',
            description: 'Configuramos la base de datos remota para almacenar toda la información recopilada por los sensores. Diseñamos las tablas y relaciones necesarias para un análisis eficiente de los datos ambientales.'
        }
    },
    {
        left: {
            date: '28 de mayo de 2025',
            title: 'Primeras Pruebas',
            icon: 'fa-flask',
            description: 'Realizamos las primeras pruebas de campo con el prototipo. Los sensores capturaron datos exitosamente y los transmitieron a la base de datos. Identificamos áreas de mejora en la precisión de las mediciones.'
        },
        right: {
            date: '4 de junio de 2025',
            title: 'Desarrollo Web',
            icon: 'fa-globe',
            description: 'Comenzamos el desarrollo de la plataforma web. Creamos la interfaz para visualizar los datos en un mapa de Argentina, mostrando en tiempo real las condiciones ambientales de cada sensor instalado.'
        }
    },
    {
        left: {
            date: '5 de junio de 2025',
            title: 'Diseño de Interfaz',
            icon: 'fa-paint-brush',
            description: 'Trabajamos en el diseño UX/UI de la aplicación móvil y la web. Creamos una experiencia de usuario intuitiva con colores que representan niveles de alerta: verde para seguro, amarillo para precaución, rojo para peligro.'
        },
        right: {
            date: '11 de junio de 2025',
            title: 'Sistema de Alertas',
            icon: 'fa-bell',
            description: 'Implementamos el sistema de alertas tempranas que notifica automáticamente cuando las condiciones ambientales alcanzan niveles de riesgo. Las alertas se envían por email y notificaciones push en la app móvil.'
        }
    },
    {
        left: {
            date: '18 de junio de 2025',
            title: 'Optimización y Pruebas',
            icon: 'fa-tools',
            description: 'Realizamos pruebas exhaustivas del sistema completo. Optimizamos el rendimiento, mejoramos la precisión de los sensores y ajustamos los algoritmos de detección de riesgo de incendios.'
        },
        right: {
            date: 'Actualidad',
            title: 'Preparación Final',
            icon: 'fa-flag-checkered',
            description: 'Estamos en la etapa final de preparación para presentar Firenova en la feria. El sistema está funcional y listo para demostrar cómo la tecnología puede prevenir incendios forestales antes de que comiencen.'
        }
    }
];

let currentPage = 0;
const totalPages = bookData.length;

const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const scrollToTopBtn = document.getElementById('scrollToTop');

totalPagesEl.textContent = totalPages;

function createEntryHTML(data, side) {
    return `
        <div class="page-content">
            <div class="process-entry">
                <div class="entry-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${data.date}</span>
                </div>
                <div class="entry-content">
                    <h3>${data.title}</h3>
                    <div class="entry-image">
                        <i class="fas ${data.icon}"></i>
                    </div>
                    <p>${data.description}</p>
                </div>
            </div>
        </div>
    `;
}

function updateBook() {
    const data = bookData[currentPage];

    leftPage.classList.add('fade-out');
    rightPage.classList.add('fade-out');

    setTimeout(() => {
        leftPage.innerHTML = createEntryHTML(data.left, 'left');
        rightPage.innerHTML = createEntryHTML(data.right, 'right');

        leftPage.classList.remove('fade-out');
        rightPage.classList.remove('fade-out');
    }, 300);

    currentPageEl.textContent = currentPage + 1;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;

    updateTimelineHighlight();
}

function updateTimelineHighlight() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (index === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateBook();
        playPageTurnSound();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateBook();
        playPageTurnSound();
    }
});

function playPageTurnSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZSA0PV6vo86xZGAhDme/rvnIgBDWM0/PXgjQGH23A7+OaTAkPWK3o86xZGQhDmO/qvnEgBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8gBDWM0/PXgjQGH23A7+OaTAkOWK3o86tZGQhDmO/qvm8g=');
    audio.volume = 0.1;
    audio.play().catch(() => {});
}

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentPage = index;
        updateBook();
        playPageTurnSound();

        document.querySelector('.book-section').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
    }
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage--;
        updateBook();
        playPageTurnSound();
    } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        currentPage++;
        updateBook();
        playPageTurnSound();
    }
});

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const elementsToFade = document.querySelectorAll('.about-text, .about-logo, .timeline-item');
elementsToFade.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});

updateBook();

console.log('Bitácora Firenova cargada correctamente 📖🔥');
