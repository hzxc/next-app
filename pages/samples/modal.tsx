import { NextPage } from 'next';
import { Button } from 'components';
import { useToggle } from 'hooks/useToggle';
import { TokenModal } from 'components/pancake';
import { Layout } from 'components/layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';

const Modal: NextPageWithLayout = () => {
  const { visible, close, open } = useToggle(false);
  return (
    <Layout>
      <div className='m-auto p-8 space-x-2'>
        <Button onClick={open}>open modal</Button>
        <TokenModal visible={visible} modalClose={close} />
      </div>
    </Layout>
  );
};

Modal.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Modal;
