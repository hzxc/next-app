import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Fonts: NextPageWithLayout = () => {
  return (
    <div className='font-sans p-4'>
      <p>Normal:Todos os seres humanos nascem livres e iguais em dignidade</p>
      <p className='font-kanit font-normal text-base'>
        kanit: Todos os seres humanos nascem livres e iguais em dignidade
      </p>
    </div>
  );
};

Fonts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Fonts;
