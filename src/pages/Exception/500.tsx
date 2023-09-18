import { Link, useIntl } from 'umi';
import { Result, Button } from 'antd';

export default () => {
  const intl = useIntl();

  return (
    <Result
      status="500"
      title="500"
      style={{
        background: 'none',
      }}
      subTitle={intl.formatMessage({
        id: 'BLOCK_NAME.description.500',
        defaultMessage: 'Sorry, the server is reporting an error.',
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
