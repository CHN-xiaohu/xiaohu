import { useStoreState } from '@/foundations/Model/Hooks/Model';

import AdTemplateOne from './AdTemplate/AdTemplateOne';
import AdTemplateTwo from './AdTemplate/AdTemplateTwo';
import AdTemplateThree from './AdTemplate/AdTemplateThree';

import SingleTemplate from './CommonTemplate/SingleTemplate';
import AdTemplateSix from './AdTemplate/AdTemplateSix';
import AdTemplateSeven from './AdTemplate/AdTemplateSeven';
import MenuTemplate from './MenuTemplate';
import SwiperTemplate from './SwiperTemplate/index';
import styles from './style.less';

import type { TemplateCodeType } from '../../../Constant';

export type ListItem = {
  label?: string;
  picUrl: string;
  title?: string;
};

export type ListType = ListItem[];

const Layout = () => {
  const {
    previewList = Array(10).fill({}),
    templateCode = 'ADVERT_TEMPLATE_ONE' as TemplateCodeType,
  } = useStoreState('programa');

  const renderItem = () => {
    switch (templateCode) {
      case 'ADVERT_TEMPLATE_ONE':
        return <AdTemplateOne dataList={previewList} />;
      case 'ADVERT_TEMPLATE_TWO':
        return <AdTemplateTwo dataList={previewList} />;
      case 'ADVERT_TEMPLATE_THREE':
        return <AdTemplateThree dataList={previewList} />;
      case 'ADVERT_TEMPLATE_FOUR':
        return <SwiperTemplate dataList={previewList} />;
      case 'ADVERT_TEMPLATE_FIVE':
        return <SingleTemplate dataList={previewList} width={710} height={200} />;
      case 'ADVERT_TEMPLATE_SIX':
        return <AdTemplateSix dataList={previewList} />;
      case 'ADVERT_TEMPLATE_SEVEN':
        return <AdTemplateSeven dataList={previewList} />;
      case 'ADVERT_TEMPLATE_EIGHT':
        return <SwiperTemplate width={680} height={192} dataList={previewList} />;
      case 'PRODUCT_TEMPLATE_TWO':
        return <SingleTemplate dataList={previewList} width={720} height={204} />;
      case 'PRODUCT_TEMPLATE_THREE':
        return <SingleTemplate dataList={previewList} width={720} height={204} />;
      case 'NAVIGATION_TEMPLATE_ONE':
        return <MenuTemplate dataList={previewList} size={10} />;
      default:
        return null;
    }
  };

  const Content = renderItem();

  return Content && <div className={styles.wrapper}>{Content}</div>;
};

export default Layout;
