import { createRouter, createWebHashHistory } from "vue-router";
import { message } from "ant-design-vue";
import { layoutStore } from "@/store/layout";
import { jwtDecode } from "jwt-decode";
import { localStoreUserDataKey } from "@/apis";

// name string:path string
const routesMap = {
  用户登录: "/login",
  域名查询: "/dns_query",
  解析记录: "/dns_records",
  域名拨测: "/dns_probes",
  区域管理: "/dns_zones",
  定时任务: "/cronjobs",
  日志图表: "/log_charts",
  审计日志: "/system_audit",
  系统用户: "/system_users",
  系统角色: "/system_roles",
  接口管理: "/system_apis",
};

const routes = [
  {
    name: "Home",
    path: "/",
    meta: {
      title: "首页",
    },
    redirect: { name: "DnsQuery" },
  },
  {
    name: "UserLogin",
    path: routesMap["用户登录"],
    component: () => import("@/views/UserLogin.vue"),
    meta: {
      title: "用户登录",
      fullScreen: true, // 用户登录全屏
    },
  },
  {
    name: "DnsQuery",
    path: routesMap["域名查询"],
    component: () => import("@/views/DnsQuery.vue"),
    meta: {
      title: "域名查询",
    },
  },
  {
    name: "DnsRecords",
    path: routesMap["解析记录"],
    component: () => import("@/views/DnsRecords.vue"),
    meta: {
      title: "解析记录",
    },
  },
  {
    name: "DnsProbes",
    path: routesMap["域名拨测"],
    component: () => import("@/views/DnsProbes.vue"),
    meta: {
      title: "域名拨测",
    },
  },
  {
    name: "CronJobs",
    path: routesMap["定时任务"],
    component: () => import("@/views/CronJobs.vue"),
    meta: {
      title: "定时任务",
    },
  },
  {
    name: "DnsZones",
    path: routesMap["区域管理"],
    component: () => import("@/views/DnsZones.vue"),
    meta: {
      title: "区域管理",
    },
  },
  {
    name: "LogCharts",
    path: routesMap["日志图表"],
    component: () => import("@/views/LogCharts.vue"),
    meta: {
      title: "日志图表",
    },
  },
  {
    name: "SystemAudit",
    path: routesMap["审计日志"],
    component: () => import("@/views/SystemAudit.vue"),
    meta: {
      title: "审计日志",
    },
  },
  {
    name: "SystemUsers",
    path: routesMap["系统用户"],
    component: () => import("@/views/SystemUsers.vue"),
    meta: {
      title: "域名查询",
    },
  },
  {
    name: "SystemRoles",
    path: routesMap["系统角色"],
    component: () => import("@/views/SystemRoles.vue"),
    meta: {
      title: "系统角色",
    },
  },
  {
    name: "SystemApis",
    path: routesMap["接口管理"],
    component: () => import("@/views/SystemApis.vue"),
    meta: {
      title: "接口管理",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

function isTokenValid(token) {
  try {
    if (token === null || token === undefined) {
      return false;
    }
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return false;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTimestamp;
  } catch (error) {
    console.log("jwt token parse failed:", error);
    return false;
  }
}

// 前置路由守卫, 使用Vue4-router写法
router.beforeEach((to) => {
  const userdataObj = JSON.parse(localStorage.getItem(localStoreUserDataKey));
  if (to.name === "UserLogin") {
    if (isTokenValid(userdataObj?.jwt_token)) {
      return { name: "DnsQuery" };
    }
    return true;
  }

  if (!isTokenValid(userdataObj?.jwt_token)) {
    message.warn("token不存在或过期, 请先登录");
    return { name: "UserLogin" };
  }
  return true;
});

// 后置路由守卫, 设置页面标题和key
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  const store = layoutStore();
  store.selectedKeys = [store.getSelectedKey(to.path)];
});

export default router;
export { routesMap };
