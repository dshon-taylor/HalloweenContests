export function titleCase() {
    const applyTitleCase = () => {
        const allEntryDetails = document.querySelectorAll('.entry-details');
        allEntryDetails.forEach(entry => {
            const details = entry.getElementsByTagName('p');
            Array.from(details).forEach(detail => {
                if (detail.textContent) {
                    detail.textContent = detail.textContent.toLowerCase();
                    detail.textContent = detail.textContent.replace(/\b\w/g, char => char.toUpperCase());
                }
            });
        });
    };

    // Apply title case initially
    applyTitleCase();

    // Observe DOM changes for dynamically added `.entry-details`
    const observer = new MutationObserver(() => {
        applyTitleCase();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}