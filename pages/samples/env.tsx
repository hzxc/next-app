import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';

const Code = (p: any) => (
  <code
    className='text-[#be00ff] before:content-["`"] after:content-["`"]'
    {...p}
  />
);

const EnvPage: NextPageWithLayout = () => {
  const appName = process.env.NAME;
  useEffect(() => {
    console.log(process.env.NAME);
  }, []);
  return (
    <div>
      <p className='text-3xl p-4'>Environment Variables with Next.js</p>
      <hr />
      <div className='p-8'>
        <table className='border-collapse border [&_td]:border [&_td]:px-2 [&_th]:border'>
          <thead>
            <tr>
              <th>Variable Name</th>
              <th>Value</th>
              <th>Added By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                NEXT_PUBLIC_<span className='text-red-500'>ENV</span>_VARIABLE
              </td>
              <td>{process.env.NEXT_PUBLIC_ENV_VARIABLE}</td>
              <td>
                <Code>.env</Code>
              </td>
            </tr>
            <tr>
              <td>
                NEXT_PUBLIC_<span className='text-red-500'>ENV_LOCAL</span>
                _VARIABLE
              </td>
              <td>{process.env.NEXT_PUBLIC_ENV_LOCAL_VARIABLE}</td>
              <td>
                <Code>.env.local</Code>
              </td>
            </tr>
            <tr>
              <td>
                NEXT_PUBLIC_
                <span className='text-red-500'>DEVELOPMENT_ENV</span>_VARIABLE
              </td>

              <td>{process.env.NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE}</td>
              <td>
                <Code>.env.development</Code>
              </td>
            </tr>
            <tr>
              <td>
                NEXT_PUBLIC_<span className='text-red-500'>PRODUCTION_ENV</span>
                _VARIABLE
              </td>

              <td>{process.env.NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE}</td>
              <td>
                <Code>.env.production</Code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

EnvPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EnvPage;
