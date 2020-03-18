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
      component: LoginPage,
    }]
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage,
    children: [
      {
        path: 'workplace',
        name: 'workplace',
        component: WorkPlace,
      },
      {
        path: 'project',
        name: 'project',
        component: ProjectPage,
      },
      {
        path: 'receipt',
        name: 'receipt',
        component: ReceiptPage,
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: AnalysisPage,
      },
      {
        path: 'parameter',
        name: 'parameter',
        component: ParameterPage,
      },
      {
        path: 'users',
        name: 'users',
        component: UsersPage,
      },
      {
        path: 'contractmanager',
        name: 'contractManager',
        component: ContractManager,
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: InvoicePage,
      },
      {
        path: 'cash',
        name: 'cash',
        component: CashPage,
      },
      {
        path: 'outcontractlist',
        name: 'outcontractlist',
        component: OutContractListPage,
      },
      {
        path: 'outcontractpaid',
        name: 'outcontractpaid',
        component: OutContractPaidPage,
      },
      {
        path: 'staffentry',
        name: 'staffentry',
        component: StaffEntryPage,
      },
      {
        path: 'staff',
        name: 'staff',
        component: StaffPage,
      },
      {
        path: 'salaryentry',
        name: 'salaryentry',
        component: SalaryEntryPage,
      },
      {
        path: 'projectexport',
        name: 'projectexport',
        component: ProjectExportPage,
      },
      {
        path: 'subentry',
        name: 'subentry',
        component: SubEntryPage,
      },
      {
        path: 'approvalmanagement',
        name: 'approvalmanagement',
        component: ApprovalManagement,
      },
    ]
  }
];