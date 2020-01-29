import UserLayout from 'layouts/UserLayout';

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    redirect: '/user/login',
    hidden: true,
    component: UserLayout,
    children: [{
      path: 'login',
      name: 'LoginPage',
      component: () => import('components/LoginPage/LoginPage'),
    }]
  },
  {
    path: '/main',
    name: 'MainPage',
    component: () => import('components/MainPage/MainPage'),
    children: [
      {
        path: 'workplace',
        name: 'workplace',
        component: () => import('components/MainPage/WorkPlace/WorkPlace'),
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('components/MainPage/ListPage/ListPage'),
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('components/MainPage/AnalysisPage/AnalysisPage'),
      },
      {
        path: 'usercenter',
        name: 'usercenter',
        component: () => import('components/MainPage/UserCenter/UserCenter'),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('components/MainPage/SettingPage/SettingPage'),
      },
      {
        path: 'contractmanager',
        name: 'ContractManager',
        component: () => import('components/MainPage/ContractManager/ContractManager'),
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: () => import('components/MainPage/InvoicePage/InvoicePage'),
      },
    ]
  }
];