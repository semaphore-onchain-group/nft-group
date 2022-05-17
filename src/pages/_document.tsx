import React from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from "next/document"
import { ServerStyleSheets } from "@mui/styles"

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage
    const materialSheets = new ServerStyleSheets

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (APP) => props => materialSheets.collect(<APP {...props} />)
      })

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps
    }
  }
  render() {
    return (
      <Html>
        <body>
          <Head></Head>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
