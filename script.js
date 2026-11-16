document.addEventListener("DOMContentLoaded", () => {
    // 1. Автоматическая генерация единого адаптивного меню
    const navbarContainer = document.getElementById("navbar");
    if (navbarContainer) {
        const menuItems = [
            { title: "Главная", url: "index.html" },
            { title: "По-русски", url: "russian-project.html" },
            { title: "Антиутопии", url: "about.html" },
            { title: "Технологии", url: "tech.html" },
            { title: "Цифровой след", url: "privacy.html" },
            { title: "Серии", url: "episodes.html" },
            { title: "Пасхалки", url: "easter-eggs.html" },
            { title: "Терминал", url: "terminal.html" },
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
                <button class="burger-btn" id="burgerBtn" aria-label="Открыть меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-links" id="navLinks">
                    ${linksHTML}
                </div>
            </nav>
        `;

        // Логика открытия/закрытия мобильного меню
        const burgerBtn = document.getElementById("burgerBtn");
        const navLinks = document.getElementById("navLinks");

        burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("open");
            navLinks.classList.toggle("open");
            document.body.classList.toggle("menu-open");
        });

        // Закрывать меню при клике на любую ссылку
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                burgerBtn.classList.remove("open");
                navLinks.classList.remove("open");
                document.body.classList.remove("menu-open");
            });
        });
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
    }, { threshold: 0.15 }); // Снизили порог для маленьких экранов телефонов

    document.querySelectorAll('.reveal, .card').forEach(el => {
        observer.observe(el);
    });

    // 3. Эффект печатной машинки
    function typeText(element) {
        const fullText = element.getAttribute('data-typewriter');
        element.textContent = '';
        element.classList.add('typewriter-cursor');
        
        let index = 0;
        const speed = 40;

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
