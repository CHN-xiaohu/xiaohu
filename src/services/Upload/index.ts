// import { COS } from './Storages/COS'
import { Qiniu } from './Storages/Qiniu';
import type { Base } from './Storages/Base';

export class UploadStorage {
  static storage: typeof Base;

  static setStorage(type: 'cos' | 'qiniu') {
    this.storage = {
      // cos: COS,
      qiniu: Qiniu,
    }[type];
  }

  static uploadFile<T = any>(file: File, extraParameters: any = {}) {
    return this.storage.uploadFile<T>(file, extraParameters);
  }
}

// 当前默认是七牛云
UploadStorage.setStorage('qiniu');
