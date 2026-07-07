import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CloudBuild Docker context", () => {
  it("excludes scanner and local build artifacts from the Docker context", () => {
    const dockerignore = readFileSync(resolve(process.cwd(), ".dockerignore"), "utf8");

    expect(dockerignore).toContain(".scannerwork");
    expect(dockerignore).toContain("node_modules");
    expect(dockerignore).toContain("dist");
  });
});
