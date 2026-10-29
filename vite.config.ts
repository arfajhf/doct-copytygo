import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { generateSite } from "./scripts/generate.ts";
const project = fileURLToPath(new URL(".", import.meta.url));
const root = path.join(project, ".generated");
function htmlEntries(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() && entry.name !== "public"
      ? htmlEntries(path.join(dir, entry.name))
      : entry.name.endsWith(".html")
        ? [path.join(dir, entry.name)]
        : [],
  );
}
export default defineConfig({
  root,
  publicDir: path.join(root, "public"),
  appType: "mpa",
  server: { fs: { allow: [project] }, strictPort: true },
  preview: { strictPort: true },
  build: {
    outDir: path.join(project, "dist"),
    emptyOutDir: true,
    rollupOptions: { input: htmlEntries(root) },
  },
  plugins: [
    {
      name: "copytygo-markdown-reload",
      configureServer(server) {
        const content = path.join(project, "src/content"),
          data = path.join(project, "src/data");
        server.watcher.add([content, data, path.join(project, "public")]);
        let pending = Promise.resolve();
        server.watcher.on("all", (_event, file) => {
          if (
            ![content, data, path.join(project, "public")].some((dir) =>
              file.startsWith(dir + path.sep),
            )
          )
            return;
          pending = pending
            .then(() => generateSite())
            .then(() => {
              server.ws.send({ type: "full-reload" });
            })
            .catch((error) => server.config.logger.error(String(error)));
        });
      },
    },
  ],
});
