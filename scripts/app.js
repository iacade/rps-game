((global) => {
    const RESULT_TEXTS = {
        WIN: "YOU WIN",
        LOSE: "YOU LOSE",
        TIE: "TIE"
    };
    const HOUSE_STEP_TIMEOUT = 800;

    const container = document.querySelector(".game__container");
    const pentagon = document.querySelector(".pentagon");
    const versus = document.querySelector(".versus");
    const [ versusUser, versusHouse ] = versus.querySelectorAll(".versus__item");

    function cloneButton(name) {
        const button = pentagon.querySelector(`button[value="${ name }"]`);
        const clone = button.cloneNode(true);

        clone.disabled = true;
        clone.style.position = "relative";
        clone.style.left = 0;
        clone.style.top = 0;
        clone.classList.add("fade-in");

        return clone;
    }

    function updateScore(addToScore) {
        if (!addToScore || state.score + addToScore < 0) {
            return;
        }

        state.score += addToScore;

        const scoreItem = document.querySelector(".score-val");
        const newScoreItem = document.createElement("span");
        const { left, top } = scoreItem.getBoundingClientRect();

        newScoreItem.textContent = state.score;
        newScoreItem.classList.add("score-val", addToScore < 0 ? "from-left" : "from-right");
        scoreItem.style.position = "absolute";
        scoreItem.style.left = left + "px";
        scoreItem.style.top = top + "px";
        scoreItem.style.zIndex = 2;
        scoreItem.classList.add(addToScore < 0 ? "to-right" : "to-left");

        scoreItem.parentNode.appendChild(newScoreItem);
        document.body.appendChild(scoreItem);

        animation(scoreItem)
            .then(() => scoreItem.parentNode.removeChild(scoreItem));
        animation(newScoreItem)
            .then(() => newScoreItem.classList.remove("from-left", "from-right"));
    }

    function restart() {
        if (state.step !== APP_STEPS.GAME_FINISH) {
            return;
        }

        const { left, top, width } = versus.getBoundingClientRect();

        pentagon.classList.add("fade-in");
        versus.parentNode.appendChild(pentagon);
        versus.style.position = "absolute";
        versus.style.left = left + "px";
        versus.style.top = top + "px";
        versus.style.width = width + "px";
        versus.classList.add("fade-out");
        title.pop();

        animations(pentagon, versus).then(() => {
            versus.style.position = "relative";
            versus.style.left = 0;
            versus.style.top = 0;
            versus.style.width = "auto";
            versus.classList.remove("fade-out");
            versus.classList.add("hidden");
            versus.querySelectorAll(".pentagon__item-mask, .versus__item-picker .pentagon__item")
                .forEach(node => node.parentNode.removeChild(node));
            versus.querySelector(".loader")
                .classList.remove("hidden");
            versus.classList.remove("has-result");
            pentagon.classList.remove("fade-in");
        });

        state.next();
    }

    function chooseValue(button) {
        if (state.step !== APP_STEPS.USER_CHOOSE) {
            return;
        }

        const { left, top } = button.getBoundingClientRect();
        const clone = button.cloneNode(true);

        clone.disabled = true;
        clone.style.left = left + "px";
        clone.style.top = top + "px";
        clone.style.transition = "800ms";

        button.blur();
        button.classList.add("d-none");
        container.appendChild(clone);
        pentagon.classList.add("fade-out");
        versus.classList.remove("hidden");

        frame().then(() => {
            const { left, top } = versusUser
                .querySelector(".versus__item-picker")
                .getBoundingClientRect();
            clone.style.left = left + "px";
            clone.style.top = top + "px";
            clone.style.transformOrigin = "top left";
            clone.classList.add("clone");

            title.prepend("Waiting for house | ");

            return transition(clone);
        })
        .then(() => {
            versusUser.querySelector(".versus__item-picker")
                .appendChild(clone);
            clone.style.transformOrigin = "center";
            clone.style.position = "relative";
            clone.style.left = 0;
            clone.style.top = 0;

            return wait(HOUSE_STEP_TIMEOUT);
        })
        .then(() => {
            const userButton = versusUser.querySelector("button[value]");
            const userValue = userButton.value;
            const houseValue = game.generate();
            const loader = versusHouse.querySelector(".loader");
            const houseButton = cloneButton(houseValue);

            versusHouse.querySelector(".versus__item-picker")
                .appendChild(houseButton);
            loader.classList.add("hidden");

            state.next();

            const winner = game.compare(userValue, houseValue);
            const resultText = winner < 0
                ? RESULT_TEXTS.WIN
                : winner > 0
                ? RESULT_TEXTS.LOSE
                : RESULT_TEXTS.TIE;
            let winnerButton = null;
            let winnerValue = null;

            if (winner < 0) {
                winnerButton = versusUser.querySelector(".versus__item-picker");
                winnerValue = userValue;
            }
            else if (winner > 0) {
                winnerButton = versusHouse.querySelector(".versus__item-picker");
                winnerValue = houseValue;
            }

            if (winnerButton) {
                const mask = document.createElement("div");
                
                mask.classList.add("pentagon__item-mask");
                mask.setAttribute("data-value", winnerValue);
                winnerButton.prepend(mask);
            }

            title.pop().prepend(resultText + " | ");

            versus.querySelectorAll("[data-result-text]")
                .forEach(item => item.textContent = resultText);
            versus.classList.add("has-result");
            updateScore(winner * -1);
        });

        animation(pentagon).then(() => {
            pentagon.classList.remove("fade-out");
            pentagon.parentNode.removeChild(pentagon);
            button.classList.remove("d-none");
        });

        state.next();
    }

    pentagon.addEventListener("click", (event) => {
        const button = event.target.closest("button[value]");

        if (button) {
            chooseValue(button);
        }
    });

    document.querySelectorAll("[data-restart]")
        .forEach(button => button.addEventListener("click", restart));

    document.querySelectorAll("[data-score]")
        .forEach(item => item.textContent = state.score);


    global.app = {
        choose: (value) => {
            const button = pentagon.querySelector(`button[value="${ value }"]`);

            if (button) {
                return chooseValue(button);
            }
        },
        restart: restart
    };
    
})(window);
