((global) => {
    const GAME_RULES = {
        "scissors": [ "paper", "lizard" ],
        "paper": [ "rock", "spock" ],
        "rock": [ "scissors", "lizard" ],
        "lizard": [ "paper", "spock" ],
        "spock": [ "scissors", "rock" ]
    };
    const GAME_VALUES = Object.keys(GAME_RULES);
    
    class Game {
        generate() {
            return GAME_VALUES[parseInt(Math.random() * GAME_VALUES.length)];
        }

        compare(left, right) {
            if (left === right) {
                return 0;
            }
            else if (GAME_RULES[left].includes(right)) {
                return -1;
            }
    
            return 1;
        }
    }

    global.game = new Game();

})(window);
