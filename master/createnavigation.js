export function createNavigation() {
    const main = document.querySelector('main');
    if (!main) return;
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <span>View More:</span>
        <a class="button btn-secondary" href="../individual/individual.html">Individual Costume Contest</a>
        <a class="button btn-secondary" href="../group-costumes/group.html">Group Costume Contest</a>
        <a class="button btn-secondary" href="../pumpkins/pumpkins.html">Pumpkin Contest</a>
    `;
    main.insertBefore(nav, main.firstChild);

    // Disable links matching current page.
    const currentPath = window.location.pathname;
    nav.querySelectorAll('a').forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath) {
        link.addEventListener('click', e => e.preventDefault());
        link.classList.add('active');
        }
    });
}