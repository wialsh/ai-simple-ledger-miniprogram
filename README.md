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
