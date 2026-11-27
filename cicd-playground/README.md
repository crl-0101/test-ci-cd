# 你的第一次 CI/CD：提交 → 测试 → 上线

用一个运费计算器，亲手完成三轮实验：首次上线、测试拦截错误、修复后再次上线。首次体验通常需要约 15–25 分钟，具体取决于 GitHub 排队和发布速度。

- **CI（持续集成）**：每次提交或发起 Pull Request，GitHub 自动运行测试。
- **CD（本例为持续部署）**：main 分支通过测试后，GitHub 自动把网页发布到 GitHub Pages。

不需要服务器、域名、支付信息或自己配置密钥。整个入门流程可以只用浏览器完成。本项目没有第三方 npm 依赖。

## 1. 创建新仓库并启用 Pages

1. 登录 GitHub，打开 https://github.com/new 。
2. Repository name 填 `cicd-playground`，选择 **Public**，勾选 **Add a README file**，然后点 **Create repository**。公开仓库可以在 GitHub Free 下体验 Pages；上传的示例代码和发布的网站会公开。
3. 到仓库 **Settings → Pages → Build and deployment**，把 **Source** 设为 **GitHub Actions**。无需选择页面推荐的模板，本项目已经带了工作流。
4. 回到仓库 **Code** 页面，确认默认分支是 **main**。如果名称不同，先通过 GitHub 的分支管理把它重命名为 main，本教程的触发条件使用这个名称。

先启用 Pages，再上传项目，可以避免第一次部署因未启用 Pages 而失败。

## 2. 上传项目，观察第一次自动上线

1. 将下载的 ZIP 解压，进入 `cicd-playground` 目录。
2. 在 GitHub 仓库的 **Code → Add file → Upload files** 页面，将该目录里面的全部文件和文件夹拖入，包括 `.github`、`site`、`tests` 和 `package.json`。
3. **不要把外层的 `cicd-playground` 文件夹一起上传**。上传后根目录必须直接有 `package.json`，工作流必须位于 `.github/workflows/deploy.yml`。请勿只上传 ZIP 文件。
4. 输入提交说明 `Add CI/CD playground`，选择直接提交到 main，然后点 **Commit changes**。
5. 打开仓库 **Actions**，进入最新一条 **Test and deploy**。预期先看到 **Run tests (CI)** 变绿，再看到 **Publish website (CD)** 变绿。
6. 在运行详情中的 `github-pages` 部署链接，或 **Settings → Pages** 显示的链接中打开网站。通常地址是 `https://你的用户名.github.io/cicd-playground/`，以 GitHub 实际给出的地址为准。
7. 在网页中输入 98，运费应为 ¥10；输入 99，运费应为 ¥0。

如果拖拽时没有上传 `.github`：在仓库根目录点 **Add file → Create new file**，文件名输入 `.github/workflows/deploy.yml`，把解压文件中同名文件的内容完整粘贴进去再提交。

## 3. 做一次能看得见的修改

1. 在 GitHub 打开 `site/index.html`，点击编辑按钮。
2. 将“我的第一次自动发布”改成“我已经完成第一次 CI/CD”。
3. 点击 **Commit changes** 并提交到 main。
4. 到 **Actions** 观察新运行；两个任务都变绿后，刷新线上网站，确认新标题出现。

你没有手动上传服务器，提交就触发了自动测试和部署。如果旧页面还在，尝试强制刷新（Windows：Ctrl + F5）。

## 4. 故意制造错误：让 CI 拦住一次发布

1. 在 GitHub 编辑 `site/shipping.js`，把：

   ```js
   export const FREE_SHIPPING_THRESHOLD = 99;
   ```

   改成：

   ```js
   export const FREE_SHIPPING_THRESHOLD = 199;
   ```

2. 提交到 main，说明可以写 `Experiment: break free shipping threshold`。
3. 进入 **Actions**。预期 **Run tests (CI)** 变红，**Publish website (CD)** 显示 **Skipped**。
4. 打开失败任务的 **Test shipping rules** 日志。你会看到 99 元应免运费，但程序返回了 10 元运费。
5. 打开原来的线上网站，99 元仍然免运费：这次错误修改没有被部署。测试失败不会撤销已经提交的代码，它阻止的是后续发布。

测试写的是独立的业务约定“满 99 元包邮”，而不是简单照抄程序中的常量，因此能发现这个错误。

## 5. 修复，再次上线

1. 把 `site/shipping.js` 中的 199 改回 99。
2. 提交到 main，说明可以写 `Fix free shipping threshold`。
3. 到 **Actions** 确认两个任务重新变绿，网站恢复正常发布。

至此，你已经完整体验：**提交 → 自动测试 → 自动发布 → 测试失败阻止发布 → 修复 → 再次发布**。

## 可选：体验 Pull Request

下一次编辑网页时，在提交窗口选择 **Create a new branch for this commit and start a pull request**，使用类似 `change-title` 的分支名并创建 Pull Request。

- PR 会运行 CI；部署任务会跳过。
- CI 通过后，将 PR 合并到 main，会触发 main 的测试和部署。
- 本示例没有配置分支保护。CI 会阻止失败版本部署，但不会自动阻止 PR 合并；强制要求通过测试后才能合并，需要另外设置 Rulesets 或 Branch protection。

## 文件对应关系

```text
cicd-playground/
├── .github/workflows/deploy.yml  # 自动化流程定义，必须在仓库根目录下
├── site/
│   ├── index.html               # 网站内容
│   ├── styles.css               # 网站样式
│   ├── app.js                   # 页面交互
│   └── shipping.js              # 运费业务规则
├── tests/shipping.test.js       # 业务规则的自动测试
├── package.json                # npm test 命令
└── README.md                   # 本操作指南
```

工作流的 `on` 决定什么时候运行；`test` 任务执行 `npm test`；`deploy` 任务的 `needs: test` 表示必须等测试成功；`if` 限制仅 main 的非 PR 运行可以发布。只上传 `site` 文件夹作为网站内容。

## 可选：在本机运行

使用 Node.js 22 或更新版本，在项目根目录执行：

```powershell
npm test
```

无需先运行 `npm install`。如果本机安装了 Python，可以用静态服务器预览网页：

```powershell
python -m http.server 8000 --directory site
```

然后打开 http://localhost:8000 。因为网页使用 JavaScript 模块，请通过 HTTP 预览，不要直接双击 HTML 文件。

## 遇到问题时

- **Actions 页面没有运行**：确认工作流路径是根目录下的 `.github/workflows/deploy.yml`，提交分支是 main，仓库允许使用 Actions。组织策略可能禁用 Actions 或 Pages；这时可改用个人仓库。
- **部署提示 Pages 未找到 / Get Pages site failed**：先到 Settings → Pages 把 Source 设为 GitHub Actions，再回到失败运行点 Re-run all jobs。
- **测试失败、部署 Skipped**：先读失败的测试日志。第 4 步这是预期现象；其他情况检查是否漏传文件或改错代码。
- **网站刚部署完暂时 404 或内容没更新**：等 GitHub 完成发布，并使用 Settings → Pages 提供的实际地址访问，再强制刷新。
- **找不到 Pages 设置**：确认自己拥有仓库管理权限，并且仓库为公开仓库。私有仓库的 Pages 可用性取决于账号套餐或组织设置。

这里只展示测试与静态网页部署；真实项目还常会增加构建、安全检查、测试环境和发布审批。
