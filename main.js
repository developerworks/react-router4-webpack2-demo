const electron = require('electron')
// 应用程序生命周期模块
const app = electron.app
// 创建原生浏览器窗口模块
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// 保持一个Window对象的全局引用, 否则Javascript对象在进行垃圾收集的时候窗口会被自动关闭.
let mainWindow

function createWindow () {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // 加载应用程序的index.html页面
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开DevTools开发工具
  // mainWindow.webContents.openDevTools()

  // 窗口关闭事件
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // 取消窗口对象的引用, 如果应用程序支持多窗口, 你应该把床存储到数组中.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// 当Electron完成初始化并且准备创建浏览器窗口是条用. 类似与普通浏览器的 domReady 事件.
// 某些API只在该事件发生后可用.
app.on('ready', createWindow)

// Quit when all windows are closed.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 在这个文件中, 你可以包含和主进程相关的代码, 你也可以把他们放到单独的文件中, 并且 require 进来.















