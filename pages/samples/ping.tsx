import axios from 'axios';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';
import dayjs from 'dayjs';
import { bscUrl, getBestBscProvider, getBscUrl } from 'conf';

const PingPage: NextPageWithLayout = () => {
  const handleClick = async () => {
    // const start = dayjs().valueOf();
    // console.log(start);
    // const { data: resp } = await axios.get('https://bsc-dataseed2.defibit.io');
    // console.log(resp);
    // axios
    //   .options('https://bsc-dataseed2.defibit1.io', { timeout: 1000 })
    //   .then(function (response) {
    //     console.log(response.status);
    //   })
    //   .catch(function (error) {})
    //   .finally(function () {
    //     const end = dayjs().valueOf();
    //     console.log(end - start);
    //   });

    const ping = async (url: string) => {
      const start = dayjs().valueOf();
      let duration = 0;
      await axios
        .options(url, { timeout: 1000 })
        .catch(() => {})
        .finally(() => {
          duration = dayjs().valueOf() - start;
          // return duration;
        });

      return { url: url, duration: duration };
      // return axios.options(url, { timeout: 3000 });
    };

    Promise.all([
      ping('https://bsc-dataseed2.defibit.io'),
      ping('/binance/api/v3/time'),
      ping('/mexc/api/v3/time'),
      ping('/gstatic/generate_204'),
    ]).then((results) => {
      const sortRet = results.sort((a, b) => {
        return a.duration - b.duration;
      });
      console.log(sortRet);
      // console.log(results);
      // results.map((item, i) => {});
      // console.log(results);
    });
  };

  useEffect(() => {
    getBestBscProvider();
  }, []);

  return (
    <div className='font-sans p-4 space-x-2'>
      <Button onClick={handleClick}>axios</Button>
      <Button
        onClick={() => {
          console.log(bscUrl);
        }}
      >
        get bsc url
      </Button>
    </div>
  );
};

PingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PingPage;
