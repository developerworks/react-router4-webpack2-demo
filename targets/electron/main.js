// const electron = require('electron')

const { app, Menu, BrowserWindow, Tray } = require('electron')

console.log(app.getLocale()) // en-US

const windowStateKeeper = require('electron-window-state')
// const autoUpdater = require('auto-updater')

// const = UPDATE_SERVER = ''
// var updateFeed = `http://${UPDATE_SERVER}/updates/latest`
// const appVersion = require('./package.json').version
// const feedURL = updateFeed + '?v=' + appVersion
// autoUpdater.setFeedURL(feedURL)

// 应用程序生命周期模块
// const app = electron.app
// 创建原生浏览器窗口模块
// const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// 保持一个Window对象的全局引用, 否则Javascript对象在进行垃圾收集的时候窗口会被自动关闭.
let mainWindow
let tray = null

function createWindow(){
  // 托盘
  const trayImage = path.join(__dirname, 'assets/icons/png/icon_16x16@2x.png')
  appIcon = new Tray(trayImage);
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'},
    {label: '退出 Webpack 2', type: 'radio'}
  ])
  appIcon.setToolTip('This is my application.')
  appIcon.setContextMenu(contextMenu)

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })
  console.log(mainWindowState)
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    // titleBarStyle: 'hidden',
    title: '重庆龙猫信息技术有限公司「实时竞价广告管理系统」',
    frame: true,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 500,
    x: mainWindowState.x,
    y: mainWindowState.y,
    center: true,
    resizable: true,
    movable: true,
    closable: true,
    fullscreen: false,
    icon: path.join(__dirname, 'assets/icons/mac/icon.icns')
  })
  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  mainWindow.loadURL('http://localhost:3000')

  // 打开DevTools开发工具
  if (process.platform !== 'darwin') {
    BrowserWindow.addDevToolsExtension("/Users/hezhiqiang/Library/Application\ Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.1.3_0")
  }
  mainWindow.webContents.openDevTools()

  // 窗口关闭事件
  mainWindow.on('closed', function () {
    // 取消窗口对象的引用, 如果应用程序支持多窗口, 你应该把床存储到数组中.
    mainWindow = null
  })

  mainWindowState.manage(mainWindow)
}


// 自动更新回调

// autoUpdater.addListener("update-available", function(event) {
// })
// autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
// })
// autoUpdater.addListener("error", function(error) {
// })
// autoUpdater.addListener("checking-for-update", function(event) {
// })
// autoUpdater.addListener("update-not-available", function(event) {
// })

// 当Electron完成初始化并且准备创建浏览器窗口是条用. 类似与普通浏览器的 domReady 事件.
// 某些API只在该事件发生后可用.
app.on('ready', createWindow)

// 当窗口被关闭是退出
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// 在这个文件中, 你可以包含和主进程相关的代码, 你也可以把他们放到单独的文件中, 并且 require 进来.
