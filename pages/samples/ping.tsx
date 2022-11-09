import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import { Button } from 'components';
import ping from 'ping.js/dist';

const PingPage: NextPageWithLayout = () => {
  const pingClick = () => {};

  return (
    <div className='p-4'>
      <Button onClick={pingClick}>Ping</Button>
    </div>
  );
};

PingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PingPage;
