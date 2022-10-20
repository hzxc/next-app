import { IconButton } from 'components';
import { Layout } from 'components/layout';
import { utils } from 'ethers';
import { useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';

const Index: NextPageWithLayout = () => {
  const { data, isFetching } = useCakePrice();
  useEffect(() => {
    console.log(isFetching ? 'fetching' : 'idle');
  }, [isFetching]);
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

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
