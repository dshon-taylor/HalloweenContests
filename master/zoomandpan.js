export function initZoomAndPan() {
    const zoomedImg = document.querySelector("#zoomed-photo img");
    if (!zoomedImg) return;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let wheelTimeout = null;

    zoomedImg.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
        let newScale = scale + zoomDelta;
        if (newScale < 1) newScale = 1;
        if (newScale > 3.5) {
        zoomedImg.style.cursor = 'grab';
        return;
        }
        
        if (zoomDelta > 0) {
        const rect = zoomedImg.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const originX = ((offsetX / rect.width) * 100).toFixed(2) + '%';
        const originY = ((offsetY / rect.height) * 100).toFixed(2) + '%';
        zoomedImg.style.transformOrigin = `${originX} ${originY}`;
        } else {
        if (scale > 1) {
            const dampingFactor = newScale / scale;
            translateX *= dampingFactor;
            translateY *= dampingFactor;
        }
        if (newScale === 1) {
            translateX = 0;
            translateY = 0;
        }
        }

        scale = newScale;
        updateTransform();

        zoomedImg.style.cursor = zoomDelta > 0 ? 'zoom-in' : 'zoom-out';

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
        zoomedImg.style.cursor = (scale === 1) ? 'default' : 'grab';
        }, 150);
    });

    zoomedImg.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        zoomedImg.setPointerCapture(e.pointerId);
        zoomedImg.style.cursor = 'grabbing';
    });

    zoomedImg.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const newTranslateX = e.clientX - startX;
        const newTranslateY = e.clientY - startY;
        const maxTranslateX = ((zoomedImg.clientWidth * scale) - zoomedImg.clientWidth) / 2;
        const maxTranslateY = ((zoomedImg.clientHeight * scale) - zoomedImg.clientHeight) / 2;
        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, newTranslateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, newTranslateY));
        updateTransform();
    });

    zoomedImg.addEventListener("pointerup", (e) => {
        isDragging = false;
        zoomedImg.style.cursor = (scale === 1) ? 'default' : 'grab';
        zoomedImg.releasePointerCapture(e.pointerId);
    });

    function updateTransform() {
        zoomedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
        document.getElementById("zoomed-photo").style.display = "none";
        zoomedImg.src = "";
    }

    const closeZoomIcon = document.getElementById("close-zoom-icon");
    if (closeZoomIcon) {
        closeZoomIcon.addEventListener("click", resetZoom);
    }
}