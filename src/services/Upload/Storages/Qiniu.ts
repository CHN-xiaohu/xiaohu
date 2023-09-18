import * as qiniu from 'qiniu-js';
import { AppConfig } from '@/config';

import { Base } from './Base';
import { getFileDirPrefix } from './Util';

const config = AppConfig.qiniu;

export class Qiniu extends Base {
  getTokenUri = config.domain;

  uploadTokenCacheKey = 'QINIU_UPLOAD_TOKEN_CACHE_KEY';

  uploadTokenCackeExpire = 3600;

  static getUploadToken(): Promise<string> {
    const self = new Qiniu();
    const data = self.getUploadTokenCache();

    const timestamp = new Date().getTime();
    if (!data || timestamp > data?.expireTimestamp || 0) {
      return self.getAuthorization().then(async () => {
        const result = await this.getUploadToken();

        return result;
      });
    }

    return Promise.resolve(data.value);
  }

  static uploadFile<T = any>(file: File, extraParameters: any = {}) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<T>(async (resolve, reject) => {
      // 现在默认添加前缀，后面可以剥离为可配置
      // 生成格式： XXX/2019-05-21/xxx.xx
      const key = [
        String(config.uploadPrefix || ''),
        extraParameters.extraPrefix,
        this.generateDateFilePath(getFileDirPrefix(file), file.name),
      ]
        .filter(Boolean)
        .join('');

      const uploadConfig = {
        useCdnDomain: true,
        region: qiniu.region.z2,
      };

      const putExtra = {
        fname: '',
        params: {},
        mimeType: file.type || null,
      };

      qiniu.upload(file, key, await this.getUploadToken(), putExtra, uploadConfig).subscribe({
        next(response: any) {
          const { total } = response;

          extraParameters.onProgress && extraParameters.onProgress(total.percent);
        },

        error(error: Error) {
          reject(error);
        },

        complete() {
          resolve(`${config.cdnDomain}/${key}` as any);
        },
      });
    });
  }
}
