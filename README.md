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
│   ├── chall/              # Code run by the user
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       └── app.js
│   ├── codevana.config.yml # Metadata for runner
│   ├── structure.json      # File tree and editor permissions
│   └── tests/              # Hidden test suite for validation
│       ├── jest.config.js
│       └── ping.test.js
├── CONTRIBUTING.md          # Submission guide
└── README.md
```

---

## 🧠 How Challenges Work

* All editable files for the user **must live in the `/chall` directory**.
* The `structure.json` defines the file explorer layout and **controls what the user can edit**.
* Files marked with `"readonly": true` in `structure.json` will be locked in the UI & backend.

The user code is mounted into a **secure Docker container**. The runner:

* Starts the container defined in `docker-compose.yml`.
* Waits for the line defined in `service_up_line` (e.g. `Server is running on port 3000`).
* Sends test cases to the running service and evaluates the result.

Each challenge defines:

* `codevana.config.yml`: runtime and test config.
* `structure.json`: exposed file tree.

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