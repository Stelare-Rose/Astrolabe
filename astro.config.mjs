// @ts-check
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';

import mdx from '@astrojs/mdx';

import svelte from '@astrojs/svelte';

import { wikilinks } from './src/plugins/satteri-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://astrolabe.starrytea.cc',
  integrations: [mdx(), svelte()],
  markdown: {
    processor: satteri({
      mdastPlugins: [wikilinks],
    }),
  },
});
