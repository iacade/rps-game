((global) => {

    class Title {
        constructor() {
            this.stack = [];
        }

        set(newTitle) {
            this.stack.push(document.title);
            document.title = newTitle;

            return this;
        }

        get() {
            return document.title;
        }

        pop() {
            if (this.stack.length) {
                document.title = this.stack.pop();
            }

            return this;
        }

        append(postfix) {
            return this.set(this.get() + postfix);
        }

        prepend(prefix) {
            return this.set(prefix + this.get());
        }
    }

    global.title = new Title();

})(window);
