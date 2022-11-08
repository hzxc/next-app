import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import ping from 'ping';
import { Button } from 'components';

const PingPage: NextPageWithLayout = () => {
  var hosts = ['192.168.123.88', 'google.com', 'yahoo.com', 'baidu.com'];

  const pingClick = () => {
    hosts.forEach(function (host) {
      ping.sys.probe(host, function (isAlive) {
        var msg = isAlive
          ? 'host ' + host + ' is alive'
          : 'host ' + host + ' is dead';
        console.log(msg);
      });
    });
  };

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
