import "dotenv/config";
import * as esbuild from "esbuild";
import { environmentPlugin } from "esbuild-plugin-environment";

await esbuild.build({
  entryPoints: ["src/lib/inject.ts"],
  bundle: true,
  minify: true,
  outfile: "public/js/inject.js",
  plugins: [
    environmentPlugin([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]),
  ],
});
