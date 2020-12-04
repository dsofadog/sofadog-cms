import 'styles/globals.css';
import 'react-quill/dist/quill.snow.css';

import { LayoutProvider } from 'contexts';

function MyApp({ Component, pageProps }) {

  return (

    <LayoutProvider>
      <Component {...pageProps} />
    </LayoutProvider>

  )
}

export default MyApp
