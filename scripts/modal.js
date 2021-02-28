(() => {
    const container = document.getElementById("app") || document.body;
    const titles = [];

    function setModalState(modal, isEnabled = true, newTitle = "") {
        container.classList.toggle("modal-opened", isEnabled);
        modal.classList.toggle("opened", isEnabled);

        if (newTitle && isEnabled) {
            titles.push(document.title);
            document.title = newTitle;
        }
        else if (!isEnabled && titles.length) {
            document.title = titles.pop();
        }
    }
    
    function init(element) {
        const selector = element.dataset.toggleModal || ".modal";
        const modal = document.querySelector(selector);

        if (!modal) {
            return;
        }

        const modalTitle = element.dataset.modalTitle;

        element.addEventListener("click", (event) => {
            event.stopPropagation();
            setModalState(modal, !modal.classList.contains("opened"), modalTitle);
        }, true);
    }

    document.documentElement.addEventListener("click", (event) => {
        const modal = event.target.closest(".modal__content");

        if (!modal) {
            document.querySelectorAll(".modal.opened")
                .forEach(modal => setModalState(modal, false));
        }
    });

    document.documentElement.addEventListener("keydown", (event) => {
        if (event.code === "Escape") {
            document.querySelectorAll(".modal.opened")
                .forEach(modal => setModalState(modal, false));
        }
    });

    document.querySelectorAll("[data-toggle-modal]")
        .forEach(init);
})();
