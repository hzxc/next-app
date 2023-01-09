import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { ChainId } from 'eth';
import { ethers } from 'ethers';

export const BEST_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: 'https://ethereum.publicnode.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org',
  [ChainId.BSC_TESTNET]: 'https://bsc-testnet.public.blastapi.io',
};

export const PROVIDER: Record<number, ethers.providers.JsonRpcProvider> = {
  [ChainId.ETHEREUM]: new ethers.providers.JsonRpcProvider(
    BEST_URL[ChainId.ETHEREUM],
    {
      name: 'ETHEREUM',
      chainId: ChainId.ETHEREUM,
    }
  ),
  [ChainId.BSC]: new ethers.providers.JsonRpcProvider(BEST_URL[ChainId.BSC], {
    name: 'BSC',
    chainId: ChainId.BSC,
  }),
  [ChainId.BSC_TESTNET]: new ethers.providers.JsonRpcProvider(
    BEST_URL[ChainId.BSC_TESTNET],
    {
      name: 'BSC_TESTNET',
      chainId: ChainId.BSC_TESTNET,
    }
  ),
};

export const NODE_URL: Record<number, string[]> = {
  [ChainId.ETHEREUM]: [
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com	',
    // 'https://mainnet.infura.io/v3/',
    // 'https://eth-rpc.gateway.pokt.network',
    // 'https://rpc.builder0x69.io',
  ],
  [ChainId.BSC]: [
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
  ],
  [ChainId.BSC_TESTNET]: [
    'https://bsc-testnet.public.blastapi.io',
    'https://data-seed-prebsc-2-s1.binance.org:8545	',
    'https://data-seed-prebsc-2-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://data-seed-prebsc-2-s3.binance.org:8545',
  ],
};

const testUrl = (chainId: number) => {
  const reqs = NODE_URL[chainId].map(async (item, i) => {
    const start = dayjs().valueOf();
    let duration = 0;
    await axios
      .options(item, { timeout: 3000 })
      .then(() => {
        duration = dayjs().valueOf() - start;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status && err.response.status >= 400) {
          duration = 9999;
        } else if (err.code === 'ERR_NETWORK') {
          duration = 9999;
        } else if (err.code === 'ECONNABORTED') {
          duration = 8888;
        } else {
          duration = dayjs().valueOf() - start;
        }
      });

    return { url: item, duration: duration };
  });

  return Promise.all(reqs).then((results) => {
    const sortResults = results.sort((a, b) => {
      return a.duration - b.duration;
    });

    return sortResults[0].url;
  });
};

export const getBestUrl = () => {
  testUrl(ChainId.ETHEREUM).then((url) => {
    BEST_URL[ChainId.ETHEREUM] = url;
    PROVIDER[ChainId.ETHEREUM] = new ethers.providers.JsonRpcProvider(
      BEST_URL[ChainId.ETHEREUM],
      {
        name: 'ETHEREUM',
        chainId: ChainId.ETHEREUM,
      }
    );
  });

  testUrl(ChainId.BSC).then((url) => {
    BEST_URL[ChainId.BSC] = url;
    PROVIDER[ChainId.BSC] = new ethers.providers.JsonRpcProvider(
      BEST_URL[ChainId.BSC],
      {
        name: 'BSC',
        chainId: ChainId.BSC,
      }
    );
  });

  testUrl(ChainId.BSC_TESTNET).then((url) => {
    BEST_URL[ChainId.BSC_TESTNET] = url;
    PROVIDER[ChainId.BSC_TESTNET] = new ethers.providers.JsonRpcProvider(
      BEST_URL[ChainId.BSC_TESTNET],
      {
        name: 'BSC_TESTNET',
        chainId: ChainId.BSC_TESTNET,
      }
    );
  });
};
