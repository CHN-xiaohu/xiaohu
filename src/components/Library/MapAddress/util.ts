export const formatPlaceInfo = (
  addressComponent: AMap.Geocoder.ReGeocodeResult['regeocode']['addressComponent'],
) => {
  let { city, district } = addressComponent;

  // 这三个直辖市的行政区域划分跟下面的不一样，可以跳过填补处理
  const skipProvinceArr = ['重庆市', '上海市', '北京市', '天津市'];

  if (!skipProvinceArr.includes(addressComponent.province)) {
    if (!addressComponent.city) {
      // 没有城市，比如海南省的直辖县，它们就是没有城市的划分，直接到县，所以这里的处理就是将县区顶上，填补 city 的值，以此递推
      city = addressComponent.district; // 县区 ==> 市
      district = addressComponent.township; // 镇 ==> 县区
    } else if (!addressComponent.district) {
      // 没有县区，比如中山/东莞市，它们就是没有划分县区级别的行政区域，直接到镇/街道，所以这里的处理是将镇顶上，填补 district 的值，以此递推
      district = addressComponent.township; // 镇 ==> 县区
    }
  }

  return [addressComponent.province, city, district];
};
