# Client & Server

## Araden 的静态资源站

技术栈：Vue.js + NestJS + TypeScript

已预置：Github Action Workflow

## 上传说明

上传时请求为 POST 格式，携带请求头 upload-assets-key，该请求头的组成为：

- .env.local 文件中的 key
- 当前日期的 toLocaleString 格式

上述组成部分拼接后经 md5 哈希得到

# Util

## 基于 NodeJS 的资源上传脚本，后端为 assets-be

本脚本主要应用场景为 Typora 的粘贴图片时的上传操作

## 食用方法

1. 新建 .env.local 文件，内容为

```bash
# 请把等号后面的所有文字替换成实际使用时的值，行尾序列选择 LF
key=<value> # value 为后端定义的文件上传时的密钥
domain=<value> # value 为后端服务运行地址
```

2. pnpm i
3. \[pnpm dlx\] ts-node ./upload.ts \<file-path\>
4. 脚本输出资源上传后的可供访问的 URL
