import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Index: NextPageWithLayout = () => {
  return <div className='p-8'>Wagmi</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
