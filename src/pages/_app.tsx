import "src/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { Web3ReactProvider } from "@web3-react/core"
import { ThemeProvider } from "@mui/material/styles"
import { theme } from "src/styles"
import NavBar from "src/components/NavBar"
import { providers } from "ethers"
import Footer from "src/components/Footer"

function MyApp({ Component, pageProps }: AppProps) {
  function getLibrary(provider: any) {
    return new providers.Web3Provider(provider)
  }

  return (
    <>
      <Head>
        <title>Semaphore NFT group</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Web3ReactProvider getLibrary={(provider) => getLibrary(provider)}>
        <ThemeProvider theme={theme}>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </ThemeProvider>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
