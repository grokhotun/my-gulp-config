!!include('./partials/polyfills.js');
!!include('./partials/common.js');

const autoTyping = () => {

    const typeText = (text, elem, delay = 200) => new Promise((resolve) => {
        if (text.length > 0) {
            elem.classList.add('carret');
            elem.innerHTML += text[0];
            setTimeout(() => resolve(typeText(text.slice(1), elem, delay)), delay);
        } else {
            elem.classList.remove('carret');
            resolve();
        }	
    });

    const element = document.querySelector('.fullscreen__title');
    const leftButton = document.querySelector('.btn--left');
    const rightButton = document.querySelector('.btn--right');
    
    const targetPosition = {
        top: window.pageYOffset + element.getBoundingClientRect().top,
        left: window.pageYOffset + element.getBoundingClientRect().left,
        right: window.pageYOffset + element.getBoundingClientRect().right,
        bottom: window.pageYOffset + element.getBoundingClientRect().bottom,
    },
    windowPosition = {
        top: window.pageYOffset,
        left: window.pageXOffset,
        right: window.pageXOffset + document.documentElement.clientWidth,
        bottom: window.pageYOffset + document.documentElement.clientHeight,
    };

    if (targetPosition.bottom >= windowPosition.top) {

        const elem_1 = document.querySelector('.fullscreen__title');
        const text_1 = elem_1.innerHTML;
        const elem_2 = document.querySelector('.fullscreen__subtitle');
        const text_2 = elem_2.innerHTML;
        elem_1.innerHTML = '';
        elem_2.innerHTML = '';
        
        setTimeout(() => {
            typeText(text_1, elem_1, 100)
                .then(() => typeText(text_2, elem_2, 50))
                .then(() => {
                    leftButton.classList.add('slide-from-left');
                    rightButton.classList.add('slide-from-right');
                });
        }, 1500);
    } else {
        leftButton.classList.add('slide-from-left');
        rightButton.classList.add('slide-from-right');
    }
};

document.addEventListener("DOMContentLoaded", () => {	
    preloader();
	autoTyping();
    smoothScroll(1000);
});