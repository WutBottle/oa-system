import UserLayout from 'layouts/UserLayout';

const LoginPage = r => require.ensure([], () => r(require('components/LoginPage/LoginPage')));
const MainPage = r => require.ensure([], () => r(require('components/MainPage/MainPage')));
const WorkPlace = r => require.ensure([], () => r(require('components/MainPage/WorkPlace/WorkPlace')));
const ProjectPage = r => require.ensure([], () => r(require('components/MainPage/ProjectPage/ProjectPage')));
const ReceiptPage = r => require.ensure([], () => r(require('components/MainPage/ReceiptPage/ReceiptPage')));
const AnalysisPage = r => require.ensure([], () => r(require('components/MainPage/AnalysisPage/AnalysisPage')));
const ParameterPage = r => require.ensure([], () => r(require('components/MainPage/ParameterPage/ParameterPage')));
const UsersPage = r => require.ensure([], () => r(require('components/MainPage/UsersPage/UsersPage')));
const ContractManager = r => require.ensure([], () => r(require('components/MainPage/ContractManager/ContractManager')));
const InvoicePage = r => require.ensure([], () => r(require('components/MainPage/InvoicePage/InvoicePage')));
const CashPage = r => require.ensure([], () => r(require('components/MainPage/CashPage/CashPage')));
const OutContractListPage = r => require.ensure([], () => r(require('components/MainPage/OutContractListPage/OutContractListPage')));
const OutContractPaidPage = r => require.ensure([], () => r(require('components/MainPage/OutContractPaidPage/OutContractPaidPage')));
const StaffEntryPage = r => require.ensure([], () => r(require('components/MainPage/StaffEntryPage/StaffEntryPage')));
const StaffPage = r => require.ensure([], () => r(require('components/MainPage/StaffPage/StaffPage')));
const SalaryEntryPage = r => require.ensure([], () => r(require('components/MainPage/SalaryEntryPage/SalaryEntryPage')));
const ProjectExportPage = r => require.ensure([], () => r(require('components/MainPage/ProjectExportPage/ProjectExportPage')));
const SubEntryPage = r => require.ensure([], () => r(require('components/MainPage/SubEntryPage/SubEntryPage')));
const ApprovalManagement = r => require.ensure([], () => r(require('components/MainPage/ApprovalManagement/ApprovalManagement')));
const OutContractReceipt = r => require.ensure([], () => r(require('components/MainPage/OutContractReceiptPage/OutContractReceiptPage')));

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    path: '/user',
    redirect: '/user/login',
    hidden: true,
    component: UserLayout,
    children: [{
      path: 'login',
      name: 'LoginPage',
      component: LoginPage,
    }]
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage,
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'workplace',
        name: 'workplace',
        component: WorkPlace,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'project',
        name: 'project',
        component: ProjectPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'receipt',
        name: 'receipt',
        component: ReceiptPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: AnalysisPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'parameter',
        name: 'parameter',
        component: ParameterPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'users',
        name: 'users',
        component: UsersPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'contractmanager',
        name: 'contractManager',
        component: ContractManager,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: InvoicePage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'cash',
        name: 'cash',
        component: CashPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'outcontractlist',
        name: 'outcontractlist',
        component: OutContractListPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'outcontractpaid',
        name: 'outcontractpaid',
        component: OutContractPaidPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'outcontractreceipt',
        name: 'outcontractreceipt',
        component: OutContractReceipt,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'staffentry',
        name: 'staffentry',
        component: StaffEntryPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'staff',
        name: 'staff',
        component: StaffPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'salaryentry',
        name: 'salaryentry',
        component: SalaryEntryPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'projectexport',
        name: 'projectexport',
        component: ProjectExportPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'subentry',
        name: 'subentry',
        component: SubEntryPage,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: 'approvalmanagement',
        name: 'approvalmanagement',
        component: ApprovalManagement,
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
    ]
  }
];