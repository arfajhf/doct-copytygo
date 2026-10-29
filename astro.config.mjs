import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap(), starlight({
    favicon: '/logo.png', title: 'CopyTyGo', description: 'Framework full-stack Go + TypeScript. Dokumentasi resmi CopyTyGo v5.',
    defaultLocale: 'root', locales: {root: {label:'Bahasa Indonesia', lang:'id'}},
    logo: {src: './public/logo.png', replacesTitle: false},
    social: [{icon:'github',label:'GitHub',href:'https://github.com/arfajhf/copytygo'}],
    customCss: ['./src/styles/custom.css'],
    components: {Header: './src/components/Header.astro'},
    sidebar: [
      {label:'Mulai di sini', items:[{label:'Pengantar',slug:'docs/v5'},{label:'Instalasi',slug:'docs/v5/installation'},{label:'Getting Started',slug:'docs/v5/getting-started'}]},
      {label:'Framework', items:['cli','authentication','database','migration','resource-generator','frontend','queue','scheduler','studio','deployment'].map(slug=>({slug:`docs/v5/${slug}`}))},
      {label:'Ekosistem', items:[{label:'Examples',slug:'examples'},{label:'Releases',slug:'releases'},{label:'Changelog',slug:'changelog'}]}
    ]
  })]
});
