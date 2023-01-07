import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import compact from 'lodash/compact';

const arrayDemo: NextPageWithLayout = () => {
  const path = [
    {
      chainId: 56,
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      isNative: false,
      isToken: true,
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      projectLink: 'https://www.binance.org',
    },
    {
      chainId: 56,
      decimals: 18,
      symbol: 'CAKE',
      name: 'PancakeSwap Token',
      isNative: false,
      isToken: true,
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      projectLink: 'https://pancakeswap.finance/',
    },
  ];

  return (
    <div className='flex flex-col justify-start items-start gap-2 p-4'>
      <div className='space-x-4'>
        <Button>lodash compact([0, 1, false, 2, &apos;&apos;, null, 3])</Button>
        <span>{compact([0, 1, false, 2, '', null, 3])}</span>
      </div>
      <div className='space-x-4'>
        <Button>[65, 44, 12, 4] Reduce Total</Button>
        <span>
          {[65, 44, 12, 4].reduce((memo, curr) => {
            return memo + curr;
          })}
        </span>
      </div>
      <div className='space-x-4'>
        <Button>Reduce Path</Button>
        <span className='break-all'>
          {JSON.stringify(
            path.reduce<string[]>((memo, curr) => {
              memo.push(curr.address);
              return memo;
            }, [])
          )}
        </span>
      </div>
    </div>
  );
};

arrayDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default arrayDemo;
