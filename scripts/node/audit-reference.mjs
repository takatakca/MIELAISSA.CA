/** Codex — assistant OpenAI. Verify private source archives, never publish them. */
import { readFile, realpath } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";
export async function auditReference(directory) {
  const root = await realpath(directory);
  const manifest = JSON.parse(
    await readFile(resolve(root, "manifest.json"), "utf8"),
  );
  if (manifest.version !== 2 || manifest.source !== "https://mielaissa.ca")
    throw Error("Not a MIELAISSA v2 reference archive");
  const failures = [];
  const entries = [...(manifest.pages || []), ...(manifest.assets || [])];
  for (const entry of entries) {
    if (
      typeof entry.file !== "string" ||
      isAbsolute(entry.file) ||
      entry.file.split(/[\\/]/).includes("..")
    ) {
      failures.push("Unsafe archive entry");
      continue;
    }
    try {
      const file = await realpath(resolve(root, entry.file));
      const fromRoot = relative(root, file);
      if (fromRoot.startsWith("..") || isAbsolute(fromRoot))
        throw Error("Archive entry escapes root");
      const bytes = await readFile(file);
      if (
        bytes.length !== entry.bytes ||
        createHash("sha256").update(bytes).digest("hex") !== entry.sha256
      )
        throw Error("Original bytes differ");
    } catch (e) {
      failures.push(entry.file + ": " + e.message);
    }
  }
  return {
    source: manifest.source,
    checkedFiles: entries.length,
    htmlPages: manifest.pages?.length || 0,
    staticAssets: manifest.assets?.length || 0,
    missingDependencies: manifest.unresolved?.length || 0,
    captureErrors: manifest.errors?.length || 0,
    hashFailures: failures,
    originalFilesVerified: entries.length > 0 && failures.length === 0,
    discoveredSourceCaptureComplete:
      manifest.complete === true &&
      (manifest.pages?.length || 0) > 0 &&
      !manifest.unresolved?.length &&
      !manifest.errors?.length &&
      !manifest.remaining?.pages &&
      !manifest.remaining?.assets &&
      entries.length > 0 &&
      failures.length === 0,
    visualParityVerified: false,
    transactionalMigrationComplete: false,
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  if (!process.argv[2])
    throw Error("Usage: npm run audit:reference -- /private/archive-directory");
  const result = await auditReference(process.argv[2]);
  console.log(JSON.stringify(result, null, 2));
  if (!result.discoveredSourceCaptureComplete) process.exitCode = 1;
}
