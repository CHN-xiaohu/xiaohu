import { Link, useIntl } from 'umi';
import { Result, Button } from 'antd';

export default () => {
  const intl = useIntl();

  return (
    <Result
      status="404"
      title="404"
      style={{
        background: 'none',
      }}
      subTitle={intl.formatMessage({
        id: 'BLOCK_NAME.description.404',
        defaultMessage: 'Sorry, the page you visited does not exist.',
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
