// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';
import { globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// 1) 获取核心 ESLint 官方推荐配置
const { configs: jsConfigs } = require('@eslint/js'); // 包含 eslint:recommended :contentReference[oaicite:0]{index=0}

// 2) 构造 FlatCompat，需要传入 recommendedConfig
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: jsConfigs.recommended,
});

// 3) 加载 Prettier 插件
const pluginPrettier = require('eslint-plugin-prettier');

export default [
  globalIgnores([
    '**/.next/**',
    '**/dist/**',
    'build/',
    'dist/',
    '.next/',
    'node_modules/',
  ]),
  // ────────────────────────────────────────────────────────────
  // A) 顶层：展开 eslint:recommended 与 Prettier 推荐配置
  // ────────────────────────────────────────────────────────────
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),

  // ────────────────────────────────────────────────────────────
  // B) 针对 packages/client：在此作用域内再展开 Next.js 推荐配置
  // ────────────────────────────────────────────────────────────
  {
    files: ['packages/client/**/*.{js,jsx,ts,tsx}'],
    ignores: ['packages/client/.next/**'],

    ...compat.config({
      extends: [
        'plugin:@next/next/recommended',
        'next/core-web-vitals',
        'next/typescript',
      ],
    }),

    rules: {
      'next/no-html-link-for-pages': ['error', 'packages/client/pages'],
    },

    settings: {
      next: {
        rootDir: 'packages/client',
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // C) 全局：统一 Prettier 风格校验
  // ────────────────────────────────────────────────────────────
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
  { ignores: ['node_modules/**', 'build/**', '.next/**', 'dist/**'] },
];
