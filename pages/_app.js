import '../styles/globals.css'
import { LayoutProvider } from '../contexts';

function MyApp({ Component, pageProps }) {

  return (

    <LayoutProvider>
      <Component {...pageProps} />
    </LayoutProvider>

  )
}

export default MyApp
