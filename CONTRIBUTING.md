# Contributing a Challenge to Codevana

Thanks for your interest in contributing! Here's how to propose a coding challenge for Codevana.

---

## 📦 Challenge Submission Guidelines

Each challenge should follow this structure:

```
your-challenge-name/
├── code/                    # User-editable files
│   ├── package.json
│   └── src/
│       └── app.js
├── Dockerfile.test          # Defines the test container environment
├── tests/                   # Hidden test suite and runner
│   ├── test.js
│   └── run-tests
├── structure.json           # File tree UI + permissions
└── codevana.config.yml      # Challenge config for orchestrator
```

---

### 🧩 Required Files

#### ✅ Unit Config - `codevana.config.yml`

```yml
test_mode: unit
test_image: codevana/introduction/ping/tester:latest
```

* `test_mode`: `unit` or `e2e`, depending on the test logic.
* `test_image`: Full image name to be used by orchestrator for this challenge.

---

#### ✅ E2E Config - `codevana.config.yml`

```yml
test_mode: e2e
test_image: codevana/introduction/ping/tester:latest
code_image: codevana/introduction/ping/code:latest

services:
  mongodb:
    image: mongo:latest
    port: 27017
    env:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
```

* `code_image`: Full image name for the user code.
* `services`: Optional services like databases or caches, with their Docker images, ports, and environment variables.

#### ✅ `structure.json`

Defines the file explorer layout and permissions:

```json
[
  {
    "id": "src",
    "type": "folder",
    "name": "src",
    "children": [
      {
        "id": "src-app-js",
        "type": "file",
        "name": "app.js",
        "extension": "js",
        "path": "/src/app.js"
      }
    ],
    "path": "/src"
  },
  {
    "id": "package-json",
    "type": "file",
    "name": "package.json",
    "extension": "json",
    "path": "/package.json",
    "readonly": true
  }
]
```

* These paths are **relative to the `/code` directory**.
* Only files not marked `readonly` can be edited by the user.

---

## 🧪 Tests

* Put your test logic in the `/tests/` folder.
* Include a `run-tests` script that runs the tests and writes the result to `/sandbox/output/result.json` in the format:

```json
{
  "passed": true,
  "message": "All Tests Passed 🎉"
}
```

* Any testing framework is allowed.
* This script is run inside the container defined in `Dockerfile.test`.

---

## 🔐 Security Tips

✅ Do:

* Never expose `/tests/` to user-facing containers.
* Avoid exposing internal tools or credentials in Dockerfile layers.
* Write clean `run-tests` logic that cannot be tampered with by user code.

❌ Don’t:

* Place any test logic inside the `code/` directory.
* Use interactive shells or insecure Docker options.

---

## 🤝 Submitting

Currently, direct PRs are not used to import challenges. Instead:

1. Follow the structure above and validate your challenge locally.
2. Share the zipped challenge directory to @raxo101 on Discord.
3. A team member will test and approve it before publishing.

Thanks for contributing!