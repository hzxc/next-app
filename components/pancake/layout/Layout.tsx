import { Tab, TabItem } from 'components/tab';
import { ReactNode } from 'react';
import { Header } from './Header';
import ArrowUpRight from 'public/images/pancake/arrowUpRight.svg';
import { LinkBar } from './LinkBar';
import { Footer } from './Footer';
import Head from 'next/head';
import { IconButton } from 'components';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='flex flex-col h-screen overflow-x-hidden font-kanit font-normal text-base text-violet-900/80 scrollbar-thin scrollbar-thumb-violet-900/80 scrollbar-track-slate-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
      <Head>
        <title>Exchange | PancakeSwap</title>
        <link rel='icon' href='/images/pancake/pancake.svg' />
      </Head>
      <Header></Header>
      <div className='flex justify-center items-center h-[42px]'>
        <Tab>
          <TabItem>Swap</TabItem>
          <TabItem>Limit</TabItem>
          <TabItem>Liquidity</TabItem>
          <TabItem>
            <IconButton
              className='w-full my-[-2px]'
              rightIcon={
                <ArrowUpRight className='w-5 h-5 text-violet-900/80' />
              }
            >
              Blog
            </IconButton>
          </TabItem>
          <TabItem>
            <IconButton
              className='w-full my-[-2px]'
              rightIcon={
                <ArrowUpRight className='w-5 h-5 text-violet-900/80' />
              }
            >
              Bridge
            </IconButton>
          </TabItem>
        </Tab>
      </div>
      <div className='shrink-0 min-h-[calc(100vh-98px)] bg-gradient-to-br from-cyan-50 to-purple-50'>
        <div className='flex flex-col justify-between items-center pt-8 h-full'>
          <div>{children}</div>
          <LinkBar />
        </div>
      </div>
      <Footer />
    </div>
  );
};
