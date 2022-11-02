import { Button } from 'components';
import { Layout } from 'components/layout';
import { ethers } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';

const Units: NextPageWithLayout = () => {
  const [wei, setWei] = useState('');
  const [dVal, setDVal] = useState('');
  const [formatUnitsRet, setformatUnitsRet] = useState('');
  const [parseEtherRet, setParseEtherRet] = useState('');
  return (
    <div className='flex flex-col items-center justify-center p-8 gap-2'>
      <div className='space-x-2'>
        <input
          className='border w-96'
          type='text'
          placeholder='wei'
          value={wei}
          onChange={(e) => {
            setWei(e.target.value);
          }}
        />
        <span>decimals:18</span>
      </div>

      <div className='space-x-2'>
        <Button
          onClick={() => {
            if (dVal !== '') {
              setformatUnitsRet(ethers.utils.formatUnits(wei, 18));
            }
          }}
        >
          Format Units
        </Button>
        <span>{formatUnitsRet}</span>
      </div>

      <div className='space-x-2'>
        <input
          className='border w-96 '
          type='text'
          placeholder='wei'
          value={dVal}
          onChange={(e) => {
            setDVal(e.target.value);
          }}
        />
        <span>decimals:18</span>
      </div>

      <div className='space-x-2'>
        <Button
          onClick={() => {
            if (dVal !== '') {
              setParseEtherRet(ethers.utils.parseEther(dVal).toString());
            }
          }}
        >
          Parse Ether
        </Button>
        <span>{parseEtherRet}</span>
      </div>
    </div>
  );
};

Units.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Units;
