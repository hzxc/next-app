import { Layout } from 'components/layout';
import { ChainId } from 'eth';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Test: NextPageWithLayout = () => {
  let chain: { id: number } | undefined;

  return (
    <div className='p-4'>
      <p>?? --- {chain?.id ?? ChainId.BSC}</p>
      <p>? --- {chain ? chain.id : ChainId.BSC}</p>
    </div>
  );
};

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Test;
