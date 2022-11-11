import axios, { AxiosError } from 'axios';
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

  const getServerTime = () => {
    // getBscUrl();
    axios
      .get('/mexc/api/v3/time', {
        // .get('https://api.mexc.com/api/v3/time', {
        // timeout: 2000,
        // headers: { Accept: '*/*', ContentType: 'application/json' },
        // proxy: {
        //   protocol: 'http',
        //   host: '127.0.0.1',
        //   port: 7890,
        // },
      })
      .then((ret) => {
        console.log('----------------------');
        console.log('get /mexc/api/v3/time');
        console.log('status', ret.status);
        console.log(ret);
      })
      .catch((err: AxiosError) => {
        console.log('----------------------');
        console.log('catch /mexc/api/v3/time');
        console.log('status', err.response?.status);
        console.log(err);
      });
    // axios
    //   .options('/pancake/pancakeswap-extended.json')
    //   .then((ret) => {
    //     console.log('options /pancake/pancakeswap-extended.json');
    //     console.log(ret.status);
    //   })
    //   .catch((err: AxiosError) => {
    //     console.log(err);
    //     console.log('catch /pancake/pancakeswap-extended.json');
    //     console.log(err.response?.status);
    //   });
    // axios.options('/binance/api/v3/time').then((ret) => {
    //   console.log('options /binance/api/v3/time');
    //   console.log(ret);
    // });
    // axios.options('/gstatic/generate_204').then((ret) => {
    //   console.log('options generate_204');
    //   console.log(ret);
    // });
    // axios.get('https://api.binance.com/api/v3/time').then((ret) => {
    //   console.log('get https://api.binance.com/api/v3/time');
    //   console.log(ret);
    // });
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
      <Button onClick={getServerTime}>Get Server Time</Button>
    </div>
  );
};

PingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PingPage;
