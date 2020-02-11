function observeScrollAnimations() {
    let observer = new IntersectionObserver((enteries) => {
        enteries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `${entry.target.dataset.anim || 'slideInRight'} 1.2s ${entry.target.dataset.delay || '0s'} ${entry.target.dataset.ease || 'cubic-bezier(0.85, 0.37, 0.25, 0.95)'} both`
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

    document.querySelectorAll('#tabs .tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('#tabs .tab_content').forEach(function (tabContent) {
                tabContent.style.display = 'none';
            })
            document.querySelectorAll('#tabs .tab').forEach(function (t) {
                t.classList.remove('active')
            })
            this.classList.add('active')
            document.getElementById(`${this.dataset.target}`).style.display = 'block';
            updateLax()
        })
    })

}