const { app, BrowserWindow, Menu, nativeTheme, shell, ipcMain} = require('electron')

const createAboutWindow = require('../about/about')
const createPaletteOverviewWindow = require('../paletteOverview/paletteOverview')
//const createPresetsWindow = require('../presets/presets')
const createReadWindow = require('../read/read')
const createSavedStreamsWindow = require('../savedStreams/savedStreams')
const createSettingsWindow = require('../settings/settings')
const createStatisticsWindow = require('../statistics/statistics')
const createUserGuideWindow = require('../userGuide/userGuide')
const createWriteWindow = require('../write/write')
const WindowManager = require('../../utilities/windowManager')

function createMainWindow (isDev, operatingSystem) {
    let mainWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'BitGlitter v1.0',
        // width: operatingSystem === 'linux' ? 800 : 840,
        // height: operatingSystem === 'linux' ? 625 : 660,
        width: 815,
        height: 660,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    const operatingSystemUsed = operatingSystem
    const writeWindow = new WindowManager(createWriteWindow, isDev, mainWindow)
    const readWindow = new WindowManager(createReadWindow, isDev, mainWindow)
    const savedStreamWindow = new WindowManager(createSavedStreamsWindow, isDev, mainWindow)
    const paletteOverviewWindow = new WindowManager(createPaletteOverviewWindow, isDev, mainWindow)
    const settingsWindow = new WindowManager(createSettingsWindow, isDev, mainWindow)
    const statisticsWindow = new WindowManager(createStatisticsWindow, isDev, mainWindow)
    const userGuideWindow = new WindowManager(createUserGuideWindow, isDev, mainWindow)
    const aboutWindow = new WindowManager(createAboutWindow, isDev, mainWindow)


    const menu = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Write Stream',
                    accelerator: 'Ctrl+W',
                    click: () => writeWindow.click()
                },
                {
                    label: 'Read Stream',
                    accelerator: !isDev ? 'Ctrl+R' : 'Ctrl+T',
                    click: () => readWindow.click()
                },
                {
                    label: 'Saved Streams',
                    accelerator: 'Ctrl+S',
                    click: () => savedStreamWindow.click()
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
                    accelerator: 'Ctrl+P',
                    click: () => paletteOverviewWindow.click()
                },
                // {
                //     label: 'Presets',
                //     click: () => createPresetsWindow()
                // },
                {
                    label: 'Settings',
                    click: () => {
                        settingsWindow.click()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Statistics',
                    click: () => statisticsWindow.click()
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'User Guide',
                    accelerator: 'Ctrl+G',
                    click: () => userGuideWindow.click()
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
                    click: () => aboutWindow.click()
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
                        click: () => {
                            console.log('Placeholder')
                        }
                    },
                ]
            },
        )
    }

    const mainMenu = Menu.buildFromTemplate(menu)
    // mainWindow.setMenu(mainMenu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.loadFile(`${__dirname}/mainWindow.html`)

    // External links open in browser rather than in app
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    ipcMain.on('openWriteWindow', () => writeWindow.click())
    ipcMain.on('openReadWindow', () => readWindow.click())
    ipcMain.on('openSavedStreamWindow', () => savedStreamWindow.click())

    return mainMenu
}

module.exports = createMainWindow