import type { ISchemaFieldComponentProps } from '@formily/antd';
import FileSaver from 'file-saver';

export const DownloadTemplate = (props: ISchemaFieldComponentProps) => {
  const handleDownLoad = () => {
    const styleType = {
      风格一: 'https://static.zazfix.com/web/images/2020-11-09/9wklEFg3ORLQQb35DDOr.png',
      风格二: 'https://static.zazfix.com/web/images/2020-11-09/K8Dg2dZrbce2F7ZzI0Ld.png',
      风格三: 'https://static.zazfix.com/web/images/2020-11-09/4k4955elWNLh7b2jFlX5.png',
      风格四: 'https://static.zazfix.com/web/images/2020-11-09/87twA77fooxL307mOcR8.png',
    }[props?.value];
    FileSaver.saveAs(styleType!, `${props.value}.jpg`);
  };

  return (
    <div
      style={{ color: '#1890ff', marginLeft: '28px', cursor: 'pointer' }}
      onClick={() => handleDownLoad()}
    >
      下载模板
    </div>
  );
};
