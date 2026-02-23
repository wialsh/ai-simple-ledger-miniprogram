```Bash
my-taro-app/
├── dist/                  # 编译输出目录（自动生成，不要手动修改）
│   └── weapp/             # 微信小程序编译结果（用于微信开发者工具打开）
│   └── h5/                # H5 编译结果
│
├── src/                   # 源代码目录（你主要开发的地方）
│   ├── app.config.ts      # 全局配置（页面路由、窗口样式等）
│   ├── app.tsx            # 应用入口文件（类似 React 的 App.js）
│   │
│   ├── pages/             # 页面目录（每个子目录是一个页面）
│   │   └── index/         # 首页
│   │       ├── index.config.ts  # 页面配置（标题、导航栏等）
│   │       └── index.tsx        # 页面组件
│   │
│   ├── components/        # 公共组件
│   ├── utils/             # 工具函数
│   ├── services/          # API 请求
│   ├── hooks/             # 自定义 Hook
│   ├── context/           # React Context
│   └── assets/            # 静态资源（图片、字体等）
│
├── config/                # 构建配置
│   ├── dev.js             # 开发环境配置
│   ├── prod.js            # 生产环境配置
│   └── index.js           # 主配置文件（包含 alias、plugins 等）
│
├── package.json           # 依赖和脚本
├── tsconfig.json          # TypeScript 配置
└── .gitignore
```

```bash
yarn install
yarn add @tarojs/plugin-html
yarn add @nutui/icons-react-taro
yarn add echarts echarts-taro3-react
```

## git提交

```bash
git commit -m "feat(auth): 添加手机号登录功能"
git commit -m "fix(api): 修复获取用户信息接口返回空问题"
git commit -m "refactor(utils): 封装请求拦截器"
git commit -m "docs: 更新项目部署说明"
```

| 类型（type） | 中文含义      | 适用场景说明                                                          |
| ------------ | ------------- | --------------------------------------------------------------------- |
| `feat`       | 新功能        | 新增用户可见的功能，如“添加登录页面”、“支持微信支付”                  |
| `fix`        | 修复 bug      | 修复已存在的问题，如“修复登录失败”、“解决样式错位”                    |
| `docs`       | 文档          | 仅修改文档（README、注释、帮助文件等），不涉及代码逻辑                |
| `style`      | 代码格式      | 不影响逻辑的代码样式调整，如空格、分号、Prettier 格式化               |
| `refactor`   | 重构          | 既不是新功能也不是修复 bug 的代码改进，如抽取函数、封装接口、优化结构 |
| `perf`       | 性能优化      | 提升性能的改动，如减少请求次数、缓存优化、算法改进                    |
| `test`       | 测试          | 新增或修改测试用例，如单元测试、E2E 测试                              |
| `build`      | 构建系统      | 影响构建流程或依赖的改动，如 Webpack 配置、CI 脚本、npm scripts       |
| `ci`         | 持续集成      | CI 配置文件和脚本，如 GitHub Actions、GitLab CI                       |
| `chore`      | 杂项/日常维护 | 其他不改变源码或测试的琐碎任务，如更新 .gitignore、调整目录结构       |
| `revert`     | 回滚          | 撤销之前的某次提交，如 `revert: feat: 添加实验性功能`                 |

## 清除缓存

```bash
rm -rf dist node_modules/.cache
```

## 重新编译

开发时：运行 yarn dev:weapp，Taro 自动读取 .env.development

```bash
yarn dev:weapp
```

测试时：运行 yarn dev:weapp:test，Taro 读取 .env.test，BASE_URL 变为测试服地址。

```bash
yarn dev:weapp:test
```

上线时：运行 yarn build:weapp，Taro 读取 .env.production，BASE_URL 变为正式服地址。

```bash
yarn build:weapp
```
