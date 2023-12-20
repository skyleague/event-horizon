import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import path from 'node:path'
import { themes } from 'prism-react-renderer'
import { description, homepage, name, repository } from '../package.json'

const [organizationName, projectName] = name.replace('@', '').split('/')
const url = new URL(homepage)

const config: Config = {
    title: name,
    tagline: description,
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
                projectRoot: path.join(__dirname, '..'),
                packages: ['.'],
            },
        ],
    ],

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        navbar: {
            title: name,
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
                    href: repository.url,
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        } satisfies Preset.ThemeConfig,
        footer: {
            style: 'dark',
            links: [],
            copyright: `Copyright © ${new Date().getFullYear()} SkyLeague Technologies B.V.`,
        },
        prism: {
            theme: themes.github,
            darkTheme: themes.dracula,
        },
    },
}

export default config
