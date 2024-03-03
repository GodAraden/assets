import { basename } from 'path';
import { readFile } from 'fs/promises';

import axios from 'axios';
import { MD5 } from 'crypto-js';
import * as FormData from 'form-data';

import { key, domain } from '../env';

(async () => {
  const filePath = process.argv[2];
  try {
    // 网络上的图片资源粘贴到文件中，保留原 URL
    if (/^https?:\/\//.test(filePath)) {
      console.log(filePath);
      return;
    }

    const file = await readFile(filePath);

    const formData = new FormData();
    formData.append('hold', '');
    formData.append('shared', '');
    formData.append('name', basename(filePath));
    formData.append('asset', file, basename(filePath));

    const { data } = await axios.post<string>(domain, formData, {
      headers: {
        'upload-assets-key': MD5(
          key + new Date().toLocaleDateString('zh-CN'),
        ).toString(),
      },
    });

    console.log(`${domain}${data}`);
  } catch (error) {
    console.log('Error: ', error);
  }
})();
