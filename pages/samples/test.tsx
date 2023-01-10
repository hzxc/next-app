import { Layout } from 'components/layout';
import { PAN_COMMON_TOKEN } from 'data/constants';
import { ChainId } from 'eth';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Test: NextPageWithLayout = () => {
  let chain: { id: number } | undefined;

  const [bnb, busd, cake, btcb] = PAN_COMMON_TOKEN[chain?.id ?? ChainId.BSC];

  return (
    <div className='p-4'>
      <p>?? --- {chain?.id ?? ChainId.BSC}</p>
      <p>? --- {chain ? chain.id : ChainId.BSC}</p>
      <p>
        {bnb.name}, {busd.name}, {cake.name}, {btcb.name}
      </p>
      <p>[]:{[] ? 'true' : 'false'}</p>
    </div>
  );
};

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Test;
