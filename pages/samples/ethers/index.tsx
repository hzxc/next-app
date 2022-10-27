import { spawn } from 'child_process';
import { Button, IconButton } from 'components';
import { Layout } from 'components/layout';
import { ethers, utils } from 'ethers';
import { getBnbBalance, useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect, useState } from 'react';
import { isError } from 'utils';

const Index: NextPageWithLayout = () => {
  const { data, isFetching } = useCakePrice();
  useEffect(() => {
    console.log(isFetching ? 'fetching' : 'idle');
  }, [isFetching]);

  const [bnbBal, setBnbBal] = useState('');
  const [addr, setAddr] = useState(
    '0x55cf452d43efafb505335cee7e0bb368a37c322c'
  );

  const [err, setErr] = useState('');

  const bnbBalHandler = async () => {
    getBnbBalance(addr)
      .then((d) => {
        setBnbBal(utils.formatUnits(d, 18));
        setErr('');
      })
      .catch((e) => {
        if (isError(e)) {
          setErr(e.message);
        }
      });
  };
  return (
    <div className='p-8'>
      <IconButton
        className='font-semibold [&>div>span:first-child]:hover:scale-125 [&>div>span:first-child]:transition-transform'
        leftSrc='/images/pancake/pancake.svg'
      >
        {data ? utils.formatUnits(data[1], 18) : undefined}
      </IconButton>
      <div className='space-x-4 py-4'>
        <input
          className='border w-96'
          type='text'
          value={addr}
          onChange={(e) => {
            setAddr(e.target.value);
          }}
          placeholder='account address'
        />
        <Button onClick={bnbBalHandler}>get bnb balance</Button>
        {bnbBal ? <span>{bnbBal}</span> : undefined}
      </div>
      <div>{err}</div>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
