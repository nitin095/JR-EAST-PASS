let isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
let bannerInterval;

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
    if (document.getElementById('banner')) {
        bannerInterval = setInterval(() => {
            bannerNext()
        }, 5000);
    }
    if (isMobile) {
        var bannerElement = document.getElementById('banner');
        if (bannerElement) {
            swipedetect(bannerElement, function (swipedir) {
                // swipedir contains either "none", "left", "right", "top", or "down"
                if (swipedir == 'left') bannerNext();
                if (swipedir == 'right') bannerPrevious();
                let dots = document.querySelectorAll('#dots > .dot');
                dots.forEach(dot => {
                    dot.classList.remove('active')
                });
                dots[activeBanner].classList.add('active');
            });
        }
    }
    setTimeout(() => {
        document.querySelectorAll('.lazy_banner').forEach(banner => {
            banner.src = banner.dataset.src
        })
    }, 1000);
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
    });
    window.onscroll = function () {
        if (window.scrollY > 0) {
            this.document.getElementById('floatingBuyBtn').style.display = 'block'
        }
    }
}

function swipedetect(el, callback) {

    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 50, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) { }

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        // e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        // e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        // e.preventDefault()
    }, false)
}

let banners = document.querySelectorAll('#bannerBox>.banner')
let activeBanner = 0;

let bannerNext = () => {
    clearInterval(bannerInterval);
    let nextBannerIndex = activeBanner < banners.length - 1 ? activeBanner + 1 : 0;
    let nextBanner = banners[nextBannerIndex]
    banners[activeBanner].style.animation = "bannerSlideOutLeft 1.2s cubic-bezier(.18,.98,.7,.98) forwards";
    nextBanner.classList.remove('hidden');
    nextBanner.style.animation = "bannerSlideInRight 1s cubic-bezier(.18,.98,.7,.98) forwards";
    activeBanner = nextBannerIndex;
    bannerInterval = setInterval(() => {
        bannerNext()
    }, 6000);
}

let bannerPrevious = () => {
    clearInterval(bannerInterval);
    banners[activeBanner].style.animation = "bannerSlideOutRight 1.2s cubic-bezier(.18,.98,.7,.98) forwards";
    let nextBannerIndex = activeBanner > 0 ? activeBanner - 1 : banners.length - 1;
    let nextBanner = banners[nextBannerIndex]
    nextBanner.classList.remove('hidden');
    nextBanner.style.animation = "bannerSlideInLeft 1s cubic-bezier(.18,.98,.7,.98) forwards";
    activeBanner = nextBannerIndex;
    bannerInterval = setInterval(() => {
        bannerNext()
    }, 6000);
}

function magnify(imgID, zoom=1.5) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    if (!img.parentElement.querySelector('.img-magnifier-glass')) {
        glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
        img.parentElement.insertBefore(glass, img);
    } else {
        glass = img.parentElement.querySelector('.img-magnifier-glass');
    }
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
        var pos, x, y;
        e.preventDefault();
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
        if (x < w / zoom) { x = w / zoom; }
        if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
        if (y < h / zoom) { y = h / zoom; }
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}

function removeLense() {
    document.querySelectorAll(`.img-magnifier-glass`).forEach(l => l.remove());
}