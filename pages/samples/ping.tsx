import axios, { AxiosError } from 'axios';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { bscUrl, getBestBscProvider } from 'conf';

const PingPage: NextPageWithLayout = () => {
  const [axiosRet, setAxiosRet] = useState<any>();

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
        .options(url, {
          timeout: 3000,
          // proxy: {
          //   protocol: 'http',
          //   host: '127.0.0.1',
          //   port: 7890,
          // },
        })
        .then((data) => {
          // console.log(data);
          duration = dayjs().valueOf() - start;
        })
        .catch((err: AxiosError) => {
          console.log(err);
          if (err.response?.status && err.response.status >= 400) {
            duration = 9999;
          } else if (err.code === 'ECONNABORTED') {
            duration = 8888;
          } else {
            duration = dayjs().valueOf() - start;
          }

          // return { url: url, duration: duration };
        });
      // .finally(() => {
      //   duration = dayjs().valueOf() - start;
      // });

      return { url: url, duration: duration };
      // return axios.options(url, { timeout: 3000 });
    };

    Promise.all([
      ping('https://bsc-dataseed.binance.org'),
      ping('https://bsc-dataseed1.binance.org'),
      ping('https://bsc-dataseed2.binance.org'),
      ping('https://bsc-dataseed3.binance.org'),
      ping('https://bsc-dataseed4.binance.org'),
      ping('https://bsc-dataseed1.defibit.io'),
      ping('https://bsc-dataseed2.defibit.io'),
      ping('https://bsc-dataseed3.defibit.io'),
      ping('https://bsc-dataseed4.defibit.io'),
      ping('https://bsc-dataseed1.ninicoin.io'),
      ping('https://bsc-dataseed2.ninicoin.io'),
      ping('https://bsc-dataseed3.ninicoin.io'),
      ping('https://bsc-dataseed4.ninicoin.io'),
      ping('https://tokens.pancakeswap.finance/pancakeswap-extended.json'),
      ping('https://ifconfig.me/'),
      ping('http://www.gstatic.com/generate_204'),
      ping('https://www.google.com'),
      ping('https://api.binance.com/api/v3/time'),
      ping('https://api.mexc.com/api/v3/time'),
    ]).then((results) => {
      const sortRet = results.sort((a, b) => {
        return a.duration - b.duration;
      });
      setAxiosRet(sortRet);
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
        headers: { Accept: '*/*', ContentType: 'application/json' },
        proxy: {
          protocol: 'http',
          host: '127.0.0.1',
          port: 7890,
        },
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

  const fetchClick = () => {
    fetch('https://api.binance.com/api/v3/time', {
      // fetch('/mexc/api/v3/time', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const axiosClick = () => {
    axios
      // .get('https://api.binance.com/api/v3/time')
      //   // url: 'https://ifconfig.me/',
      //   // url: 'http://www.gstatic.com/generate_204',
      //   // url: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
      //   url: 'https://api.binance.com/api/v3/time',
      //   // url: 'https://api.mexc.com/api/v3/time',
      // .get('https://ifconfig.me/')
      // .get('http://www.gstatic.com/generate_204')
      // .get('https://tokens.pancakeswap.finance/pancakeswap-extended.json')
      .options('https://api.mexc.com/api/v3/time')
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        console.log('----------------');
        // always executed
      });
  };

  const axios1Click = () => {
    axios({
      method: 'options',
      // url: 'https://ifconfig.me/',
      // url: 'http://www.gstatic.com/generate_204',
      // url: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
      url: 'https://api.binance.com/api/v3/time',
      // url: 'https://api.mexc.com/api/v3/time',
    })
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        console.log('----------------');
        // always executed
      });
  };

  return (
    <div className='flex items-center flex-wrap p-4 gap-2'>
      <Button onClick={handleClick}>Ping</Button>
      <Button
        onClick={() => {
          console.log(bscUrl);
        }}
      >
        get bsc url
      </Button>
      <Button onClick={getServerTime}>Get Server Time</Button>
      <Button onClick={fetchClick}>Fetch</Button>
      <Button onClick={axiosClick}>Axios</Button>
      <Button onClick={axios1Click}>Axios1</Button>

      <div>{JSON.stringify(axiosRet)}</div>
    </div>
  );
};

PingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PingPage;
