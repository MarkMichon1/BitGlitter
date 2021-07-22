const { app, BrowserWindow, Menu } = require('electron')

function createMainWindow (isDev) {
    let mainWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'BitGlitter v1.0',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png'
    })

    const menu = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Write Stream',
                    click: () => {}
                },
                {
                    label: 'Read Stream',
                    click: () => {}
                },
                {
                    label: 'Saved Streams',
                    click: () => {}
                },
                {
                  type: 'separator'
                },
                {
                    label: 'Quit',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Preferences',
            submenu: [
                {
                    label: 'App Settings',
                    click: () => {}
                },
                {
                    label: 'Palettes',
                    click: () => {}
                },
                {
                    label: 'Presets',
                    click: () => {}
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Statistics',
                    click: () => {}
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'User Manual',
                    click: () => {}
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Github Project Page',
                    click: () => {}
                },
                {
                    label: 'Discord Server',
                    click: () => {}
                },
                {
                    type: 'separator'
                },
                {
                    label: 'About BitGlitter',
                    click: () => {}
                },
            ]
        },

    ]

    if (isDev) {
        menu.push(
            {
                label: 'Dev',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Reset Flask Executable',
                        click: () => {}
                    },
                ]
            },
        )
    }

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.loadFile(`${__dirname}/index.html`)

    // External links open in browser rather than in app
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    mainWindow.on('ready', () => {
        mainWindow = null
    })
}

module.exports = createMainWindow