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
        path: 'receipt',
        name: 'receipt',
        component: () => import('components/MainPage/ReceiptPage/ReceiptPage'),
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('components/MainPage/AnalysisPage/AnalysisPage'),
      },
      {
        path: 'parameter',
        name: 'parameter',
        component: () => import('components/MainPage/ParameterPage/ParameterPage'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('components/MainPage/UsersPage/UsersPage'),
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
      {
        path: 'cash',
        name: 'cash',
        component: () => import('components/MainPage/CashPage/CashPage'),
      },
      {
        path: 'outsource',
        name: 'outsource',
        component: () => import('components/MainPage/OutContractPage/OutContractPage'),
      },
      {
        path: 'outcontractlist',
        name: 'outcontractlist',
        component: () => import('components/MainPage/OutContractListPage/OutContractListPage'),
      },
      {
        path: 'outcontractpaid',
        name: 'outcontractpaid',
        component: () => import('components/MainPage/OutContractPaidPage/OutContractPaidPage'),
      },
    ]
  }
];