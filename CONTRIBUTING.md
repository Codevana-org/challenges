# Contributing a Challenge to Codevana

Thanks for your interest in contributing! Here's how to propose a coding challenge for Codevana.

---

## 📦 Challenge Submission Guidelines

Each challenge should follow this structure:

````

your-challenge-name/
├── chall/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── \[any files you want the user to edit]
├── codevana.config.yml
├── structure.json
└── tests/
└── \[your test files]

````

### 🧩 Required Files

#### ✅ `codevana.config.yml`
```yml
service_to_run: "app"                         # name of the service (from docker-compose)
source_path: "/app"                           # path inside the container where code is located
service_up_line: "Server is running on..."    # string that signals the container is ready
apply_patch_command: "npm install"            # optional patch setup step
run_tests_command: "npm run test"             # command to run tests
author: "your-username"
````

#### ✅ `structure.json`

Defines what the user sees in the in-browser editor and what they can edit.

Example:

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
    "id": "dockerfile",
    "type": "file",
    "name": "Dockerfile",
    "path": "/Dockerfile",
    "readonly": true
  }
]
```

* All files listed here must exist in `/chall`.
* Only files **not marked as `readonly`** can be edited.
* This is how the UI builds the file tree.

---

## 🧪 Tests

Put your tests in a separate `/tests/` directory **outside `/chall`**. These files are never exposed to users.

* They will be mounted at runtime and executed via the `run_tests_command`.
* You can use any test runner — Jest, Mocha, pytest, etc.

---

## 🔐 Security Tips

Your container is isolated, but users **can modify anything inside `/chall`**.

✅ Do:

* Ensure the test suite isn't accessible from the user container.
* Write Dockerfiles that do not allow shell escape (`/bin/sh`, `bash`, etc.).
* Disable interactive terminals.
* Ensure no secrets or tokens are embedded in the challenge.

❌ Don’t:

* Expose test logic inside the user-facing app.
* Run in privileged mode.
* Mount host paths.

---

## 🤝 Submitting

Currently, direct PRs are not used to import challenges. Instead:

1. Follow the structure above and validate your challenge locally.
2. Share the zipped challenge directory to @raxo101 on Discord.
3. A team member will test and approve it before publishing.

Thanks for contributing!
