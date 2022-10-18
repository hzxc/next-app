import { Button } from 'components';
import { Transition } from 'components';
import { useToggle } from 'hooks/useToggle';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { Layout } from 'components/layout';

const TransitionDemo: NextPageWithLayout = () => {
  const { visible, toggle } = useToggle();
  return (
    <div className='p-4 space-y-2'>
      <Button onClick={toggle}>Toggle</Button>
      <Transition visible={visible} timeout={300} classNames='fade-modal'>
        <p className='text-blue-600/100'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/90'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/80'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/70'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/60'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/50'>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className='text-blue-600/40'>
          The quick brown fox jumps over the lazy dog.
        </p>
      </Transition>
      <Transition visible={visible} timeout={300} classNames='zoom-in-right'>
        <div>
          <Button>Base Button</Button>
        </div>
      </Transition>
      <Transition visible={visible} timeout={300} classNames='zoom-in-top'>
        <div>
          <p className='text-blue-600/100'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/90'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/80'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/70'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/60'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/50'>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className='text-blue-600/40'>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </Transition>
    </div>
  );
};

TransitionDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TransitionDemo;
