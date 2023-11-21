/**
 * Fade in an element.
 *
 * @param {Object} element - The element to fade in.
 */
export function fadeIn(element) {
    element.style.display = 'flex'; 
    requestAnimationFrame(() => {
        element.classList.add('active');
    });
}


/**
 * Fade out an element.
 *
 * @param {Object} element - The element to fade out.
 */
export function fadeOut(element) {
    element.classList.remove('active');
    element.addEventListener('transitionend', function handler() {
        element.style.display = 'none'; 
        element.removeEventListener('transitionend', handler);
    });
}