const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')
const server = require('./server');
var http = require('http');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
var port = process.env.ELECTRON_WORKER_PORT,
  host = process.env.ELECTRON_WORKER_HOST,
  workerId = process.env.ELECTRON_WORKER_ID;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    "web-preferences": {
      "web-security": false
    }
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools when in dev mode.
  if (process.env.NODE_ENV == 'development') {
    win.webContents.openDevTools()
    require('devtron').install()
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  //create server process
  // server.createServer(app, require('electron-ipc-server'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
    // var expressApp = spawn(server.createExpressServer, app, {
    //   detached: true
    // });
    var server = http.createServer(function(req, res) {
      // You can respond with a status `500` if you want to indicate that something went wrong 
      res.writeHead(200, {'Content-Type': 'application/json'});
      // data passed to `electronWorkers.execute` will be available in req body 
      req.pipe(res);
    });
   
    server.listen(8787, host);
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
