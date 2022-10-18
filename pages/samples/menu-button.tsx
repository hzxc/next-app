import { Layout } from 'components/layout';
import { MenuButton, MenuButtonItem } from 'components/menu-button';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import ArrowDownSvg from 'public/images/pancake/arrowDown.svg';
import { IconButton } from 'components';

const MenuButtonDemo: NextPageWithLayout = () => {
  return (
    <div className='flex p-8'>
      <MenuButton
        title='Test'
        navBtn={
          <IconButton
            className='my-1'
            exClassName='panMb'
            leftSize='32px'
            leftSrc='/images/pancake/56.png'
            rightIcon={<ArrowDownSvg />}
            style={{ boxShadow: 'rgb(0 0 0 / 10%) 0px -2px 0px inset' }}
          >
            BNB Smart Chain
          </IconButton>
        }
      >
        <MenuButtonItem>BNB Smart Chain</MenuButtonItem>
        <MenuButtonItem>Ethereum</MenuButtonItem>
        <MenuButtonItem>BNB Smart Chain</MenuButtonItem>
        <MenuButtonItem>Ethereum</MenuButtonItem>
      </MenuButton>
    </div>
  );
};

MenuButtonDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MenuButtonDemo;
