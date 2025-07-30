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
  tools: {
    bundlerChain: (chain) => {
      chain.externals({
        vue: 'vue',
      });
    },
  },
});
