import { Menu, MenuItem, SubMenu } from 'components/pancake';
import { PanButton } from '../button';
import ArrowExitSvg from 'public/images/pancake/arrowExit.svg';
import SettingSvg from '/public/images/pancake/setting.svg';
import LanguageSvg from 'public/images/pancake/language.svg';
import { ConnectWalletModal } from '../modal/ConnectWalletModal';
import { useToggle } from 'hooks';
import { useNetwork } from 'wagmi';
import { SwitchNetworkModal } from '../modal/SwitchNetworkModal';
import { useInitConnect } from 'hooks/useInitConnect';
import { MenuButton, MenuButtonItem } from 'components/menu-button';
import { IconButton } from 'components';
import ArrowDownSvg from 'public/images/pancake/arrowDown.svg';
import WalletSvg from 'public/images/pancake/wallet.svg';
import { utils } from 'ethers';
import DotSvg from 'public/images/pancake/dot.svg';
import { useCakePrice } from 'hooks/pancake';

export const Header: React.FC = () => {
  const { visible, close, open } = useToggle(false);
  const { chain } = useNetwork();
  const [isConnected, address] = useInitConnect();
  const { data: cakePrice } = useCakePrice();

  return (
    <>
      <ConnectWalletModal visible={visible} close={close} />
      <SwitchNetworkModal
        visible={
          chain ? chain.id !== 56 && chain.id !== 97 && chain.id !== 1 : false
        }
        close={() => {}}
      />
      <div className='flex h-14 items-center justify-between border-b px-4 z-40'>
        <div className='flex items-center justify-start gap-3'>
          <IconButton
            leftSize='28px'
            className='text-black font-semibold	text-xl'
            leftSrc='/images/pancake/pancakeSwapMobile.svg'
          >
            PancakeSwap
          </IconButton>
          <Menu mode='horizontal' defaultIndex={'0-0'}>
            <SubMenu subTitle='Trade'>
              <MenuItem>Swap</MenuItem>
              <MenuItem>Limit</MenuItem>
              <MenuItem>Liquidity</MenuItem>
              <MenuItem>
                <IconButton
                  className='w-full my-[-2px]'
                  rightSize='20px'
                  rightIcon={<ArrowExitSvg />}
                >
                  Perpetual
                </IconButton>
              </MenuItem>
              <MenuItem>
                <IconButton
                  className='w-full my-[-2px]'
                  rightSize='20px'
                  rightIcon={<ArrowExitSvg />}
                >
                  Bridge
                </IconButton>
              </MenuItem>
            </SubMenu>
            <SubMenu subTitle='Earn'>
              <MenuItem>Farms</MenuItem>
              <MenuItem>Pools</MenuItem>
            </SubMenu>
            <SubMenu subTitle='Win'>
              <MenuItem>Trading Competition</MenuItem>
              <MenuItem>Prediction (BETA)</MenuItem>
              <MenuItem>Lottery</MenuItem>
              <MenuItem>Pottery (BETA)</MenuItem>
            </SubMenu>
            <SubMenu subTitle='NFT'>
              <MenuItem>Overview</MenuItem>
              <MenuItem>Collections</MenuItem>
              <MenuItem>Activity</MenuItem>
            </SubMenu>
            <SubMenu
              subTitle={
                <IconButton
                  rightSize='16px'
                  rightIcon={<DotSvg className='text-[#ed4b9e]' />}
                >
                  •••
                </IconButton>
              }
            >
              <MenuItem>Info</MenuItem>
              <MenuItem>
                <div className='flex items-center justify-between'>
                  IFO
                  <button className='px-2 py-px text-sm font-normal rounded-full border-2 text-[#ed4b9e] border-[#ed4b9e] my-[-5px]'>
                    LIVE
                  </button>
                </div>
              </MenuItem>
              <MenuItem className='border-b'>Voting</MenuItem>
              <MenuItem className='border-b'>Leaderboard</MenuItem>
              <MenuItem>
                <IconButton
                  className='w-full my-[-2px]'
                  rightSize='20px'
                  rightIcon={<ArrowExitSvg />}
                >
                  Blog
                </IconButton>
              </MenuItem>
              <MenuItem>
                <IconButton
                  className='w-full my-[-2px]'
                  rightSize='20px'
                  rightIcon={<ArrowExitSvg />}
                >
                  Doc
                </IconButton>
              </MenuItem>
            </SubMenu>
          </Menu>
        </div>
        <div className='flex items-center gap-4 justify-start'>
          <IconButton
            className='font-semibold [&>div>span:first-child]:hover:scale-125 [&>div>span:first-child]:transition-transform'
            leftSrc='/images/pancake/pancake.svg'
          >
            {cakePrice
              ? utils.formatUnits(cakePrice[1], 18).substring(0, 5)
              : undefined}
          </IconButton>
          <IconButton className='hover:opacity-70 active:translate-y-px'>
            <LanguageSvg />
          </IconButton>
          <IconButton className='hover:opacity-70 active:translate-y-px'>
            <SettingSvg />
          </IconButton>
          <MenuButton
            pos='left-[-38px]'
            title='Select a Network'
            navBtn={
              <IconButton
                className='my-3'
                exClassName='panMb'
                leftSize='32px'
                leftSrc='/images/pancake/56.png'
                rightIcon={<ArrowDownSvg />}
                style={{
                  boxShadow: 'rgb(0 0 0 / 10%) 0px -2px 0px inset',
                }}
              >
                <span className='sm:after:content-[""] md:after:content-["BNB"] lg:after:content-["BNB_Smart_Chain"] whitespace-nowrap'></span>
              </IconButton>
            }
          >
            <MenuButtonItem>
              <IconButton
                className='my-[-2px]'
                gap='gap-3'
                leftSrc='/images/pancake/56.png'
              >
                BNB Smart Chain
              </IconButton>
            </MenuButtonItem>
            <MenuButtonItem>
              <IconButton
                className='my-[-2px]'
                gap='gap-3'
                leftSrc='/images/pancake/1.png'
              >
                Ethereum
              </IconButton>
            </MenuButtonItem>
          </MenuButton>

          {isConnected && address ? (
            <MenuButton
              pos='right-0'
              navBtn={
                <IconButton
                  className='my-3 [&>div>span:first-child]:rounded-full [&>div>span:first-child]:outline [&>div>span:first-child]:outline-[#1fc7d4]'
                  exClassName='panMb'
                  leftIcon={<WalletSvg className='text-[#1fc7d4]' />}
                  rightIcon={<ArrowDownSvg />}
                  style={{
                    boxShadow: 'rgb(0 0 0 / 10%) 0px -2px 0px inset',
                  }}
                >
                  {'0x...'.concat(address.slice(-4))}
                </IconButton>
              }
            >
              <MenuButtonItem>
                <IconButton
                  className='my-[-2px]'
                  gap='gap-3'
                  leftSrc='/images/pancake/56.png'
                >
                  BNB Smart Chain
                </IconButton>
              </MenuButtonItem>
              <MenuButtonItem>
                <IconButton
                  className='my-[-2px]'
                  gap='gap-3'
                  leftSrc='/images/pancake/1.png'
                >
                  Ethereum
                </IconButton>
              </MenuButtonItem>
            </MenuButton>
          ) : (
            <PanButton
              onClick={open}
              className='sm:after:content-["Connect"] lg:after:content-["Connect_Wallet"] whitespace-nowrap	'
            ></PanButton>
          )}
          {/* <span>{chain?.id}</span> */}
        </div>
      </div>
    </>
  );
};
