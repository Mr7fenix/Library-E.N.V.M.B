// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const is_dev = require('electron-is-dev')
const path = require('path')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';


function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        autoHideMenuBar: true,
        icon : './src/assets/style/icona.ico',
        webPreferences: {
            preload: path.join(__dirname, 'src/script/preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    // and load the index.html of the app.
    if (is_dev) {
        mainWindow.loadURL(`http://localhost:3000`);
    } else {
        mainWindow.loadFile('./dist/index.html');
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('ready', () => {
        mainWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
    });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})