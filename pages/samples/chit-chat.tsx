import dayjs from 'dayjs';
import Image from 'next/image';
import { Layout } from 'components/layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';

const ChitChat: NextPageWithLayout = () => {
  return (
    <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4'>
      <div className='shrink-0'>
        <div className='relative h-12 w-12'>
          <Image
            src={`https://robohash.org/${dayjs().unix()}`}
            alt='ChitChat Logo'
            layout='fill' // required
            objectFit='cover' // change as you like
            className='rounded-full' // you can use other classes here too
          />
        </div>
      </div>
      <div>
        <div className='text-xl font-medium text-black'>ChitChat</div>
        <p className='text-slate-500'>You have a new message!</p>
      </div>
    </div>
  );
};

ChitChat.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ChitChat;
