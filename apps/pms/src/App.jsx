import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ConfigProvider, Spin } from 'antd';
import { MsalAuthProvider, createMsalInstanceFromConfig } from '@codeit/auth/msal';

export function App() {
  return (
    <MsalAuthProvider getInstance={createMsalInstanceFromConfig}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            colorPrimary: '#f7931d',
            colorText: '#4b6979',
          },
        }}
      >
        <Suspense fallback={<Spin />}>
          <RouterProvider router={router} />
        </Suspense>
      </ConfigProvider>
    </MsalAuthProvider>
  );
}

export default App;
