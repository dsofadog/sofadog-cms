import 'styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import 'animate.css/animate.min.css';
import 'react-notifications-component/dist/theme.css'

import ReactNotification from 'react-notifications-component'
 
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { LayoutProvider } from 'contexts';

f_config.autoAddCss = false;
library.add(fas, fab, far);

function MyApp({ Component, pageProps }) {

  return (

    <LayoutProvider>
      <ReactNotification />

      <Component {...pageProps} />
    </LayoutProvider>

  )
}

export default MyApp
