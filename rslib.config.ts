import { defineConfig } from "@rslib/core";
import { pluginUnpluginVue } from "rsbuild-plugin-unplugin-vue";

export default defineConfig({
  lib: [
    {
      bundle: true,
      format: "esm",
      dts: true,
      output: {
        injectStyles: true,
      },
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginUnpluginVue() as never],
  tools: {
    bundlerChain: (chain) => {
      if (process.env.BUILD_LIB) {
        chain.externals({
          vue: "vue",
        });
      }
    },
  },
});
