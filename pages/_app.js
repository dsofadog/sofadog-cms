import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import 'styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import 'animate.css/animate.min.css';
import 'react-notifications-component/dist/theme.css'
import "nprogress/nprogress.css";

import dynamic from 'next/dynamic'

import ReactNotification from 'react-notifications-component'

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import store, { persistor } from 'store'

import { LayoutProvider } from 'contexts';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const TopProgressBar = dynamic(
  () => {
    return import("component/common/TopProgressBar");
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LayoutProvider>
          <TopProgressBar />
          <ReactNotification />
          <Component {...pageProps} />
        </LayoutProvider>
      </PersistGate>
    </Provider>

  )
}

export default MyApp
