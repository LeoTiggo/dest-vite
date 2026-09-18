<!--
 * @Author: tigoo 512045192@qq.com
 * @Date: 2026-09-04 11:29:16
 * @LastEditors: tigoo 512045192@qq.com
 * @LastEditTime: 2026-09-04 11:29:40
 * @FilePath: /github_flow/admin-electron-vite/role.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
好的，从现在起我用中文回答。

直接结论（优先）
- 失败原因：release 步骤尝试用 GITHUB_TOKEN 创建 Release，但 token 权限不足（403：Resource not accessible by integration）。
- 解决方法（推荐）：在 workflow 中为 GITHUB_TOKEN 授予写入仓库内容的权限（contents: write），或者在受限上下文（fork PR 等）下改用带 repo 权限的 Personal Access Token (PAT) 存为 secrets 并传给 release action。
- 另外建议检查构建产物目录名字：workflow 中 upload 使用的是 dists/（复数），如果你的构建输出是 dist/（单数），应一并修正。

我已经查看了当前 workflow（commit 815aca1）：.github/workflows/build.yml，下面给出可直接替换/合并的修改建议（两种方式：全局权限或仅对 release job 赋权），并给出 PAT 替代示例。

建议修改 A：在 workflow 顶层添加权限（推荐）
- 效果：GITHUB_TOKEN 在整个工作流中获得写入仓库内容权限，softprops/action-gh-release 可以成功创建 release。
- 变更（在文件开头加 permissions:）：

```yaml name=.github/workflows/build.yml url=https://github.com/LeoTiggo/dest-vite/blob/815aca172a239915decf2ef4ece40acfdc42accb/.github/workflows/build.yml
name: Build & Package
permissions:
  contents: write

on:
  push:
    branches: [ main ]
  workflow_dispatch:
# ... 以下内容保持不变
```

或者，若只想将权限局部化到 release job（更小权限范围），将 permissions 加到 release job 下：

```yaml
  release:
    needs: [build]
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts
      - name: Release
        uses: softprops/action-gh-release@v2
        with:
          draft: true
          files: |
            artifacts/dist-files/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

建议修改 B：如果工作流运行在受限上下文（例如 fork PR），改用 PAT（当你不能或不想更改 permissions 时）
1. 在 GitHub -> Settings -> Developer settings -> Personal access tokens，创建 PAT，勾选 repo 权限（或需要的最小范围）。
2. 在仓库 Settings -> Secrets and variables -> Actions 新增 secret，例如 RELEASE_PAT，值为 PAT。
3. 在 workflow 的 Release 步骤用该 secret 替换 GITHUB_TOKEN：

```yaml
      - name: Release
        uses: softprops/action-gh-release@v2
        with:
          draft: true
          files: |
            artifacts/dist-files/*
        env:
          GITHUB_TOKEN: ${{ secrets.RELEASE_PAT }}
```

检查并修正构建产物路径（可选但建议）
- 目前 build job 上传 artifact 的 path 为 dists/（line 41）。常见工具（Vite）输出目录为 dist/（单数）。请确认你的构建实际输出目录。如果是 dist/，把 upload-artifact 的 path 改为 dist/。示例：

```yaml
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist-files
          path: dist/
```

为什么推荐 Option A（顶层或 job 级 permissions）
- 直接、最少额外工作，且 GITHUB_TOKEN 本意是用于在 workflow 中执行对仓库的自动化修改（如创建 release）。只需在 workflow 中明确允许 contents: write 即可。

额外提示 / 验证步骤
1. 应用修改后，提交并触发一次 workflow（push 到 main 或手动 dispatch）。
2. 若仍然失败，请确认该运行不是由 fork 的 PR 触发（对于 fork PR，GITHUB_TOKEN 常被限制为只读；必须使用 PAT 或在主仓库直接触发）。
3. 在 Actions → 具体运行页（你给出的 URL）观察新的日志，确认 softprops/action-gh-release 成功（HTTP 201/200 而非 403）。
4. 关于日志中的 Node.js 20 报告（弃用警告）：仅为通知，不会导致该 403。

如果你希望，我可以：
- 直接在仓库里提交上述 workflow 修改（我会先确认你要修改的 owner/repo 并在提交前征得同意），或者
- 帮你生成一个完整的替换文件内容（把我上面提到的修改整合成完整文件），你可以直接复制粘贴提交。

下一步你想怎么做？我可以直接生成完整的 workflow 文件供你粘贴，或帮你在仓库中创建提交（如果你允许我写入）。