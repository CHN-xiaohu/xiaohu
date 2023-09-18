import ImageGallery from 'react-image-gallery';

import './index.less';
import { useState } from 'react';

const ImageGallerys = ({ imageList }) => {
  const [isShowFull, setIsShowFull] = useState(false);
  const handleImageList = () =>
    imageList?.map((item) => ({
      original: item.url,
      thumbnail: item.url,
      originalClass: `${!isShowFull ? 'original-class' : ''}`,
    }));

  const handleScreenChange = (type) => {
    console.log('type', type);
    setIsShowFull(type);
  };

  return (
    <ImageGallery
      items={handleImageList() || []}
      showPlayButton={false}
      showBullets
      showNav={false}
      autoPlay
      slideInterval={3000}
      lazyLoad
      onScreenChange={handleScreenChange}
    />
  );
};

export default ImageGallerys;
