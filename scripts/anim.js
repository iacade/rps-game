((global) => {
    function animation(element) {
        return new Promise(resolve => {
            element.onanimationend = () => {
                element.onanimationend = null;
                resolve(element);
            };
        });
    }

    function animations(...elements) {
        return Promise.all(elements.map(element => animation(element)));
    }

    function transition(element) {
        return new Promise(resolve => {
            element.ontransitionend = () => {
                element.ontransitionend = null;
                resolve(element);
            };
        });
    }

    function frame() {
        return new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)));
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    global.animation = animation;
    global.animations = animations;
    global.transition = transition;
    global.frame = frame;
    global.wait = wait;

})(window);
