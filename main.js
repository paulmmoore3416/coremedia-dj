const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        backgroundColor: '#0d1117',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        title: 'CoreMedia DJ - Professional Media Player',
        frame: true,
        autoHideMenuBar: false
    });

    // Load the index.html
    mainWindow.loadFile('index.html');

    // Create application menu
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => { mainWindow.webContents.send('open-file'); }
                },
                {
                    label: 'Open URL',
                    accelerator: 'CmdOrCtrl+U',
                    click: () => { mainWindow.webContents.send('open-url'); }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => { app.quit(); }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle DJ View',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => { mainWindow.webContents.send('toggle-deck-view'); }
                },
                {
                    label: 'Music Library',
                    accelerator: 'CmdOrCtrl+L',
                    click: () => { mainWindow.webContents.send('open-library'); }
                },
                { type: 'separator' },
                {
                    label: 'Fullscreen',
                    accelerator: 'F11',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                },
                { type: 'separator' },
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' }
            ]
        },
        {
            label: 'Playback',
            submenu: [
                {
                    label: 'Play/Pause',
                    accelerator: 'Space',
                    click: () => { mainWindow.webContents.send('toggle-play'); }
                },
                {
                    label: 'Stop',
                    accelerator: 'S',
                    click: () => { mainWindow.webContents.send('stop'); }
                },
                { type: 'separator' },
                {
                    label: 'Previous',
                    accelerator: 'Left',
                    click: () => { mainWindow.webContents.send('previous'); }
                },
                {
                    label: 'Next',
                    accelerator: 'Right',
                    click: () => { mainWindow.webContents.send('next'); }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Keyboard Shortcuts',
                    accelerator: 'F1',
                    click: () => { mainWindow.webContents.send('show-help'); }
                },
                { type: 'separator' },
                {
                    label: 'About CoreMedia DJ',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About CoreMedia DJ',
                            message: 'CoreMedia DJ',
                            detail: 'Professional DJ and Media Player\nVersion 1.0.0\n\nBuilt with Electron\n\n© 2025 CoreMedia',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
