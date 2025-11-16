## 目标
- 用真实后端替换当前 `VulnerabilityAnalysis` 的模拟扫描与假数据，支持文件上传、进度反馈、结果展示与报告导出。

## 后端接口约定
- `POST /api/scan`（multipart/form-data）
  - 字段：`files[]`（多个代码文件）或 `archive`（zip/tar.gz），可附加 `projectName`
  - 返回：`{ jobId: string }`
- `GET /api/scan/:jobId`（轮询）
  - 返回：`{ status: 'pending'|'running'|'completed'|'failed', progress: number, startedAt: string, finishedAt?: string }`
- `GET /api/scan/:jobId/results`
  - 返回：`{ vulnerabilities: Vulnerability[], summary: { found: number, risk: 'low'|'medium'|'high', durationMs: number } }`
- `GET /api/scan/:jobId/report`（导出）
  - 返回：PDF/JSON 报告二进制流
- 可选：`ws://.../api/scan/:jobId/stream` 推送进度（若后端支持 WebSocket）

## 数据结构定义（前端）
- `Vulnerability`：`{ id: string, name: string, severity: 'high'|'medium'|'low', location: string, line: number, description?: string, fixSuggestion?: { before?: string, after?: string, explanation?: string } }`
- `ScanJob`：`{ jobId: string, status, progress, timestamps }`

## 前端改造
- 新增配置：`VITE_API_BASE_URL`（示例：`http://localhost:8080`）
- 新增 API 封装（使用 `fetch`）：`src/lib/api.ts`
  - `createScan(formData): Promise<{jobId}>`
  - `getScanStatus(jobId): Promise<...>`
  - `getScanResults(jobId): Promise<{vulnerabilities, summary}>`
  - `downloadReport(jobId): Promise<Blob>`
- 修改 `src/components/pages/VulnerabilityAnalysis.tsx`
  - 上传区域：选择文件（或 zip），构造 `FormData` 调用 `createScan`
  - 进度：收到 `jobId` 后每 1–2s 轮询 `getScanStatus`（或接入 WebSocket）更新 `isScanning`/`progress`
  - 完成：拉取 `getScanResults`，用真实数据替换当前 `mockVulnerabilities`
  - 修复建议：优先展示后端返回的 `fixSuggestion`；若缺失则回退到现有示例文案
  - 导出报告：调用 `downloadReport`，生成文件名并触发下载
  - 错误处理：统一 toast/状态区展示；支持“重新扫描”与“重试”

## 交互与状态
- 状态：`idle → uploading → queued/running(progress) → completed|failed`
- UI：保留现有动画与布局，只替换数据源与按钮逻辑；保持中英双语文案（沿用 `LanguageContext` 的 `t()`）

## 错误与重试策略
- 超时：状态轮询 60–120s 超时提示；提供“重试”按钮
- 后端错误：解析响应错误信息并展示；写入日志控制台便于排查
- 网络错误：指数退避重试（最多 3 次），失败回退至模拟模式（可选）

## 安全与上传限制
- 前端校验：大小限制（如 ≤ 20MB）、允许扩展名（.js/.ts/.py/.java/.php/.cpp 等）
- 防止重复提交：上传过程中禁用按钮
- 隐私提醒：不上传敏感凭据文件；支持上传压缩包仅包含代码目录

## 验证与交付
- 本地联调：后端提供可用的接口地址与示例返回
- 端到端验证：上传小型示例项目，观察进度与结果渲染
- 回归检查：主页与其余页面不受影响；语言切换正常

## 预计改动文件
- `src/components/pages/VulnerabilityAnalysis.tsx`（替换上传与扫描逻辑）
- 新增 `src/lib/api.ts`（API 封装）
- `.env.local`（新增 `VITE_API_BASE_URL`，不提交版本库）

## 下一步
- 你确认后，我将按以上方案实施前端改动，并与后端联调；完成后提供可点击的本地预览链接与验证步骤。