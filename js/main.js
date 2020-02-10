function observeScrollAnimations() {
    let observer = new IntersectionObserver((enteries) => {
        enteries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInRight 1.2s cubic-bezier(0.85, 0.37, 0.25, 0.95) both'
                observer.unobserve(entry.target);
            }
        })
    }, { root: null })
    document.querySelectorAll('.scroll_anim').forEach(element => {
        observer.observe(element)
    })
}


window.onload = function () {
    lax.setup() // init

    const updateLax = () => {
        lax.update(window.scrollY)
        window.requestAnimationFrame(updateLax)
    }

    window.requestAnimationFrame(updateLax)
    observeScrollAnimations()
}