/**
 * Himalayan Prefab Solutions ERP
 * Client-Side Hash Router
 */

var Router = {
  routes: {},
  currentRoute: "",
  currentParams: {},

  register(path, handler) {
    this.routes[path] = handler;
  },

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    // Initial route handling
    if (!window.location.hash || window.location.hash === "#") {
      window.location.hash = "#dashboard";
    } else {
      this.handleRoute();
    }
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  handleRoute() {
    const rawHash = window.location.hash.slice(1) || "dashboard";
    const [pathPart, queryPart] = rawHash.split("?");

    // Parse query params
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    // Match route
    let matchedHandler = null;
    let params = {};
    let matchedPattern = "";

    // Exact match check
    if (this.routes[pathPart]) {
      matchedHandler = this.routes[pathPart];
      matchedPattern = pathPart;
    } else {
      // Dynamic route matching e.g., 'projects/:id'
      for (const pattern in this.routes) {
        if (pattern.includes("/:")) {
          const patternParts = pattern.split("/");
          const actualParts = pathPart.split("/");

          if (patternParts.length === actualParts.length) {
            let isMatch = true;
            const routeParams = {};

            for (let i = 0; i < patternParts.length; i++) {
              if (patternParts[i].startsWith(":")) {
                const paramName = patternParts[i].substring(1);
                routeParams[paramName] = decodeURIComponent(actualParts[i]);
              } else if (patternParts[i] !== actualParts[i]) {
                isMatch = false;
                break;
              }
            }

            if (isMatch) {
              matchedHandler = this.routes[pattern];
              params = routeParams;
              matchedPattern = pattern;
              break;
            }
          }
        }
      }
    }

    // Fallback to dashboard if route unknown
    if (!matchedHandler) {
      if (this.routes["dashboard"]) {
        matchedHandler = this.routes["dashboard"];
        matchedPattern = "dashboard";
      } else {
        console.warn("No handler found for route:", pathPart);
        return;
      }
    }

    this.currentRoute = matchedPattern;
    this.currentParams = { ...params, query: queryParams };

    // Update active nav styling
    const baseNavId = pathPart.split("/")[0];
    Layout.setActiveNav(baseNavId);

    // Scroll to top of content
    window.scrollTo(0, 0);

    // Execute Module Controller
    const mainContainer = document.getElementById("app-main-content");
    if (mainContainer) {
      matchedHandler(mainContainer, this.currentParams);
    }

    AppEvents.emit("route:changed", {
      route: this.currentRoute,
      params: this.currentParams
    });
  }
};

window.Router = Router;

