import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'path';
import devConfig from './dev';
import prodConfig from './prod';

// 假设你的环境变量已经放在了 .env 文件中，或者你手动在此处指定
// 注意：Taro 会自动加载 .env 文件中的变量，但需要通过 defineConstants 注入到代码中
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(
  async (
    merge
    // { command, mode }
  ) => {
    const baseConfig: UserConfigExport<'webpack5'> = {
      projectName: 'ai-simple-ledger-miniprogram',
      date: '2025-12-28',
      designWidth: 750,

      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        375: 2,
        828: 1.81 / 2,
      },
      sourceRoot: 'src',
      outputRoot: 'dist',
      plugins: ['@tarojs/plugin-generator', '@tarojs/plugin-html'],
      defineConstants: {},
      copy: {
        patterns: [],
        options: {},
      },
      framework: 'react',
      // compiler: 'webpack5',
      compiler: {
        type: 'webpack5',
        /**
         * ✨✨✨ 添加下面这段配置来关闭 prebundle ✨✨✨
         * 如果正在进行版本调整，预编译功能很容易出错。
         * 建议暂时关闭这个功能，回归标准的 Webpack 编译模式。
         * 虽然编译速度会慢几百毫秒，但极其稳定。
         */
        prebundle: {
          enable: false,
        },
      },
      cache: {
        enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
      },
      mini: {
        postcss: {
          pxtransform: {
            enable: true,
            config: {},
          },
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            config: {
              namingPattern: 'module', // 转换模式，取值为 global/module
              generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
          },
          optimizeMainPackage: {
            enable: false,
          },
        },
        webpackChain(chain) {
          chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
          // 处理预编译问题
          chain.module
            .rule('js')
            .include.add(/node_modules\/lodash/)
            .end()
            .use('babel-loader')
            .loader('babel-loader')
            .options({
              presets: [['@babel/preset-env', { modules: false }]],
            });
          // 开发模式下使用轻量级 SourceMap
          if (process.env.NODE_ENV === 'development') {
            chain.merge({
              devtool: 'cheap-module-source-map', // 默认通常是这个，也可以试试 'eval-cheap-module-source-map'
            });
          }
        },
      },
      h5: {
        publicPath: '/',
        staticDirectory: 'static',
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js',
        },
        miniCssExtractPluginOption: {
          ignoreOrder: true,
          filename: 'css/[name].[hash].css',
          chunkFilename: 'css/[name].[chunkhash].css',
        },
        postcss: {
          autoprefixer: {
            enable: true,
            config: {},
          },
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            config: {
              namingPattern: 'module', // 转换模式，取值为 global/module
              generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },
        webpackChain(chain) {
          chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        },
      },
      rn: {
        appName: 'taroDemo',
        postcss: {
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          },
        },
      },
    };

    if (process.env.NODE_ENV === 'development') {
      // 本地开发构建配置（不混淆压缩）
      return merge({}, baseConfig, devConfig);
    }
    // 生产构建配置（默认开启压缩混淆等）
    return merge({}, baseConfig, prodConfig);
  }
);
