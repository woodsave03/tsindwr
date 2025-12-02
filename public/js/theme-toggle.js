(function () {
    const STORAGE_KEY = "sunder-color-scheme";
    const LIGHT = "default";
    const DARK = "slate";

    function getRoot() {
        return document.documentElement;
    }

    function applyScheme(scheme) {
        const root = getRoot();
        const normalized = scheme === DARK ? DARK : LIGHT;

        root.setAttribute("data-md-color-scheme", normalized);
        try {
            localStorage.setItem(STORAGE_KEY, normalized);
        } catch (_) {
            // Ignore
        }

        const toggle = document.querySelector(".sunder-theme-toggle");
        if (toggle) {
            toggle.dataset.scheme = normalized === DARK ? "dark" : "light";
        }
    }

    function readInitialScheme() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === LIGHT || stored === DARK) {
                return stored;
            }
        } catch (_) {
            // Ignore
        }
        const fromDom = getRoot().getAttribute("data-md-color-scheme") || LIGHT;
        return fromDom === DARK ? DARK : LIGHT;
    }

    function createToggle() {
        const headerOptions =
            document.querySelector(".md-header__options") ||
            document.querySelector(".md-header__inner");
        if (!headerOptions) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Toggle color theme");
        btn.setAttribute("title", "Toggle light / dark mode");

        btn.innerHTML = `
            <span class="sunder-theme-toggle-track">
                <span class="sunder-theme-toggle-icon sunder-theme-toggle-icon--sun">
                    <i class="fa-solid fa-sun"></i>
                </span>
                <span class="sunder-theme-toggle-icon sunder-theme-toggle-icon--moon">
                    <i class="fa-solid fa-moon"></i>
                </span>
                <span class="sunder-theme-toggle-knob"></span>
            </span>
        `;

        btn.addEventListener("click", () => {
            const currentScheme = getRoot().getAttribute("data-md-color-scheme");
            const next = currentScheme === DARK ? LIGHT : DARK;
            applyScheme(next);
        });

        // Put it at the end of the header options (right side of header)
        headerOptions.appendChild(btn);

        // Initialize visual state
        const initial = readInitialScheme();
        applyScheme(initial);
    }

    document.addEventListener("DOMContentLoaded", () => {
        createToggle();
    });
})();