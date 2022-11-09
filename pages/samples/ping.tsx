import axios from 'axios';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const PingPage: NextPageWithLayout = () => {
  const handleClick = async () => {
    axios
      .get('https://bsc-dataseed2.defibit.io')
      // .get('https://api.binance.com/api/v3/time')
      .then(function (response) {
        // handle success
        console.log(response.status);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        console.log(error.response?.status);
      })
      .finally(function () {
        // always executed
      });
  };
  return (
    <div className='font-sans p-4'>
      <Button onClick={handleClick}>axios</Button>
    </div>
  );
};

PingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PingPage;
