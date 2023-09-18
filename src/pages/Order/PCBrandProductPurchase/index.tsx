import { getBelongFirstDefaultDomain } from '@/pages/Product/Api';
import { UserInfoCache } from '@/services/User';
import { Card, Spin } from 'antd';

import { useEffect } from 'react';

export default function PCBrandProductPurchase() {
  const userInfo = UserInfoCache.get();

  useEffect(() => {
    getBelongFirstDefaultDomain(userInfo.tenantCode).then((res) => {
      const { data } = res;
      if (data.domainUrl) {
        const openUrl = `${data.isHttps !== 0 ? 'https' : 'http'}://${data.domainUrl.trim()}`;
        window.open(openUrl);
      }
    });
  }, []);

  return (
    <Card>
      <Spin size="large" />
    </Card>
  );
}
