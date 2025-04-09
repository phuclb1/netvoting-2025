type Id = string | number;

export type Route = {
  path: string | ((id: Id) => string);
  title: string;
};

export const ROUTE = {
  HOME: {
    root: { path: "/", title: "Trang chủ" },
    humanresource: {
      root: { path: "/users-management", title: "Quản lý người dùng" },
      create: { path: "/users-management/create", title: "Tạo mới người dùng" },
      detail: {
        path: (id: Id) => `/users-management/${id}`,
        title: "Thông tin người dùng",
      },
      edit: {
        path: (id: Id) => `/users-management/${id}/edit`,
        title: "Chỉnh sửa người dùng",
      },
    },
    profile: { path: "/profile", title: "Thông tin người dùng" },
    events_management: {
      root: {
        path: "/events-management",
        title: "Quản lý sự kiện",
      },
      create: {
        path: "/events-management/create",
        title: "Tạo sự kiện",
      },
      detail: {
        path: (id: Id) => `/events-management/${id}`,
        title: "Thông tin sự kiện",
      },
      edit: {
        path: (id: Id) => `/events-management/${id}/edit`,
        title: "Chỉnh sửa sự kiện",
      },
    },
    unauthorized: {
      path: "/unauthorized",
      title: "Không có quyền truy cập",
    }
  },
  EVENT_MANAGE: {
    info: {
      path: (id: Id) => `/events-management/${id}/info`,
      title: "Thông tin sự kiện",
    },
    users: {
      path: (id: Id) => `/events-management/${id}/users`,
      title: "Thành phần tham gia",
    },
    votingCategories: {
      path: (id: Id) => `/events-management/${id}/voting-categories`,
      title: "Hạng mục biểu quyết",
    },
  },
  EVENT: {
    list: {
      path: "/events",
      title: "Sự kiện đang diễn ra",
    }
  }
};
