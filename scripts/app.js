(() => {
    const APP_STEPS = {
        USER_CHOOSE: 0,
        HOUSE_CHOOSE: 1,
        GAME_FINISH: 2
    };
    const GAME_RULES = {
        "scissors": [ "paper", "lizard" ],
        "paper": [ "rock", "spock" ],
        "rock": [ "scissors", "lizard" ],
        "lizard": [ "paper", "spock" ],
        "spock": [ "scissors", "rock" ]
    };
    const GAME_VALUES = Object.keys(GAME_RULES);
    const RESULT_TEXTS = {
        WIN: "YOU WIN",
        LOSE: "YOU LOSE",
        TIE: "TIE"
    };
    const HOUSE_STEP_TIMEOUT = 500;
    const state = {
        step: APP_STEPS.USER_CHOOSE,
        score: 0
    };
    const stepsSequence = [
        APP_STEPS.USER_CHOOSE,
        APP_STEPS.HOUSE_CHOOSE,
        APP_STEPS.GAME_FINISH
    ];
    const container = document.querySelector(".game__container");
    const field = document.querySelector(".game__field");
    const pentagon = document.querySelector(".pentagon");
    const versus = document.querySelector(".versus");
    const [ versusUser, versusHouse ] = versus.querySelectorAll(".versus__item");

    function animation(element) {
        return new Promise(resolve => {
            element.onanimationend = () => {
                element.onanimationend = null;
                resolve(element);
            };
        });
    }

    function transition(element) {
        return new Promise(resolve => {
            element.ontransitionend = () => {
                element.ontransitionend = null;
                resolve(element);
            };
        });
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function frame() {
        return new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)));
    }

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

    function generateValue() {
        return GAME_VALUES[parseInt(Math.random() * GAME_VALUES.length)];
    }

    function compareValues(left, right) {
        if (left === right) {
            return 0;
        }
        else if (GAME_RULES[left].includes(right)) {
            return -1;
        }

        return 1;
    }

    function nextStep() {
        const index = stepsSequence.indexOf(state.step);
        const nextIndex = index + 1 < stepsSequence.length ? index + 1 : 0;

        state.step = stepsSequence[nextIndex];
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

        pentagon.classList.add("fade-in");
        versus.classList.add("hidden");
        versus.parentNode.appendChild(pentagon);

        animation(pentagon).then(() => {
            versus.querySelectorAll(".pentagon__item-mask, .versus__item-picker .pentagon__item")
                .forEach(node => node.parentNode.removeChild(node));
            versus.querySelector(".loader")
                .classList.remove("hidden");
            versus.classList.remove("has-result");
            pentagon.classList.remove("fade-in");
        });

        nextStep();
    }

    function select(button) {
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
            clone.style.transform = "scale(2.2)";
            clone.style.transformOrigin = "top left";

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
            const houseValue = generateValue();
            const loader = versusHouse.querySelector(".loader");
            const houseButton = cloneButton(houseValue);

            versusHouse.querySelector(".versus__item-picker")
                .appendChild(houseButton);
            loader.classList.add("hidden");

            nextStep();

            const winner = compareValues(userValue, houseValue);
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

            versus.querySelector("h1").textContent = resultText;
            versus.classList.add("has-result");
            updateScore(winner * -1);
        });

        animation(pentagon).then(() => {
            pentagon.classList.remove("fade-out");
            pentagon.parentNode.removeChild(pentagon);
            button.classList.remove("d-none");
        });

        nextStep();
    }

    pentagon.addEventListener("click", (event) => {
        if (state.step !== APP_STEPS.USER_CHOOSE) {
            return;
        }

        const button = event.target.closest("button[value]");

        if (button) {
            select(button);
        }
    });

    document.querySelectorAll("[data-restart]")
        .forEach(button => button.addEventListener("click", restart));

    document.querySelectorAll("[data-score]")
        .forEach(item => item.textContent = state.score);
})();
