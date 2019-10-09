// import NextI18Next from "next-i18next";

// import NextI18Next from 'next-i18next'
const NextI18Next = require('next-i18next').default;

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['es', 'fr']
});

const { appWithTranslation, withTranslation, Link, i18n } = NextI18NextInstance;

module.exports = {
  NextI18NextInstance,
  appWithTranslation,
  withTranslation,
  Link,
  i18n
};