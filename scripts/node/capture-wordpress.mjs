/** Codex — assistant OpenAI. Run only where access to mielaissa.ca is authorized. */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { captureReference } from "./reference-assets.mjs";
export {
  allowedPage,
  allowedMedia,
  allowedAsset,
} from "./reference-assets.mjs";
async function main() {
  const output = resolve(
    "migration-private",
    new Date().toISOString().replaceAll(":", "-"),
  );
  const result = await captureReference({ output });
  console.log(
    JSON.stringify({
      output,
      pages: result.pages.length,
      assets: result.assets.length,
      unresolved: result.unresolved.length,
      errors: result.errors.length,
      complete: result.complete,
      transactionalMigrationComplete: false,
    }),
  );
  if (!result.complete) process.exitCode = 1;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await main();
