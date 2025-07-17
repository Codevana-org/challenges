# Codevana Challenges

Welcome to the Codevana Community Challenge Repository!

This repository is **not used to store the actual challenges** submitted by contributors. Instead, it provides:
- An example challenge (`challenges/introduction/ping/`) to demonstrate structure.
- Guidelines and templates for contributing your own challenges.
- Config and structure files expected for each challenge submission.
- Scripts to pull and push challenges to/from the main repository.
- Scripts for managing challenge metadata and structure.

> ⚠️ Submitted challenges are stored securely and privately elsewhere. Contributors will **not** be able to view or access each other's challenges.

---

## 📁 Repository Structure

```bash
.
├── ping/                    # Example challenge
│   ├── code/                # Editable code the user interacts with
│   │   ├── package.json
│   │   └── src/
│   │       └── app.js
│   ├── Dockerfile.test      # Testing container image
│   ├── tests/               # Test suite (never shown to users)
│   │   ├── test.js
│   │   └── run-tests        # Script that outputs result to result.json
│   ├── structure.json       # File tree and edit permissions
│   └── codevana.config.yml  # Metadata for orchestrator
├── CONTRIBUTING.md
└── README.md
```

---

## 🧠 How Challenges Work

Each challenge is self-contained in its folder and includes:

* `code/`: All files visible and editable by the user in the web IDE.
* `structure.json`: Defines which files appear in the editor and which are editable.
* `tests/`: Hidden folder that contains test files and the `run-tests` script.
* `Dockerfile.test`: Defines the container used for test execution.
* `codevana.config.yml`: Describes test execution mode and Docker image reference.

### ✅ Test Execution Flow

1. The orchestrator builds and runs the `Dockerfile.test`.
2. It mounts the user's code and test directory inside the container.
3. The `tests/run-tests` script is executed.
4. This script writes test results as a JSON object to `/sandbox/output/result.json`.

```json
{
  "passed": true,
  "message": "All Tests Passed 🎉"
}
```

> 🔐 Tests and internal scripts must never be accessible from the user’s code.

---

## 🔐 Security Guidelines

* Challenges run in **Docker containers** with strict limits.
* **Never allow the user to access the `/tests` folder**, either through Docker volume mounts or hardcoded paths.
* Do **not allow shell access**, interactive terminals, or unauthenticated access to internals.
* Sanitize network access if your challenge uses sockets, servers, or ports.

> **Challenges can be written in any language or framework.** Node.js is just used in the `ping` example.

---

## 🚀 Want to Contribute?

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instructions on creating your own challenge.