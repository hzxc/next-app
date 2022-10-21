import { IconButton } from 'components';
import { Layout } from 'components/layout';
import { utils } from 'ethers';
import { useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';

const Index: NextPageWithLayout = () => {
  return <div className='p-8'>Wagmi</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
