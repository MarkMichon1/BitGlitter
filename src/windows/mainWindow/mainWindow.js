const { app, BrowserWindow, Menu, shell, ipcMain} = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

const createAboutWindow = require('../about/about')
const createBitGlitterVerifyWindow = require('../bitglitterVerify/bitglitterVerify')
const createPaletteOverviewWindow = require('../paletteOverview/paletteOverview')
//const createPresetsWindow = require('../presets/presets')
const createReadWindow = require('../read/read')
const createSavedStreamsWindow = require('../savedStreams/savedStreams')
const createSettingsWindow = require('../settings/settings')
const createStatisticsWindow = require('../statistics/statistics')
const createUserGuideWindow = require('../userGuide/userGuide')
const createWriteWindow = require('../write/write')
const WindowManager = require('../../utilities/windowManager')

function createMainWindow () {
    let mainWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'BitGlitter',
        useContentSize: true,
        width: 800,
        height: 620,
        resizable: !productionMode,
        icon: './assets/icons/icon.png',
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    const writeWindow = new WindowManager(createWriteWindow, mainWindow)
    const readWindow = new WindowManager(createReadWindow, mainWindow)
    const savedStreamWindow = new WindowManager(createSavedStreamsWindow, mainWindow)
    const bitglitterVerifyWindow = new WindowManager(createBitGlitterVerifyWindow, mainWindow)
    const paletteOverviewWindow = new WindowManager(createPaletteOverviewWindow, mainWindow)
    const settingsWindow = new WindowManager(createSettingsWindow, mainWindow)
    const statisticsWindow = new WindowManager(createStatisticsWindow, mainWindow)
    const userGuideWindow = new WindowManager(createUserGuideWindow, mainWindow)
    const aboutWindow = new WindowManager(createAboutWindow, mainWindow)


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
                    accelerator: productionMode ? 'Ctrl+R' : 'Ctrl+T',
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
                    label: 'Verify Stream',
                    click: () => bitglitterVerifyWindow.click()
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

    if (!productionMode) {
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
                        label: 'Reset Backend Executable (TODO!)',
                        click: () => {
                            console.log('Event goes here')
                        }
                    },
                ]
            },
        )
    }

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.loadFile(`${__dirname}/mainWindow.html`)

    // External links open in browser rather than in app
    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    ipcMain.on('openWriteWindow', () => writeWindow.click())
    ipcMain.on('openReadWindow', () => readWindow.click())
    ipcMain.on('openSavedStreamWindow', () => savedStreamWindow.click())

    return mainMenu
}

module.exports = createMainWindow