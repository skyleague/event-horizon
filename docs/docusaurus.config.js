// @ts-check

const package = require('../package.json')
const [organizationName, projectName] = package.name.replace('@', '').split('/')
const url = new URL(package.homepage)

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: package.name,
    tagline: package.description,
    url: url.origin,
    baseUrl: url.pathname,
    trailingSlash: false,
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    organizationName,
    projectName,

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    plugins: [
        [
            'docusaurus-plugin-typedoc-api',
            {
                projectRoot: require('path').join(__dirname, '..'),
                packages: ['.'],
            },
        ],
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        {
            navbar: {
                title: package.name,
                logo: {
                    alt: 'Logo',
                    src: 'img/logo.png',
                    srcDark: 'img/logow.png',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'intro',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        to: 'api',
                        label: 'API',
                        position: 'left',
                    },
                    {
                        href: package.repository.url,
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [],
                copyright: `Copyright © ${new Date().getFullYear()} SkyLeague Technologies B.V.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        },
}

module.exports = config
