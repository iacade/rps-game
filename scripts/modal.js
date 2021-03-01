((global) => {
    const container = document.getElementById("app") || document.body;

    function setModalState(modal, isEnabled = true, newTitle = "") {
        container.classList.toggle("modal-opened", isEnabled);
        modal.classList.toggle("opened", isEnabled);

        if (isEnabled && newTitle) {
            title.set(newTitle);
        }
        else if (!isEnabled) {
            title.pop();
        }
    }
    
    function init(element) {
        const selector = element.dataset.toggleModal || ".modal";
        const modal = document.querySelector(selector);

        if (!modal) {
            return;
        }

        const modalTitle = modal.dataset.modalTitle;

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

    global.modal = {
        toggle: modal => setModalState(modal, !modal.classList.contains("opened"), modal.dataset.modalTitle)
    };

})(window);
