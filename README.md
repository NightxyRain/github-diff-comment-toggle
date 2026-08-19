# GitHub 差异评论按钮开关

适用于 Microsoft Edge 和 Google Chrome 的 Manifest V3 扩展。用于显示或隐藏 GitHub 文件差异页代码行左侧悬浮的蓝色评论 `+` 按钮。

## 功能

- 工具栏弹窗一键显示或隐藏行评论 `+` 按钮。
- 切换后当前页面即时生效。
- 支持 GitHub PR `Files changed` 新旧路由、比较页和提交差异页。
- 开关状态保存在浏览器扩展存储中。
- 不读取代码内容，不发送网络请求，不收集数据。

## Chrome 安装

1. 解压 ZIP 文件。
2. 打开 `chrome://extensions`。
3. 开启“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择包含 `manifest.json` 的 `github-diff-comment-toggle` 文件夹。

## Edge 安装

1. 解压 ZIP 文件。
2. 打开 `edge://extensions`。
3. 开启“开发人员模式”。
4. 点击“加载解压缩的扩展”。
5. 选择包含 `manifest.json` 的 `github-diff-comment-toggle` 文件夹。

## 使用

1. 打开 GitHub 文件差异页。
2. 点击浏览器工具栏中的插件图标。
3. 切换“显示蓝色评论 + 按钮”。

首次安装时已经打开的 GitHub 页面需要刷新一次。

## 权限

- `storage`：保存一个布尔开关值。
- `https://github.com/*`：在 GitHub 页面注入用于隐藏按钮的 CSS 和状态脚本。

## 开发信息

- 版本：`1.0.0`
- 清单版本：Manifest V3
- 主要选择器：`td.diff-text-cell button[aria-label="Add comment"]`
- 兼容旧版选择器：`.js-add-line-comment`、`.add-line-comment`
