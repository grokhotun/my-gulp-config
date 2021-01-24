const preloader = () => {
    const preloader = document.querySelector('.preloader');
    const preloaderBody = document.querySelector('.preloader__body');
    const body = document.querySelector('body'); 
    if (preloader) {
        body.classList.add('lock');
        new Promise((resolve) => {
            setTimeout(resolve, 800)
        })
        .then(() => {
            preloaderBody.style.display = 'none';
            preloader.classList.add('is-loaded');
            body.classList.remove('lock');
        });
    }
};

const smoothScroll = (duration) => {
    const linksNav = document.querySelectorAll('.js-smoothscroll-btn')
    linksNav.forEach( item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime){
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
        

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return - c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }, false);
    });
    
};