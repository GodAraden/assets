<template>
  <img
    src="https://raw.githubusercontent.com/GodAraden/GodAraden/main/logo.svg"
    width="64"
    height="64"
  />
  <h3>文件上传 UI，一切从简</h3>

  <div style="display: grid; grid-template-columns: 72px 1fr; gap: 20px">
    <!-- 文件上传框 -->
    <label for="asset">文件</label> <input type="file" ref="input" id="asset" />
    <!-- 密钥输入框 -->
    <label for="key">密钥</label>
    <input type="password" v-model="key" id="key" />
    <!-- 上传后是否保留原文件名，即不加时间戳 -->
    <label for="hold">保留原名</label>
    <input type="checkbox" v-model="hold" id="hold" />
    <!-- 是否在文件名前加上 shared- 前缀 -->
    <label for="shared">共享文件</label>
    <input type="checkbox" v-model="shared" id="shared" />
  </div>

  <button style="margin: 32px" @click="onUpload">上传</button> <br />
  <button :disabled="!isTipFilename()" @click="onCopy">{{ tip }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MD5 } from 'crypto-js';
import axios from 'axios';

const defaultTip =
  '上传成功后，这里会展示用于访问文件的文件名，点击复制完整URL 🙌';
const successTip = '复制成功 🎇';

const key = ref('');
const hold = ref(true);
const shared = ref(false);
const tip = ref(defaultTip);
const input = ref<HTMLInputElement>();

let timer = null;

// 判断提示信息是否是文件名，非文件名的提示内容会以一个 emoji 结尾
function isTipFilename() {
  const notFilenameSuffix = ['🙌', '🎇', '🙀'];
  let res = true;
  for (const emoji of notFilenameSuffix) {
    res = res && !tip.value.endsWith(emoji);
  }
  return res;
}

// 复制资源完整访问 url 到剪切板
async function onCopy() {
  if (isTipFilename()) {
    const domain = import.meta.env.PROD
      ? 'https://assets.araden.top/'
      : 'http://localhost:10086/';
    await navigator.clipboard.writeText(domain + tip.value);
    tip.value = successTip;
  }
}

// 上传资源，资源的命名单独传一下
async function upLoadAsset(asset: File) {
  const formData = new FormData();
  formData.append('asset', asset);
  formData.append('hold', hold.value ? 'hold' : '');
  formData.append('shared', shared.value ? 'shared' : '');
  formData.append('name', asset.name);
  try {
    const url = import.meta.env.PROD ? 'https://assets.araden.top/' : '/api/';
    const { data } = await axios.post<string>(url, formData, {
      headers: {
        'upload-assets-key': MD5(
          key.value + new Date().toLocaleDateString('zh-CN'),
        ).toString(),
      },
    });
    return data;
  } catch (error) {
    return `${error.response?.data.statusCode || '444'}: ${error.response?.data.message || '未知错误'} 🙀`;
  }
}

// 上传按钮点击事件处理
async function onUpload() {
  const file = input.value.files[0];
  if (!file) return;
  tip.value = await upLoadAsset(file);
  clearTimeout(timer);
  timer = setTimeout(() => (tip.value = defaultTip), 23300);
}
</script>
