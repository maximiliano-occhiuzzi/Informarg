document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

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

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-menu-open');
        });
    }

    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });

    const detailCards = document.querySelectorAll('.detail-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, observerOptions);

    detailCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });

    const rule30Items = document.querySelectorAll('.rule30-item');
    rule30Items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });

    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    const savedChecks = JSON.parse(localStorage.getItem('firenovaChecklist') || '{}');
    checklistItems.forEach((checkbox, index) => {
        const checklistId = checkbox.closest('.checklist-items').id;
        const key = `${checklistId}-${index}`;
        if (savedChecks[key]) {
            checkbox.checked = true;
        }
    });

    checklistItems.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const checklistId = this.closest('.checklist-items').id;
            const key = `${checklistId}-${index}`;
            const savedChecks = JSON.parse(localStorage.getItem('firenovaChecklist') || '{}');

            if (this.checked) {
                savedChecks[key] = true;
            } else {
                delete savedChecks[key];
            }

            localStorage.setItem('firenovaChecklist', JSON.stringify(savedChecks));

            updateProgress();
        });
    });

    function updateProgress() {
        const allCheckboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const checkedBoxes = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
        const progress = (checkedBoxes.length / allCheckboxes.length) * 100;

        if (progress === 100) {
            showCompletionMessage();
        }
    }

    function showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 1rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            animation: slideIn 0.5s ease;
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">¡Excelente trabajo!</h3>
            <p>Has completado todas las verificaciones de prevención</p>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }

        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -40%);
            }
        }

        .mobile-menu-open {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1f2937;
            padding: 1rem 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);

    console.log('Firenova Consejos System initialized successfully!');
});
