import { strRandom, isStr, hasOwnProperty } from '@/utils';

export { strRandom, isStr, hasOwnProperty };

const verifyFileType = (value: string, type: 'image' | 'video' | 'audio') =>
  value.indexOf(type) === 0;
export const isImage = (type: any) => verifyFileType(String(type), 'image');
export const isVideo = (type: any) => verifyFileType(String(type), 'video');

export const generateImageObject = (url: string, uid?: string) => ({
  uid: uid || strRandom(16),
  name: url,
  status: 'done',
  url,
  thumbUrl: url,
});

export const getImageWidthAndHeightBySrc = (src: string) =>
  new Promise<{ width: number; height: number; src: string }>((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const imageEl = new Image();
    imageEl.src = src;
    imageEl.onload = () => {
      resolve({ width: Number(imageEl.width), height: Number(imageEl.height), src });
    };

    imageEl.onerror = () => reject(new Error(`${src} 获取失败`));
  });

// 获取图片的宽高度
export const getImageWidthAndHeight = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.readAsDataURL(file as any);

    reader.onload = () => {
      const base64 = reader.result;

      getImageWidthAndHeightBySrc(base64 as string)
        .then(resolve)
        .catch(reject);
    };

    reader.onerror = () => reject(new Error('获取失败'));
  });

export const getVideoInfo = (file: File) =>
  new Promise<HTMLVideoElement>((resolve) => {
    const url = URL.createObjectURL(file);
    const audioElement = new Audio(url);

    audioElement.addEventListener('loadedmetadata', (e: any) => {
      resolve(e.path[0]);
    });
  });

// 获取视频第一帧
export const getFirstFrameOfVideo = (
  path: string,
  { width, height }: { width: number; height: number },
) => {
  const videoElement = document.createElement('VIDEO') as HTMLVideoElement;
  videoElement.setAttribute('width', `${width}px`);
  videoElement.setAttribute('height', `${height}px`);
  videoElement.setAttribute('controls', 'controls');
  videoElement.setAttribute('src', path);
  videoElement.style.position = 'fixed';
  videoElement.style.top = '-999999px';
  videoElement.style.zIndex = '-1000';
  videoElement.crossOrigin = 'anonymous';
  videoElement.autoplay = true;
  videoElement.muted = true;
  document.body.appendChild(videoElement);

  return new Promise<string>((resolve) => {
    videoElement.addEventListener(
      'canplay',
      // 'play',
      function i(this: HTMLVideoElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;

        ctx?.drawImage(this, 0, 0, canvas.width, canvas.height);
        const src = canvas.toDataURL('image/jpeg');

        resolve(src);
      },
      { once: true },
    );
  }).then((result) => {
    document.body.removeChild(videoElement);

    return result;
  });
};

// 验证图片的高宽度
export const verifyImageWidthAndHeight = async (
  file: File,
  maxImageWidth: number,
  maxImageHeight: number,
) => {
  try {
    const { width, height } = await getImageWidthAndHeight(file);

    if (width > maxImageWidth) {
      return `当前上传宽度上限为 ${maxImageWidth}px, 当前宽度为 ${width}px`;
    }

    if (height > maxImageHeight) {
      return `当前上传高度上限为 ${maxImageHeight}px, 当前高度为 ${height}px`;
    }

    return '';
  } catch (error) {
    return (error as Error).message;
  }
};

export const abort = (msg: string) => {
  throw new Error(msg);
};
