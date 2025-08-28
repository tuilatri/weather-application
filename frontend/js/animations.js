// js/animations.js

function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.innerHTML = `${currentValue}<sup>${suffix}</sup>`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function applyAnimation(element) {
    if (!element) return;
    element.classList.remove('fade-in');
    // Dùng trick reflow để restart animation
    void element.offsetWidth; 
    element.classList.add('fade-in');
}