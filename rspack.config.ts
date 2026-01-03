import { defineConfig } from "@rspack/cli";

export default defineConfig({
  entry: {
    screeps: __dirname + "/src/index.ts",
  },
  output: {
    path: __dirname + "/dist",
  },
  target: "node10.13",
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: [/node_modules/],
      loader: "builtin:swc-loader",
      options: {
        jsc: {
          parser: {
            syntax: "typescript",
          },
        },
      },
      type: "javascript/auto",
      resolve: {
        extensions: [".ts", ".js"],
      },
    }],
  },
});
