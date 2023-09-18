import dayjs from 'dayjs';
import { strRandom } from '@/utils';

export const generateRandomFileName = (fileName: string) => {
  const [, ext] = fileName.split('.');

  return `${strRandom(20)}.${ext}`;
};

export const generateDateFilePath = (dir: string, fileName: string) =>
  `${dir}/${dayjs().format('YYYY-MM-DD')}/${generateRandomFileName(fileName)}`;

export const getAuthorization = () => {
  //
};

export const getFileDirPrefix = (file: File) => {
  const dirs = {
    video: 'videos',
    audio: 'audios',
    image: 'images',
    file: 'files',
  };

  return dirs[file.type.split('/')?.[0]] || dirs.file;
};
