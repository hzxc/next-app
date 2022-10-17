import { Menu, MenuItem, SubMenu } from 'components/menu';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className='font-kanit fixed top-0 right-0 w-64 h-screen p-4 bg-zinc-100 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600/60 scrollbar-track-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
      <Menu defaultOpenSubMenus={[]}>
        <MenuItem>
          <Link href='/'>Home</Link>
        </MenuItem>
        <MenuItem>
          <Link href='/pancake'>Pancake</Link>
        </MenuItem>
        <MenuItem>
          <Link href=''>Uniswap</Link>
        </MenuItem>
        <MenuItem>
          <Link href=''>Shibaswap</Link>
        </MenuItem>
        <SubMenu title='Ethers'>
          <MenuItem>
            <Link href='/samples/ethers'>Base</Link>
          </MenuItem>
        </SubMenu>
        <SubMenu title='Samples'>
          <MenuItem>
            <Link href='/samples/env'>Env Page</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/counter'>Redux Counter</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/fonts'>Fonts</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/button'>Button</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/menu'>Menu</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/toggle'>Toggle</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/modal'>Modal</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/pan-menu'>Pan Menu</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/transition'>Transition</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/tab'>Tab</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/menu-button'>Menu Button</Link>
          </MenuItem>
        </SubMenu>
        <SubMenu title='Wagmi'>
          <MenuItem>
            <Link href='/samples/wagmi/token-info'>Token Info</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/wagmi/contract-read'>Contract Read</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/wagmi'>Getting Started</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/wagmi/connect-wallet'>Connect Wallet</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/wagmi/ens'>ENS</Link>
          </MenuItem>
          <MenuItem>
            <Link href='/samples/wagmi/send-transaction'>Send Transaction</Link>
          </MenuItem>
        </SubMenu>
        <SubMenu title='Binance Smart Chain'>
          <MenuItem>
            <Link href='/samples/bsc'>Link</Link>
          </MenuItem>
        </SubMenu>
      </Menu>
    </nav>
  );
}