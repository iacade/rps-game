(() => {
    function init(element) {
        const selector = element.dataset.loopFocus;
        const nextElement = document.querySelector(selector);

        if (!nextElement) {
            return;
        }

        element.addEventListener("keydown", (event) => {
            if (event.code === "Tab") {
                nextElement.focus();
                event.preventDefault();
            }
        });
    }

    document.querySelectorAll("[data-loop-focus]")
        .forEach(init);
})();
