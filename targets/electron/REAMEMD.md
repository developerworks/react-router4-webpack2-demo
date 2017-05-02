## 图标设置

设置 `BrowserWindow` 的 `icon` 属性仅对Windows和Linux有效. 要在OSX上为Electron应用程序设置图标, 需要使用 `electron-packager` 打包工具的 `--icon` 选项. Mac OSX 下的图标格式必须是 `.icns` 格式. 可以使用[这个在线工具](https://iconverticons.com/online/)进行转换.

http://stackoverflow.com/questions/31529772/how-to-set-app-icon-for-electron-atom-shell-app

## 路径问题

在开发环境下可以访问, 打包后为什么出错. 通常是路径的问题, 在产品环境应该使用绝对路径, Node.js 中通常用如下方式使用绝对路径, 比如设置一个托盘图标的路径:

```
tray = new Tray(
  path.join(__dirname, 'assets/icons/png/icon_16x16.png')
)
```
