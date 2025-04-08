type Id = string | number;

export type Route = {
  path: string | ((id: Id) => string);
  title: string;
};

export const ROUTE = {
  HOME: {
    root: { path: "/", title: "Home" },
    humanresource: {
      root: { path: "/people-management", title: "People Management" },
      create: { path: "/people-management/create", title: "Create People" },
      detail: {
        path: (id: Id) => `/people-management/${id}`,
        title: "People Detail",
      },
      edit: {
        path: (id: Id) => `/people-management/${id}/edit`,
        title: "Edit People",
      },
    },
    profile: { path: "/profile", title: "My Profile" },
    trainingcenter: {
      root: {
        path: "/training-center-management",
        title: "Training Center",
      },
      create: {
        path: "/training-center-management/create",
        title: "Create Training Center",
      },
      detail: {
        path: (id: Id) => `/training-center-management/${id}`,
        title: "Center Detail",
      },
      edit: {
        path: (id: Id) => `/training-center-management/${id}/edit`,
        title: "Edit Center",
      },
    },
  },
};
