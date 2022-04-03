import type { AppProps } from "next/app";

import "../index.css";
import "../components/portal.css";
import "../components/firefly.css";

const MyApp = function ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
};

export default MyApp;
