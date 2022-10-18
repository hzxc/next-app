import { Layout } from 'components/layout';
import { Menu, MenuItem, SubMenu } from 'components/menu';
import {
  Menu as PanMenu,
  MenuItem as PanMenuItem,
  SubMenu as PanSubMenu,
} from 'components/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const MenuPage: NextPageWithLayout = () => {
  return (
    <div className='flex flex-col'>
      <Menu>
        <MenuItem>Getting Started</MenuItem>
        <MenuItem>Add React to a Website</MenuItem>
        <MenuItem>Create a New React App</MenuItem>
        <SubMenu subTitle='Opend'>
          <MenuItem>Hello World</MenuItem>
          <MenuItem>Introducing JSX</MenuItem>
          <MenuItem>Rendering Elements</MenuItem>
        </SubMenu>
        <MenuItem>CDN Links</MenuItem>
        <MenuItem>Release Channels</MenuItem>
      </Menu>

      <hr />
      <Menu mode='horizontal' className='z-[999]'>
        <MenuItem>Trade</MenuItem>
        <MenuItem>Earn</MenuItem>
        <MenuItem>Win</MenuItem>
        <MenuItem>NFT</MenuItem>
        <SubMenu subTitle='Open'>
          <MenuItem>Modal</MenuItem>
          <MenuItem>Button</MenuItem>
          <MenuItem>Pancake</MenuItem>
        </SubMenu>
      </Menu>

      <hr />

      <PanMenu mode='horizontal'>
        <PanMenuItem>Trade</PanMenuItem>
        <PanMenuItem>Earn</PanMenuItem>
        <PanMenuItem>Win</PanMenuItem>
        <PanMenuItem>NFT</PanMenuItem>
        <PanSubMenu subTitle='Open'>
          <PanMenuItem>Modal</PanMenuItem>
          <PanMenuItem>Button</PanMenuItem>
          <PanMenuItem>Pancake</PanMenuItem>
        </PanSubMenu>
      </PanMenu>

      <hr />

      <PanMenu>
        <PanMenuItem>Getting Started</PanMenuItem>
        <PanMenuItem>Add React to a Website</PanMenuItem>
        <PanMenuItem>Create a New React App</PanMenuItem>
        <PanSubMenu subTitle='Open'>
          <PanMenuItem>Hello World</PanMenuItem>
          <PanMenuItem>Introducing JSX</PanMenuItem>
          <PanMenuItem>Rendering Elements</PanMenuItem>
        </PanSubMenu>
        <PanMenuItem>CDN Links</PanMenuItem>
        <PanMenuItem>Release Channels</PanMenuItem>
      </PanMenu>

      <hr />
    </div>
  );
};

MenuPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MenuPage;
