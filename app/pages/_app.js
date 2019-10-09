import React from 'react'
import App, { Container } from 'next/app'
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import { appWithTranslation } from '../components/i18n'

import { Provider } from 'react-redux'
import store from '../store'

class MyApp extends App {
  renderHead() {
    return (
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
      </Head>
    );
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        {this.renderHead()}
        <CssBaseline />
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default appWithTranslation(MyApp);