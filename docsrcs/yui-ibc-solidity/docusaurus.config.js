// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'yui-ibc-solidity docs',
  tagline: 'sample tagline',
  url: 'https://hyperledger-labs.github.io',
  baseUrl: '/yui-docs/yui-ibc-solidity/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'hyperledger-labs', // Usually your GitHub org/user name.
  projectName: 'yui-ibc-solidity-docs', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'yui-ibc-solidity',
        items: [
          {
            href: 'https://github.com/hyperledger-labs/yui-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/datachain_en',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/hyperledger-labs/yui-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Datachain, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'ja'],
      localeConfigs: {
        en: {
          label: 'English',
          direction: 'ltr',
        },
        fr: {
          label: '日本語',
          direction: 'ltr',
        },
      },
    },
};

module.exports = config;
