import { Link, useIntl } from 'umi';
import { Result, Button } from 'antd';

export default () => {
  const intl = useIntl();

  return (
    <Result
      status="403"
      title="403"
      style={{
        background: 'none',
      }}
      subTitle={intl.formatMessage({
        id: 'BLOCK_NAME.description.403',
        defaultMessage: "Sorry, you don't have access to this page.",
      })}
      extra={
        <Link to="/">
          <Button type="primary">
            {intl.formatMessage({ id: 'BLOCK_NAME.exception.back', defaultMessage: 'Back Home' })}
          </Button>
        </Link>
      }
    />
  );
};
