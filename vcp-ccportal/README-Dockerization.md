### vcp-ccportal Dockerization Overview

This document explains how the `vcp-ccportal` container image is produced and how the supporting files (npm shrinkwrap, nginx config, etc.) fit together.

---

### npm-shrinkwrap.json / npm-shrinkwrap.original.json

- **Goal**: lock down the exact versions of all `npm` dependencies (including transitive ones) so container builds are **repeatable and deterministic**.
- **Files**:
  - `npm-shrinkwrap.original.json`: the checked-in lockfile that represents a known-good dependency tree.
  - `npm-shrinkwrap.json`: the file `npm` reads during `npm install`.
- **How it is used in Dockerfiles**:
  - Both `Dockerfile.dev` and `Dockerfile.prod`:
    - Copy `npm-shrinkwrap.original.json` into the image as `npm-shrinkwrap.json`.
    - Run `npm shrinkwrap` and then `npm install`.
  - This ensures:
    - The dependency graph is pinned.
    - Rebuilds of the same image yield the same dependency versions, which is important for the legacy AngularJS + Gulp/Bower stack.

If you change dependencies in `package.json`, regenerate the shrinkwrap file and re-commit `npm-shrinkwrap.original.json` so future builds stay consistent.

---

### nginx/default.conf

File: `nginx/default.conf`

```nginx
server {
  listen 8081;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

- **Purpose**: serve the built static customer care portal via `nginx` inside the runtime container.
- **Key points**:
  - Listens on **port 8081** inside the container (this is what `EXPOSE 8081` and `docker run -p 8081:8081` correspond to).
  - Serves files from `/usr/share/nginx/html`, where the build artifacts are extracted under `/usr/share/nginx/html/ccportal`.
  - Uses `try_files ... /index.html` so that HTML5 client-side routing works; unknown URLs fall back to `index.html`.

If you need to serve the app under a different base path (for example `/vcp/ccportal`), you would update this file to add an appropriate `location` block.

---

### How the ccportal container is built (dev)

File: `Dockerfile.dev`

High-level steps:

1. **Builder/runtime stage (Node 10 on Alpine)**:
   - Set working directory to `/space/app`.
   - Install global tools: `gulp@3.9.1`, `bower@1.8.14`.
   - Copy `package.json`, `bower.json`, and `npm-shrinkwrap.original.json` (as `npm-shrinkwrap.json`).
   - Run `npm shrinkwrap` and `npm install`.
   - Run `bower --allow-root install` to restore front-end dependencies.
   - Copy `i18n`, `src`, and `gulpfile.js`.
   - Expose port **8080** and start the Gulp dev server with:
     - `host: "0.0.0.0"`
     - `port: 8081` (inside the Node process, as configured in `gulpfile.js`).

Typical usage for development:

```bash
docker build -t fastweb-vcp/vcp-ccportal-dev -f Dockerfile.dev .
docker run --rm -p 8081:8081 fastweb-vcp/vcp-ccportal-dev
```

Then open `http://localhost:8081/ccportal` in your browser (the Gulp dev server serves the app under the `/ccportal` path).

You can validate the image in two ways:
- Run httpd and a3gw locally alongside the container, to verify that the image was built correctly.
- Use Docker Compose to build and run httpd, a3gw, and the portals together as a full stack.
  The portals rely on Apache (httpd) and a3gw for authentication, authorization checks, and for service requests to be properly proxied.

---

### How the ccportal container is built (prod)

File: `Dockerfile.prod`

High-level steps:

1. **Builder stage (Node 10)**:
   - Copies `package.json`, `bower.json`, and `npm-shrinkwrap.original.json` → `npm-shrinkwrap.json`.
   - Runs `npm shrinkwrap` and `npm install`.
   - Installs global `gulp` and `bower`, plus `git`.
   - Runs `bower --allow-root install`.
   - Copies `i18n`, `src`, and `gulpfile.js`.
   - Runs `gulp`:
     - Produces a `vcp-ccportal-<timestamp>.tar.gz` archive containing the optimized `dist` output.
2. **Run stage (nginx)**:
   - Base image: `nginx:1.21-alpine`.
   - Copies `nginx/default.conf` into `/etc/nginx/conf.d/default.conf`.
   - Copies the built `vcp-ccportal-*.tar.gz` from the builder into `/usr/share/nginx/html/`.
   - Creates `/usr/share/nginx/html/ccportal` and extracts the tarball into that directory.
   - Deletes the tarball and exposes **port 8081**.
   - Declares a `HEALTHCHECK` on `http://127.0.0.1:8081/ccportal`.

Example build and run:

```bash
docker build -t fastweb-vcp/vcp-ccportal -f Dockerfile.prod .
docker run --rm -p 8081:8081 fastweb-vcp/vcp-ccportal
```

Then open `http://localhost:8081/ccportal`.

---

### Summary

- **npm shrinkwrap**: pins all Node dependencies for deterministic Docker builds.
- **nginx/default.conf**: serves the built ccportal under port 8081 with SPA-friendly routing.
- **Dockerfile.dev**: runs the Gulp-based dev server (good for local development).
- **Dockerfile.prod**: builds an optimized static bundle and serves it from a minimal nginx container (production-like runtime).
