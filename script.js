document.addEventListener("DOMContentLoaded", () => {
    // Наблюдатель появления элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Запуск эффекта печатной машинки, если у блока есть атрибут data-typewriter
                if (entry.target.hasAttribute('data-typewriter') && !entry.target.dataset.typed) {
                    entry.target.dataset.typed = "true";
                    typeText(entry.target);
                }
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('.reveal, .card').forEach(el => {
        observer.observe(el);
    });

    // Функция постепенной печати текста
    function typeText(element) {
        const fullText = element.getAttribute('data-typewriter');
        element.textContent = '';
        element.classList.add('typewriter-cursor');
        
        let index = 0;
        const speed = 45; // скорость печати в миллисекундах

        const interval = setInterval(() => {
            element.textContent += fullText.charAt(index);
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    element.classList.remove('typewriter-cursor');
                }, 1500);
            }
        }, speed);
    }
});
