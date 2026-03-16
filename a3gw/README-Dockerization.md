### a3gw Dockerization Overview

This document summarizes how `a3gw` is containerized, which ports it exposes, and which configuration files are relevant when running it on Docker / Kubernetes.

---

### Docker images and environments

The `a3gw` directory defines three Dockerfiles:

- **`Dockerfile.vcp.dev`**: development image
- **`Dockerfile.vcp.k8slocal`**: image intended for local Kubernetes / Docker-based environments
- **`Dockerfile.vcp.prod`**: production image

All three follow the same basic pattern:

- Base image: a Node.js runtime (with PM2 installed globally).
- Workdir: `/space/a3gw`.
- Install dependencies from `package.json` / `package-lock.json`.
- Copy application code under `./src`.
- Copy environment-specific configuration under `./src/conf`.
- Copy static content under `./static`.
- Start the application using PM2 with `ecosystem.config.js`.

The key differences are **which configuration directory is copied** and which static set is used:

- Dev: `COPY ./vcp/conf.dev ./src/conf` and `COPY ./vcp/static.dev ./static`
- K8s local: `COPY ./vcp/conf.k8s ./src/conf` and `COPY ./vcp/static.prod ./static`
- Prod: `COPY ./vcp/conf.prod ./src/conf` and `COPY ./vcp/static.prod ./static`

---

### Ports exposed and healthcheck

In all Dockerfiles used for K8s / prod, the same ports are exposed:

```dockerfile
EXPOSE 8444
EXPOSE 8445
```

- **8444**: main a3gw proxy / API port (used for `/site.json` health and service requests).
- **8445**: authentication / authorization port (defined in `auth_config.json`).

Both `Dockerfile.vcp.k8slocal` and `Dockerfile.vcp.prod` also define a container-level healthcheck:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8444/site.json || exit 1
```

This expects the a3gw process to listen on **8444 inside the container** and to expose a basic health endpoint at `/site.json`. (public file)

---

### PM2 process model and internal static servers

File: `vcp/ecosystem.config.js`

This PM2 configuration controls how a3gw and its static servers are started:

- Main application processes (not shown here) handle proxying and business logic on ports 8444/8445.
- Two static servers are defined:

```javascript
{
    // Private static server
    {
        name: "private_8085",
        script: "serve",
        env: {
            "PM2_SERVE_PATH": "/space/a3gw/static/private",
            "PM2_SERVE_HOST": "127.0.0.1",
            "PM2_SERVE_PORT": 8085
        }
    },

    // Public static server
    {
        name: "public_8086",
        script: "serve",
        env: {
            "PM2_SERVE_PATH": "/space/a3gw/static/public",
            "PM2_SERVE_HOST": "127.0.0.1",
            "PM2_SERVE_PORT": 8086
        }
    }
}
```

- Both static servers listen on **loopback (`127.0.0.1`) inside the container**.
- They are intended to be consumed only by processes inside the same container (e.g. the main a3gw proxy or an in-container httpd), not by other Docker containers over the bridge network.

---

### Auth configuration and binding addresses

For production, the authentication service is configured in:

`vcp/conf.prod/auth_config.json`

```json
{
  "httpHost": "0.0.0.0",
  "httpPort": "8445",
  "accountsPath": "/cmpf-rest/useraccounts",
  "accountsUrl": "http://10.35.39.101:9610/axis2/cmpf/useraccounts",
  "authenticationServer": {
    "path": "/cmpf-rest/authenticate",
    "target": "http://10.35.39.101:9610",
    "pathRewrite": {
      "^/cmpf-rest/authenticate": "/axis2/cmpf/authenticate"
    }
  },
  "allowOnlyOneSession": false,
  "memcachedServers": []
}
```

Important containerization-related aspects:

- `httpHost: "0.0.0.0"`  
  - The auth HTTP server listens on **all interfaces** inside the container, allowing other containers (httpd, portals, etc.) to reach it over the Docker / Kubernetes network.
- `httpPort: "8445"`  
  - Matches the `EXPOSE 8445` declaration in the Dockerfiles.

For comparison, the generic example under `src/conf/auth_config.json.example` uses `httpHost: "127.0.0.1"` and a different port (8446); the prod configuration adapts this for containerized, multi-service environments.

The `accountsUrl` and `authenticationServer.target` currently point to specific backend IPs (e.g. `http://10.35.39.101:9610`). In a fully in-cluster deployment, these targets are good candidates to be switched to Kubernetes service DNS names or Docker-compose service names instead of fixed IPs.

---

### Service proxy configuration (backend wiring)

File: `vcp/conf.k8s/service_proxies_config.json`

This JSON array defines how a3gw proxies requests to backend services. Each entry has:

- `name`: logical name of the backend (e.g. `"cmpf"`, `"smsc-gr"`, `"ring-back-tone"`, etc.).
- `target`: **base URL of the backend service**.
- `contextList`: one or more objects with:
  - `path`: the external path exposed by a3gw.
  - `rewrite`: the internal path on the backend.

Example:

```json
{
  "name": "cmpf",
  "target": "http://10.35.39.101:9610",
  "contextList": [
    {
      "path": "/cmpf-rest",
      "rewrite": "/axis2/cmpf"
    }
  ],
  "proxyType": "cmpf"
}
```

Containerization relevance:

- `target` values like `http://10.35.39.101:9610` currently point to existing backend IPs in the network.
- When more components are moved into Docker or Kubernetes, these are the **primary places to swap fixed IPs for service names** (for example `http://cmpf:9610` in Docker Compose or `http://cmpf-service:9610` in Kubernetes).
- The exposed `path` values under `contextList` need to stay stable, since httpd / portals call a3gw using these paths.

In short, **`service_proxies_config.json` is the central “wiring table”** between a3gw and the rest of the VCP backend ecosystem.

---

### Static configuration and external redirect URLs

File: `vcp/static.prod/private/server.json`

```json
{
  "SIMOTARedirectUri": "https://simota.remote.com/",
  "DMCRedirectUri": "https://dmc.remote.com/",
  "RbtPortalRedirectUri": "http://10.35.39.101/singlelogin/connect",
  "clusters": [ ... ]
}
```

- These values are used for **browser redirects** and UI-level configuration, not for in-cluster service discovery.
- They still matter for containerization, because they must be reachable from user browsers in the environment where the cluster runs (e.g. via DNS or a VPN).

---

### Summary

- The `a3gw` images expose **ports 8444 and 8445** and use a healthcheck on `http://127.0.0.1:8444/site.json`.
- `conf.dev`, `conf.k8s`, and `conf.prod` hold environment-specific settings; containerized environments use `conf.k8s` and `conf.prod`.
- `auth_config.json` switches from `127.0.0.1` to `0.0.0.0` and aligns ports with the container-exposed ports so other services can call a3gw.
- `service_proxies_config.json` is the main place where backend targets are defined; for full Docker/Kubernetes deployments, this is where you replace fixed IPs with service names on the cluster network.
