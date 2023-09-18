// import COS_SDK from 'cos-js-sdk-v5';
// import { AppConfig } from '@/config';

// import { Base } from './Base';
// import { getFileDirPrefix } from './Util';

// const config = AppConfig.cos;

// export class COS extends Base {
//   getTokenUri = `${config.domain}/cosPolicy/${config.secretMaps.development}`

//   uploadTokenCacheKey = 'COS_UPLOAD_TOKEN_CACHE_KEY';

//   uploadTokenCackeExpire = 1800;

//   static createCOS(tokenData: any) {
//     return new COS_SDK({
//       getAuthorization(options: any, callback: any) {
//         const { credentials, expiredTime } = tokenData;

//         callback({
//           TmpSecretId: credentials.tmpSecretId,
//           TmpSecretKey: credentials.tmpSecretKey,
//           XCosSecurityToken: credentials.sessionToken,
//           ExpiredTime: expiredTime,
//         });
//       },
//     })
//   }

//   static cos(): Promise<any> {
//     const self = new COS();
//     const data = self.getUploadTokenCache();

//     const timestamp = new Date().getTime()
//     if (!data || (timestamp > data?.expireTimestamp || 0)) {
//       return self.getAuthorization()
//         .then(async() => {
//           const result = await this.cos()

//           return result;
//         })
//     }

//     return Promise.resolve(this.createCOS(data.value))
//   }

//   static uploadFile<T = any>(file: File, extraParameters: any = {}) {
//     return new Promise<T>(async(resolve, reject) => {
//       // 现在默认添加前缀，后面可以剥离为可配置
//       // 生成格式： XXX/2019-05-21/xxx.xx
//       const key = [
//         String(config.uploadPrefix || ''),
//         extraParameters.extraPrefix,
//         this.generateDateFilePath(getFileDirPrefix(file), file.name)
//       ].filter(Boolean)
//         .join('')

//       const cos = await this.cos()

//       cos.putObject({
//         Bucket: config.bucket,
//         Region: config.region,
//         Key: key,
//         Body: file,
//         onProgress(info: { percent: number }) {
//           extraParameters.onProgress && extraParameters.onProgress(Number(info.percent * 10000) / 100)
//         },
//       }, (err: any) => {
//         err ? reject(new Error(JSON.stringify(err))) : resolve(`${config.cdnDomain}/${key}` as any);
//       });
//     })
//   }
// }
