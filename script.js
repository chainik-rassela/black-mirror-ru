document.addEventListener("DOMContentLoaded", () => {
    // 1. Автоматическая генерация единого меню
    const navbarContainer = document.getElementById("navbar");
    if (navbarContainer) {
        const menuItems = [
            { title: "Главная", url: "index.html" },
            { title: "По-русски", url: "russian-project.html" },
            { title: "Антиутопии", url: "about.html" },
            { title: "Технологии", url: "tech.html" },
            { title: "Цифровой след", url: "privacy.html" },
            { title: "Серии", url: "episodes.html" },
            { title: "Рейтинг", url: "simulator.html" },
            { title: "Об ИИ", url: "ai.html" }
        ];


        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        const linksHTML = menuItems.map(item => {
            const isActive = currentPage === item.url ? 'class="active"' : '';
            return `<a href="${item.url}" ${isActive}>${item.title}</a>`;
        }).join("");

        navbarContainer.innerHTML = `
            <nav>
                <a href="index.html" class="logo">Black Mirror // RU</a>
                <div class="nav-links" style="flex-wrap: wrap; justify-content: center;">
                    ${linksHTML}
                </div>
            </nav>
        `;
    }

    // 2. Плавное появление блоков при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.hasAttribute('data-typewriter') && !entry.target.dataset.typed) {
                    entry.target.dataset.typed = "true";
                    typeText(entry.target);
                }
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.reveal, .card').forEach(el => {
        observer.observe(el);
    });

    // 3. Эффект печатной машинки
    function typeText(element) {
        const fullText = element.getAttribute('data-typewriter');
        element.textContent = '';
        element.classList.add('typewriter-cursor');
        
        let index = 0;
        const speed = 45;

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
