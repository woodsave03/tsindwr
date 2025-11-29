document.addEventListener("DOMContentLoaded", () => {
    const version = window.SUNDER_VERSION;
    if (!version) return;

    const titleElement = document.querySelector(".md-header__topic");
    if (!titleElement) return;

    if (titleElement.querySelector(".sunder-version")) return;

    const span = document.createElement("span");
    span.className = "sunder-version";
    span.textContent = `v${version}`;

    titleElement.appendChild(span);
});