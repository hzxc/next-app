import { IconButton } from 'components';
import { Layout } from 'components/layout';
import { Tab, TabItem } from 'components/tab';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import ArrowUpRightSvg from 'public/images/pancake/arrowUpRight.svg';

const TabDemo: NextPageWithLayout = () => {
  return (
    <div className='p-8'>
      <Tab>
        <TabItem>Swap</TabItem>
        <TabItem>Limit</TabItem>
        <TabItem>Liquidity</TabItem>
        <TabItem>Perpetual</TabItem>
        <TabItem>
          <IconButton
            className='align-baseline my-[-4px]'
            rightIcon={<ArrowUpRightSvg />}
          >
            Bridge
          </IconButton>
        </TabItem>
      </Tab>
    </div>
  );
};

TabDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TabDemo;
