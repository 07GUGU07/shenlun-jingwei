# 用 Git 命令发布「申论经纬」到 GitHub Pages

> 这一版按你的要求，以 **Git 命令**为主，不需要下载 GitHub Desktop，也不需要手动拖文件上传。
> 本地仓库已经初始化并完成第一次提交，提交号：`a6c17c6`。

---

## 一、先确认本地状态

项目文件夹：

```text
C:\Users\Admin\Desktop\作品\D\D2
```

这个文件夹里已经有 `.git`，并且已经提交过一次。不要删除 `.git`。

你的电脑已安装 Git，但可能没有加入 PATH。打开 **PowerShell**，先执行：

```powershell
cd "C:\Users\Admin\Desktop\作品\D\D2"
$env:Path += ";C:\Program Files\Git\cmd"
git --version
```

看到 `git version ...` 就说明当前窗口可以使用 git 了。

> 每次新开 PowerShell 窗口，都要重新执行 `$env:Path += ...` 这一行。
> 想一劳永逸，可以把 `C:\Program Files\Git\cmd` 加进 Windows 用户环境变量 PATH。

---

## 二、在 GitHub 创建一个空仓库

1. 登录 GitHub。
2. 右上角 `+` → **New repository**。
3. Repository name 填：

```text
shenlun-jingwei
```

4. 选择 **Public**。
5. **不要**勾选：
   - Add a README file
   - Add .gitignore
   - Choose a license
6. 点击 **Create repository**。

创建完成后，页面会显示仓库地址，例如：

```text
https://github.com/07GUGU07/shenlun-jingwei.git
```

把 `07GUGU07` 换成你自己的 GitHub 用户名。

---

## 三、把本地仓库连到 GitHub

在刚才的 PowerShell 窗口里执行：

```powershell
git remote add origin https://github.com/<你的用户名>/shenlun-jingwei.git
git remote -v
```

`git remote -v` 应该显示两行 `fetch` 和 `push`，地址就是你的仓库。

> 如果提示 `remote origin already exists`，说明之前加过，改用：
>
> ```powershell
> git remote set-url origin https://github.com/<你的用户名>/shenlun-jingwei.git
> ```

---

## 四、推送代码

```powershell
git push -u origin main
```

第一次推送时，通常会弹出 **Git Credential Manager** 窗口：

1. 选择 **Sign in with your browser**；
2. 浏览器打开 GitHub 登录页；
3. 登录并点击 **Authorize**；
4. 回到 PowerShell，等待推送完成。

看到类似下面的输出就成功了：

```text
branch 'main' set up to track 'origin/main'.
```

如果窗口没有弹出，而是命令行让你输入用户名和密码：

- Username：你的 GitHub 用户名；
- Password：**不是** GitHub 登录密码，而是 **Personal Access Token**。
- 创建 Token：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token，勾选 `repo` 权限，复制生成的 Token 作为密码。

> 推荐让 Git Credential Manager 自动弹窗，不要手动输密码。

---

## 五、开启 GitHub Pages

1. 打开仓库页面；
2. 顶部 **Settings**；
3. 左侧 **Pages**；
4. **Build and deployment**：
   - Source：**Deploy from a branch**
   - Branch：**main**
   - Folder：**/ (root)**
5. 点击 **Save**；
6. 等待 1—3 分钟，刷新页面。

页面会显示：

```text
https://<你的用户名>.github.io/shenlun-jingwei/
```

这就是手机能打开的网址。

---

## 六、手机打开并添加到主屏幕

### iPhone / Safari

1. 打开网址；
2. 点底部 **分享**；
3. 选 **添加到主屏幕**；
4. 名称填「申论经纬」；
5. 点 **添加**。

### Android / Chrome

1. 打开网址；
2. 右上角 `⋮`；
3. 选 **添加到主屏幕** / **安装应用**。

图标是红底白字的「申」，打开后是独立窗口。

---

## 七、以后更新内容

改完 `data.js`、`terms.js`、`styles.css` 或 `app.js` 后，在项目文件夹执行：

```powershell
cd "C:\Users\Admin\Desktop\作品\D\D2"
$env:Path += ";C:\Program Files\Git\cmd"

git status
git add .
git commit -m "update: 更新申论内容"
git push
```

GitHub Pages 会自动重新发布，通常 1—3 分钟生效。

---

## 八、常见报错

### 1. `git : 无法将“git”项识别为 cmdlet`

说明当前窗口没有把 Git 加进 PATH。执行：

```powershell
$env:Path += ";C:\Program Files\Git\cmd"
```

### 2. `remote origin already exists`

```powershell
git remote set-url origin https://github.com/<你的用户名>/shenlun-jingwei.git
```

### 3. `failed to push some refs` / `rejected`

通常是因为创建仓库时勾选了 README，远程多了一个提交。执行：

```powershell
git pull --rebase origin main
git push -u origin main
```

### 4. 打开网址是 404

检查：

- 仓库里 `index.html` 是否在根目录；
- Pages 的 Branch 是否 `main`；
- Folder 是否 `/ (root)`；
- 是否刚保存，等 1—3 分钟；
- 网址末尾有没有 `/`。

### 5. 页面没样式 / 没数据

检查仓库里是否有：

```text
styles.css
data.js
terms.js
app.js
```

文件名大小写必须一致；GitHub Pages 在 Linux 上区分大小写。

### 6. 手机打开是电脑版

用手机浏览器直接打开，不要在微信里长期阅读。微信里可以点右上角 → **在浏览器打开**。

---

## 九、备选：完全不用命令行

如果 Git 命令实在跑不通，再到仓库页面用 **Add file → Upload files** 上传这些文件：

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

然后按第五步开启 Pages。效果一样，只是以后更新要重新上传。

---

## 十、发布前检查清单

- [ ] PowerShell 里 `git --version` 正常
- [ ] GitHub 上是 **Public** 空仓库
- [ ] `git remote -v` 地址正确
- [ ] `git push -u origin main` 成功
- [ ] Pages：`main` + `/ (root)`
- [ ] 手机打开网址正常
- [ ] 添加到主屏幕后图标正常

---

发布成功后，把网址发给我，我可以继续帮你检查手机端显示。
