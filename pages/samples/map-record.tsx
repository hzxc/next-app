import { NextPage } from 'next';
import { Button } from 'components';
import { useToggle } from 'hooks/useToggle';
import { TokenModal } from 'components/pancake';
import { Layout } from 'components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { ChainId } from 'eth';

const RecordDemo: NextPageWithLayout = () => {
  // const [rc, setRc] = useState<Record<number, string>>({
  //   [1]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
  //   [56]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  //   [97]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
  // });

  // const [mp, setMp] = useState<{ [chainId: number]: string }>({
  //   [1]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
  //   [56]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  //   [97]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
  // });

  let record: Record<number, string> = {
    [1]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
    [56]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    [97]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
  };
  record[99] = 'test';

  let map: { [chainId: number]: string } = {
    [1]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
    [56]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    [97]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
  };
  map[99] = 'test';

  return (
    <Layout>
      <div className='p-8'>
        <Button onClick={() => {}}>Change</Button>
        <div>
          <span>Record: </span>
          <p className='break-all'>{JSON.stringify(record)}</p>
          <p>{record[ChainId.ETHEREUM]}</p>
        </div>
        <div>
          <span>Map: </span>
          <p className='break-all'>{JSON.stringify(map)}</p>
          <p>{map[ChainId.BSC]}</p>
        </div>
        <div>record[11]:{typeof record[11]}</div>
      </div>
    </Layout>
  );
};

RecordDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RecordDemo;
