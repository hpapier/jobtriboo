import React from 'react'
import App, { Container } from 'next/app'
import Head from "next/head";
// import CssBaseline from "@material-ui/core/CssBaseline";
import { appWithTranslation } from '../components/i18n'

import { Provider } from 'react-redux'
import store from '../store'
import JobArgument from '../context/JobArgument';


class MyApp extends App {
  renderHead() {
    return (
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
        <title>Jobtriboo</title>
      </Head>
    );
  }

  componentDidMount() {
    // crisp();
    // const crisp = () => {
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="472a8d44-35f7-44f7-b1e2-59ca80db992b";
      (function(){
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    // }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <JobArgument>
          {this.renderHead()}
          {/* <CssBaseline /> */}
          <Component {...pageProps} />
        </JobArgument>
      </Provider>
    )
  }
}

export default appWithTranslation(MyApp);