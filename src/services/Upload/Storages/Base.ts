import { Request } from '@/foundations/Request';

import { generateDateFilePath as generateDateFilePathUtil } from './Util';

export abstract class Base {
  abstract getTokenUri: string;

  abstract uploadTokenCacheKey: string;

  abstract uploadTokenCackeExpire: number;

  getUploadTokenCache() {
    const cacheData = window.sessionStorage.getItem(this.uploadTokenCacheKey);

    return (cacheData && JSON.parse(cacheData)) || null;
  }

  getAuthorization() {
    return Request.get(this.getTokenUri).then((res) => {
      window.sessionStorage.setItem(
        this.uploadTokenCacheKey,
        JSON.stringify({
          expireTimestamp: new Date().getTime() + (this.uploadTokenCackeExpire - 120) * 1000,
          value: res.data,
        }),
      );
    });
  }

  static uploadFile<T>(file: File, extraParameters: any = {}): Promise<T> {
    return Promise.resolve({ file, extraParameters } as any);
  }

  static generateDateFilePath(dir: string, fileName: string) {
    return generateDateFilePathUtil(dir, fileName);
  }
}
