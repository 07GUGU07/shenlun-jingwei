# 把「申论经纬」发布成 GitHub Pages

这个网页是纯静态页面，不需要服务器、不需要数据库、不需要构建命令。把文件放进 GitHub 仓库，开启 Pages 就能得到一个手机可访问的网址。

---

## 一、先准备这些文件

仓库根目录只需要下面这些文件（文件名不要改）：

```text
index.html
styles.css
data.js
terms.js
app.js
manifest.webmanifest
icon.svg
icon-180.png
icon-512.png
README.md
DEPLOY.md
.nojekyll
```

其中：

- `index.html` 必须在仓库**根目录**，不能放进子文件夹。
- `.nojekyll` 是空文件，用来跳过 GitHub 的 Jekyll 处理；不创建一般也能用。
- 不要上传 `node_modules`、浏览器测试截图、`.edge-profile`、`.npm-cache` 等临时文件。

---

## 二、创建 GitHub 仓库

1. 登录 GitHub。
2. 右上角 `+` → **New repository**。
3. 填写：
   - Repository name：`shenlun-jingwei`（也可以叫 `shenlun-map`）
   - Description：`国考/京考申论五位一体备考图谱`
   - 选择 **Public**
   - 不要勾选 “Add a README file”
4. 点击 **Create repository**。

> 仓库名建议用英文小写和短横线，网址更干净。不要用中文名。

---

## 三、上传文件（最简单：网页上传）

1. 进入刚创建的空仓库。
2. 点击 **uploading an existing file** / **Add file → Upload files**。
3. 把上面列出的文件全部拖进去。
4. 在下方 Commit changes 填写：`feat: 申论经纬网页`
5. 点击 **Commit changes**。

### 如果 `.nojekyll` 传不上去

网页上传对隐藏文件不友好，可以：

1. 仓库页面 → **Add file → Create new file**
2. 文件名填 `.nojekyll`
3. 内容留空
4. 点击 **Commit changes**

---

## 四、开启 GitHub Pages

1. 进入仓库的 **Settings**（顶部标签）。
2. 左侧找到 **Pages**。
3. 在 **Build and deployment** 下：
   - Source：选择 **Deploy from a branch**
   - Branch：选择 **main**
   - Folder：选择 **/ (root)**
4. 点击 **Save**。
5. 等待 1—3 分钟，刷新 Pages 页面。

页面会显示：

```text
Your site is live at https://<你的用户名>.github.io/shenlun-jingwei/
```

这就是手机可以打开的链接。

> 如果仓库名是 `<你的用户名>.github.io`，网址会变成 `https://<你的用户名>.github.io/`。

---

## 五、手机打开并添加到主屏幕

### iPhone / Safari

1. 用 Safari 打开网址。
2. 点击底部 **分享** 按钮。
3. 选择 **添加到主屏幕**。
4. 名称填「申论经纬」，点击 **添加**。

### Android / Chrome

1. 用 Chrome 打开网址。
2. 右上角 **⋮** → **添加到主屏幕** / **安装应用**。

添加后，图标是红底白字的「申」；打开后是独立窗口，适合每天背几个主题。

---

## 六、以后怎么更新

每次改完 `data.js`、`terms.js`、`styles.css` 或 `app.js`：

1. 进入仓库。
2. 打开对应文件 → 右上角铅笔图标编辑 → Commit changes。
3. 或者重新 **Add file → Upload files** 覆盖旧文件。
4. GitHub Pages 会自动重新发布，通常 1—3 分钟生效。

手机上如果看到旧版本，强制刷新或重新打开链接。

---

## 七、用 Git 命令上传（可选）

如果你电脑上装了 Git，可以在网页文件夹里执行：

```bash
git init
git add .
git commit -m "feat: 申论经纬五位一体备考图谱"
git branch -M main
git remote add origin https://github.com/<你的用户名>/shenlun-jingwei.git
git push -u origin main
```

然后按第四步开启 Pages。

> 把 `<你的用户名>` 换成你的 GitHub 用户名。不要直接把尖括号一起复制。

---

## 八、常见问题

### 1. 打开是 404

依次检查：

- `index.html` 是否在仓库根目录；
- Pages 的 Branch 是否选了 `main`，Folder 是否选了 `/ (root)`；
- 是否刚保存，等待 1—3 分钟；
- 网址末尾是否有 `/`。

### 2. 页面没有样式 / 没有数据

- 检查 `styles.css`、`data.js`、`terms.js`、`app.js` 是否都上传了；
- 文件名大小写必须一致（GitHub Pages 在 Linux 上区分大小写）；
- 不要把这些文件放进 `assets` 子文件夹后仍用原来的相对路径。

### 3. 手机打开是电脑版排版

- 确认 `index.html` 里有：
  `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`
- 用手机浏览器直接打开，不要在微信内置浏览器里长期阅读；微信里可以点右上角“在浏览器打开”。

### 4. 添加到主屏幕后没有图标

- 确认 `icon-180.png`、`icon-512.png`、`manifest.webmanifest` 已上传；
- iOS 对 SVG 图标支持不稳定，所以这里同时准备了 PNG；
- 删除旧的主屏幕图标，重新添加一次。

### 5. 想改成自己的域名

- 在仓库 Settings → Pages → Custom domain 填写域名；
- 在域名服务商处添加 CNAME 记录指向 `<你的用户名>.github.io`；
- 开启 HTTPS。

---

## 九、发布前检查清单

- [ ] `index.html` 在根目录
- [ ] `styles.css`、`data.js`、`terms.js`、`app.js` 都已上传
- [ ] `manifest.webmanifest`、`icon-180.png`、`icon-512.png` 已上传
- [ ] Pages 的 Branch 是 `main`，Folder 是 `/ (root)`
- [ ] 手机打开后能正常展开子主题、看到规范词释义
- [ ] 添加到主屏幕后图标和名称正常

---

发布成功后，把网址发给我，我可以继续帮你检查手机端显示，或者加“真题—主题映射表”。
