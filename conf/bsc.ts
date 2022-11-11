import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { ethers } from 'ethers';

const bscUrls: string[] = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',

  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed4.defibit.io',

  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://bsc-dataseed3.ninicoin.io',
  'https://bsc-dataseed4.ninicoin.io',
];

const bscTestUrls: string[] = ['https://bsctestapi.terminet.io/rpc'];

export let bscProvider = new ethers.providers.JsonRpcProvider(
  bscUrls[Math.floor(Math.random() * 13)],
  {
    name: 'bsc',
    chainId: 56,
  }
);
export let bscUrl = '';

export const getBestBscProvider = async () => {
  if (!bscUrl) {
    getBscUrl().then((ret) => {
      bscUrl = ret;
      bscProvider = new ethers.providers.JsonRpcProvider(bscUrl, {
        name: 'bsc',
        chainId: 56,
      });
    });
  }
};

export const bscTestProvider = new ethers.providers.JsonRpcProvider(
  bscTestUrls[0],
  {
    name: 'bsc testnet',
    chainId: 97,
  }
);

export const getBscUrl = () => {
  const reqs = bscUrls.map(async (item, i) => {
    const start = dayjs().valueOf();
    let duration = 0;
    await axios
      .options(item, { timeout: 1000 })
      .then(() => {
        duration = dayjs().valueOf() - start;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status && err.response.status >= 500) {
          duration = 9999;
        } else {
          duration = dayjs().valueOf() - start;
        }
      });
    // .finally(() => {
    //   duration = dayjs().valueOf() - start;
    // });

    return { url: item, duration: duration };
  });

  return Promise.all(reqs).then((results) => {
    const sortResults = results.sort((a, b) => {
      return a.duration - b.duration;
    });

    // console.log(sortResults);

    return sortResults[0].url;
  });
};
