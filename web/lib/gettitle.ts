import { Route, ROUTE } from "./constants";
type Id = string | number;

const isPathFunction = (
  path: string | ((id: Id) => string)
): path is (id: Id) => string => typeof path === "function";

const matchDynamicRoute = (
  url: string,
  dynamicPath: string | ((id: Id) => string)
): boolean => {
  if (typeof dynamicPath === "string") {
    return url === dynamicPath;
  }

  const dynamicRouteRegex = new RegExp(
    `^${dynamicPath("dummy").replace("dummy", "[^/]+")}$`
  );
  return dynamicRouteRegex.test(url);
};

const getAllRoutes = (routeObj: Record<string, unknown>, id?: Id): Route[] => {
  let routes: Route[] = [];

  for (const key in routeObj) {
    const route = routeObj[key];

    if (typeof route === "object" && route !== null && "path" in route) {
      routes.push(route as Route);
    } else if (typeof route === "object" && route !== null) {
      routes = routes.concat(
        getAllRoutes(route as Record<string, unknown>, id)
      );
    }
  }

  return routes;
};

export const getTitleFromUrl = (url: string): string => {
  const routes = getAllRoutes(ROUTE);

  for (const route of routes) {
    console.log("title", route.title);
    if (typeof route.path === "string" && route.path === url) {
      return route.title;
    } else if (isPathFunction(route.path)) {
      if (matchDynamicRoute(url, route.path)) {
        return route.title;
      }
    }
  }

  return "Unknown Page";
};
