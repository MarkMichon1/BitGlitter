const { app, BrowserWindow, Menu, shell } = require('electron')

const createAboutWindow = require('../about/about')
const createPaletteWindow = require('../palettes/paletteNodeTempName')
const createPresetsWindow = require('../presets/presets')
const createReadWindow = require('../read/read')
const createSavedStreamsWindow = require('../savedStreams/savedStreams')
const createSettingsWindow = require('../settings/settings')
const createStatisticsWindow = require('../statistics/statistics')
const createUserManualWindow = require('../userManual/userManual')
const createWriteWindow = require('../write/write')

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
                    accelerator: 'Ctrl+W',
                    click: () => createWriteWindow()
                },
                {
                    label: 'Read Stream',
                    accelerator: !isDev ? 'Ctrl+R' : 'Ctrl+T',
                    click: () => createReadWindow()
                },
                {
                    label: 'Saved Streams',
                    accelerator: 'Ctrl+S',
                    click: () => createSavedStreamsWindow()
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
                    label: 'Palettes',
                    click: () => createPaletteWindow()
                },
                {
                    label: 'Presets',
                    click: () => createPresetsWindow()
                },
                {
                    label: 'Settings',
                    click: () => createSettingsWindow()
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Statistics',
                    click: () => createStatisticsWindow()
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'User Manual',
                    accelerator: 'Ctrl+M',
                    click: () => createUserManualWindow()
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Github Project Page',
                    click: () => shell.openExternal('https://github.com/MarkMichon1/BitGlitter')
                },
                {
                    label: 'Discord Server',
                    click: () => shell.openExternal('https://discord.com/invite/t9uv2pZ'),
                },
                {
                    type: 'separator'
                },
                {
                    label: 'About BitGlitter',
                    click: () => createAboutWindow()
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

    mainWindow.loadFile(`${__dirname}/mainWindow.html`)

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