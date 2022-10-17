import { IconButton } from 'components';
import { Layout } from 'components/layout';
import { utils } from 'ethers';
import { useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';

const Wagmi: NextPageWithLayout = () => {
  const { data } = useCakePrice();
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className='p-8'>
      <IconButton
        className='font-semibold [&>div>span:first-child]:hover:scale-125 [&>div>span:first-child]:transition-transform'
        leftSrc='/images/pancake/pancake.svg'
      >
        {data ? utils.formatUnits(data[1], 18) : undefined}
      </IconButton>
    </div>
  );
};

Wagmi.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Wagmi;
