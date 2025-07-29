import { defineConfig } from '@rslib/core';
import { pluginUnpluginVue } from 'rsbuild-plugin-unplugin-vue';

export default defineConfig({
  lib: [
    {
      bundle: true,
      format: 'esm',
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginUnpluginVue()],
  // Externalize Vue để tránh duplicate instances
  tools: {
    bundlerChain: (chain) => {
      chain.externals({
        vue: 'vue',
      });
    },
  },
});
