// Глобальный звуковой движок (Web Audio API без внешних файлов)
window.bmSound = {
    enabled: localStorage.getItem("bm_sound") === "on",
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    },
    playType() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600 + Math.random() * 250, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
    },
    playGlitch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(42, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    },
    playError() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.setValueAtTime(165, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.32);
    }
};

// Глобальное управление социальным рейтингом
window.getGlobalRating = function() {
    const saved = localStorage.getItem("bm_rating");
    return saved !== null ? parseFloat(saved) : 4.2;
};

window.updateGlobalRating = function(newScore) {
    const clamped = Math.max(0.1, Math.min(5.0, parseFloat(newScore))).toFixed(1);
    localStorage.setItem("bm_rating", clamped);
    const badge = document.getElementById("globalRatingBadge");
    if (badge) {
        badge.textContent = `★ ${clamped}`;
    }
    if (parseFloat(clamped) < 2.5) {
        document.body.classList.add("outcast-mode");
    } else {
        document.body.classList.remove("outcast-mode");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const currentRating = window.getGlobalRating();
    if (currentRating < 2.5) {
        document.body.classList.add("outcast-mode");
    }

    // Проверка состояния эффекта ЭЛТ-монитора
    let crtEnabled = localStorage.getItem("bm_crt") !== "off";
    if (!crtEnabled) {
        document.body.classList.add("no-crt");
    }

    // 1. Автоматическая генерация меню + HUD
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

        const soundLabel = window.bmSound.enabled ? "SFX: ON" : "SFX: OFF";
        const soundClass = window.bmSound.enabled ? "sound-toggle active" : "sound-toggle";

        const crtLabel = crtEnabled ? "CRT: ON" : "CRT: OFF";
        const crtClass = crtEnabled ? "sound-toggle active" : "sound-toggle";

        navbarContainer.innerHTML = `
            <nav>
                <div class="nav-brand-group">
                    <a href="index.html" class="logo">Black Mirror // RU</a>
                    <div class="hud-controls">
                        <a href="simulator.html" class="rating-badge" id="globalRatingBadge" title="Ваш текущий социальный рейтинг">★ ${currentRating.toFixed(1)}</a>
                        <button type="button" class="${soundClass}" id="soundToggleBtn" title="Звуки интерфейса">${soundLabel}</button>
                        <button type="button" class="${crtClass}" id="crtToggleBtn" title="Эффект ЭЛТ-монитора">${crtLabel}</button>
                    </div>
                </div>
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

        // Переключатель звука
        const soundBtn = document.getElementById("soundToggleBtn");
        soundBtn.addEventListener("click", () => {
            window.bmSound.enabled = !window.bmSound.enabled;
            localStorage.setItem("bm_sound", window.bmSound.enabled ? "on" : "off");
            soundBtn.textContent = window.bmSound.enabled ? "SFX: ON" : "SFX: OFF";
            soundBtn.classList.toggle("active", window.bmSound.enabled);
            if (window.bmSound.enabled) {
                window.bmSound.playType();
            }
        });

        // Переключатель ЭЛТ-эффекта
        const crtBtn = document.getElementById("crtToggleBtn");
        crtBtn.addEventListener("click", () => {
            crtEnabled = !crtEnabled;
            localStorage.setItem("bm_crt", crtEnabled ? "on" : "off");
            document.body.classList.toggle("no-crt", !crtEnabled);
            crtBtn.textContent = crtEnabled ? "CRT: ON" : "CRT: OFF";
            crtBtn.classList.toggle("active", crtEnabled);
            if (window.bmSound.enabled) {
                window.bmSound.playType();
            }
        });

        // Бургер-меню для мобильных
        const burgerBtn = document.getElementById("burgerBtn");
        const navLinks = document.getElementById("navLinks");

        burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("open");
            navLinks.classList.toggle("open");
            document.body.classList.toggle("menu-open");
        });

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
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .card').forEach(el => {
        observer.observe(el);
    });

    // 3. Эффект печатной машинки со звуком
    function typeText(element) {
        const fullText = element.getAttribute('data-typewriter');
        element.textContent = '';
        element.classList.add('typewriter-cursor');
        
        let index = 0;
        const speed = 40;

        const interval = setInterval(() => {
            element.textContent += fullText.charAt(index);
            if (index % 2 === 0) window.bmSound.playType();
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
