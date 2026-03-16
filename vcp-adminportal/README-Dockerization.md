### vcp-adminportal Dockerization Overview

This document explains how the `vcp-adminportal` container image is produced and how the supporting files (npm shrinkwrap, nginx config, etc.) fit together.

---

### npm-shrinkwrap.json / npm-shrinkwrap.original.json

- **Goal**: lock down the exact versions of all `npm` dependencies (including transitive ones) so that container builds are **repeatable and deterministic**.
- **Files**:
  - `npm-shrinkwrap.original.json`: the checked-in lockfile that represents a known-good dependency tree.
  - `npm-shrinkwrap.json`: the file that `npm` actually consumes during `npm install`.
- **How it is used in Dockerfiles**:
  - Both `Dockerfile.dev` and `Dockerfile.prod`:
    - Copy `npm-shrinkwrap.original.json` into the image as `npm-shrinkwrap.json`.
    - Run `npm shrinkwrap` and then `npm install`.
  - This pattern ensures that:
    - The dependency graph is pinned.
    - Rebuilds of the same image get the same dependency versions (critical for legacy AngularJS + Gulp/Bower stacks).

If you change dependencies in `package.json`, you should regenerate the shrinkwrap file in a controlled way and re-commit the updated `npm-shrinkwrap.original.json`.

---

### nginx/default.conf

File: `nginx/default.conf`

```nginx
server {
  listen 8080;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

- **Purpose**: serve the built static admin portal via `nginx` inside the runtime container.
- **Key points**:
  - Listens on **port 8080** inside the container (this is what `EXPOSE 8080` and `docker run -p 8080:8080` correspond to).
  - Serves files from `/usr/share/nginx/html`, where the build artifacts are extracted.
  - Uses `try_files ... /index.html` so that HTML5 client-side routing works; unknown URLs fall back to `index.html`.

If you ever change the public path (for example, to serve under `/adminportal` instead of `/`), you would adjust this file accordingly.

---

### How the adminportal container is built (dev)

File: `Dockerfile.dev`

High-level steps:

1. **Builder stage** (Node 10 on Alpine):
   - Set working directory to `/space/app`.
   - Install global tools: `gulp@3.9.1`, `bower@1.8.14`.
   - Copy `package.json`, `bower.json`, and `npm-shrinkwrap.original.json` (as `npm-shrinkwrap.json`).
   - Run `npm shrinkwrap` and `npm install`.
   - Run `bower --allow-root install` to restore front-end dependencies.
   - Copy `i18n`, `src`, and `gulpfile.js`.
2. **Runtime**:
   - This dev Dockerfile does not use nginx; it uses the **Gulp dev server**.
   - Exposes port **8080** and starts `gulp server`:
     - Gulp binds to `host: "0.0.0.0"` and `port: 8080`, making it reachable from your host via `docker run -p 8080:8080`.

Example:

```bash
docker build -t fastweb-vcp/vcp-adminportal-dev -f Dockerfile.dev .
docker run --rm -p 8080:8080 fastweb-vcp/vcp-adminportal-dev
```

Then open `http://localhost:8080/adminportal` in your browser.

---

### How the adminportal container is built (prod)

File: `Dockerfile.prod`

High-level steps:

1. **Builder stage (Node 10)**:
   - Copies `package.json`, `bower.json`, and `npm-shrinkwrap.original.json` → `npm-shrinkwrap.json`.
   - Runs `npm shrinkwrap` and `npm install`.
   - Installs global `gulp` and `bower`, plus `git`.
   - Runs `bower --allow-root install`.
   - Copies `i18n`, `src`, and `gulpfile.js`.
   - Runs `gulp`:
     - Produces a `vcp-adminportal-<timestamp>.tar.gz` archive containing the optimized `dist` output.
2. **Run stage (nginx)**:
   - Base image: `nginx:1.21-alpine`.
   - Copies `nginx/default.conf` into `/etc/nginx/conf.d/default.conf`.
   - Copies the built `vcp-adminportal-*.tar.gz` from the builder into `/usr/share/nginx/html/`.
   - Extracts the tarball into `/usr/share/nginx/html/adminportal`.
   - Deletes the tarball and exposes **port 8080**.
   - Declares a `HEALTHCHECK` on `http://127.0.0.1:8080/adminportal`.

Example build and run:

```bash
docker build -t fastweb-vcp/vcp-adminportal -f Dockerfile.prod .
docker run --rm -p 8080:8080 fastweb-vcp/vcp-adminportal
```

Then open `http://localhost:8080/adminportal`.

You can validate the image in two ways:
- Run httpd and a3gw locally alongside the container, to verify that the image was built correctly.
- Use Docker Compose to build and run httpd, a3gw, and the portals together as a full stack.
The portals rely on Apache (httpd) and a3gw for authentication, authorization checks, and for service requests to be properly proxied.

---

### Summary

- **npm shrinkwrap**: ensures deterministic Node dependency versions during Docker builds.
- **nginx/default.conf**: serves the built static portal on port 8080 with SPA-friendly routing.
- **Dockerfile.dev**: runs the Gulp dev server directly (good for development and live reload).
- **Dockerfile.prod**: builds an optimized static bundle and serves it from a minimal nginx container (production-like runtime).
