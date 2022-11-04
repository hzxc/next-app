import { Button } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import compact from 'lodash/compact';

const Lodash: NextPageWithLayout = () => {
  const compactFunc = () => {
    console.log(compact([0, 1, false, 2, '', 3]));
  };
  return (
    <div className='p-4'>
      <Button onClick={compactFunc}>compact</Button>
    </div>
  );
};

Lodash.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Lodash;
