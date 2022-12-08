import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';

const Swap: NextPageWithLayout = () => {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  return (
    <div className='flex flex-col items-center justify-center gap-4 p-8'>
      <input
        className='border w-96'
        type='text'
        placeholder='TokenA'
        value={tokenA}
        onChange={(e) => {
          setTokenA(e.target.value);
        }}
      />
      <input
        className='border w-96'
        type='text'
        placeholder='tokenB'
        value={tokenB}
        onChange={(e) => {
          setTokenB(e.target.value);
        }}
      />
      <Button>Sort</Button>
      <p>{tokenA < tokenB ? tokenA + ',' + tokenB : tokenB + ',' + tokenA}</p>
    </div>
  );
};

Swap.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Swap;
