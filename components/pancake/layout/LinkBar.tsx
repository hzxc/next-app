import { IconButton, ToggleButton } from 'components';
import TailSvg from 'public/images/pancake/tail.svg';
import Image from 'next/image';
import ArrowUpRight from 'public/images/pancake/arrowUpRight.svg';

export const LinkBar: React.FC = () => {
  return (
    <div className='flex xs:flex-col lg:flex-row items-center justify-between pt-4 px-8 w-full'>
      <div className='flex items-center xs:flex-col md:flex-row gap-4'>
        <ToggleButton
          className='w-36 font-semibold hover:opacity-70 border-violet-200 bg-[#7a6eaa]'
          checked={false}
          leftEl={<span className='text-white'>V2</span>}
          rightEl={<>V1(old)</>}
          shadowColor='#eeeaf4'
          checkedShadowColor='#666171'
          spread={'1px'}
        />
        <IconButton
          className='text-[#1fc7d4] font-semibold hover:opacity-70 hover:underline'
          rightIcon={<ArrowUpRight className='w-6 h-6 text-cyan-500' />}
        >
          Convert ERC-20 to BEP-20
        </IconButton>
      </div>
      <div className='flex items-center gap-8'>
        <button className='font-semibold text-white bg-[#7a6eaa] rounded-xl w-32 h-12  hover:opacity-70 active:translate-y-px active:shadow-none'>
          <div className='relative flex justify-center'>
            <span>Need Help ?</span>
            <TailSvg className='text-[#7a6eaa] absolute bottom-0 right-[-20px]' />
          </div>
        </button>
        <div className='relative w-40 h-28'>
          <Image
            alt='help.png'
            layout='fill'
            priority
            src='/images/pancake/help.png'
          />
        </div>
      </div>
    </div>
  );
};
