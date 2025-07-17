import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";

async function createChallenge() {
  const initialAnswers = await inquirer.prompt<{
    categorySlug: string;
    challengeSlug: string;
    test_mode: "unit" | "e2e";
  }>([
    {
      type: "input",
      name: "categorySlug",
      message: "📁 Category Slug (e.g., introduction):",
    },
    {
      type: "input",
      name: "challengeSlug",
      message: "🧩 Challenge Slug (e.g., ping):",
    },
    {
      type: "list",
      name: "test_mode",
      message: "🧪 Test Mode:",
      choices: ["unit", "e2e"],
      default: "unit",
    },
  ]);

  const { categorySlug, challengeSlug, test_mode } = initialAnswers;
  const defaultBase = `codevana/${categorySlug}/${challengeSlug}`;

  const promptList: any[] = [
    {
      type: "input",
      name: "test_image",
      message: "🐳 Docker Test Image:",
      default: `${defaultBase}/tester:latest`,
    },
  ];

  if (test_mode === "e2e") {
    promptList.push({
      type: "input",
      name: "code_image",
      message: "🖥️ Docker Code Image:",
      default: `${defaultBase}/code:latest`,
    });
  }

  const imageAnswers = await inquirer.prompt(promptList);

  const baseDir = path.join("challenges", categorySlug, challengeSlug);
  const codeDir = path.join(baseDir, "code");
  const srcDir = path.join(codeDir, "src");
  const testsDir = path.join(baseDir, "tests");

  await fs.ensureDir(srcDir);
  await fs.ensureDir(testsDir);

  // Only create empty structure for now
  await fs.writeFile(
    path.join(codeDir, "package.json"),
    "// Placeholder: package.json"
  );
  await fs.writeFile(
    path.join(srcDir, "app.js"),
    "// Placeholder: user-editable source file"
  );

  const structure = [
    {
      id: "src",
      type: "folder",
      name: "src",
      children: [
        {
          id: "src-app-js",
          type: "file",
          name: "app.js",
          extension: "js",
          path: "/src/app.js",
        },
      ],
      path: "/src",
    },
    {
      id: "package-json",
      type: "file",
      name: "package.json",
      extension: "json",
      path: "/package.json",
      readonly: true,
    },
  ];
  await fs.writeJson(path.join(baseDir, "structure.json"), structure, {
    spaces: 2,
  });

  const config: Record<string, string> = {
    test_mode,
    test_image: imageAnswers.test_image,
  };

  if (test_mode === "e2e") {
    config.code_image = imageAnswers.code_image;
  }

  await fs.writeFile(
    path.join(baseDir, "codevana.config.yml"),
    yaml.dump(config)
  );

  await fs.writeFile(
    path.join(baseDir, "Dockerfile.test"),
    `# Dockerfile.test: sets up test environment\n# This file is used by the orchestrator to run tests in an isolated container.\n`
  );

  await fs.writeFile(
    path.join(baseDir, "run-tests"),
    `#!/bin/bash\n# run-tests: script executed inside the test container\n# It should run all tests and write result to /sandbox/output/result.json\n`
  );
  await fs.chmod(path.join(baseDir, "run-tests"), 0o755);

  if (test_mode === "e2e") {
    await fs.writeFile(
      path.join(baseDir, "Dockerfile.code"),
      `# Dockerfile.code: sets up the user code execution environment\n# Used in e2e mode to run the application container\n`
    );
    await fs.writeFile(
      path.join(baseDir, "run-code"),
      `#!/bin/bash\n# run-code: optional script executed in app container for e2e validation\n`
    );
    await fs.chmod(path.join(baseDir, "run-code"), 0o755);
  }

  console.log(`✅ Challenge created at: ${baseDir}`);
}

createChallenge().catch(console.error);
