class WindowManager {
    // Prevents duplicate windows from being opened, and instead focuses the existing window.
    constructor(windowCreator, isDev, parentWindow) {
        this.isDev = isDev
        this.parentWindow = parentWindow
        this.windowCreator = windowCreator
        this.window = null
    }
    click() {
        if (this.window == null) {
            this.window = this.windowCreator(this.isDev, this.parentWindow)
            this.window.on('close', () => this.window = null)
        } else {
            this.window.focus()
        }
    }
}

module.exports = WindowManager