import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';

const TimeDemo: NextPageWithLayout = () => {
  return (
    <div className='p-8'>
      <p>&apos;单引号&apos;</p>
      <p>&quot;双引号&quot;</p>
      <p>
        {dayjs().unix()} --- {JSON.stringify(BigNumber.from(dayjs().unix()))}
        --- BigNumber
      </p>
      <p>{dayjs().unix()} --- dayjs().unix()</p>
      <p>
        {Math.floor(Date.now() / 1000) + 1800} --- Math.floor(Date.now() / 1000)
        + 1800
      </p>

      <p>
        {dayjs().add(30, 'minute').unix()} --- dayjs().add(1,
        &apos;minute&apos;).unix()
      </p>
    </div>
  );
};

TimeDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TimeDemo;
