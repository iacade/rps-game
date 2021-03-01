((global) => {
    const APP_STEPS = {
        USER_CHOOSE: 0,
        HOUSE_CHOOSE: 1,
        GAME_FINISH: 2
    };
    const STEPS_SEQUENCE = [
        APP_STEPS.USER_CHOOSE,
        APP_STEPS.HOUSE_CHOOSE,
        APP_STEPS.GAME_FINISH
    ];

    class State {
        constructor() {
            this.step = APP_STEPS.USER_CHOOSE;
            this.score = +localStorage.getItem("score") || 0;
        }

        save() {
            localStorage.setItem("score", this.score);
        }

        next() {
            const index = STEPS_SEQUENCE.indexOf(this.step);
            const nextIndex = index + 1 < STEPS_SEQUENCE.length ? index + 1 : 0;

            this.step = STEPS_SEQUENCE[nextIndex];
        }
    }

    global.state = new State();
    global.APP_STEPS = APP_STEPS;

})(window);
