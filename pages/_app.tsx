import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Backendless from 'backendless';

function MyApp({ Component, pageProps }: AppProps) {
    Backendless.initApp(
        '2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00',
        '7AF7BA66-76AA-4745-9E9B-54E91012A820'
    );
    return <Component {...pageProps} />;
}

export default MyApp;
