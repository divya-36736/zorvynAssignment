import Navbar from './components/layout/Navbar';
import SummaryCards from './components/dashboard/SummeryCards';
import Insights from './components/dashboard/Insights';
import TransactionList from './components/transactions/TransactionList';
import useFinanceStore from './store/useFinanceStore';
import './App.css';


function Dashboard() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Your financial snapshot at a glance</p>
      </div>
      <SummaryCards />
      <div className="section-divider" />
      <div className="page-header">
        <h2 className="section-title">Insights & Trends</h2>
      </div>
      <Insights />
    </div>
  );
}

function TransactionsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">Browse, filter and manage your transactions</p>
      </div>
      <TransactionList />
    </div>
  );
}

function InsightsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Understand your spending patterns</p>
      </div>
      <Insights />
    </div>
  );
}

export default function App() {
  const activeTab = useFinanceStore((s) => s.activeTab);

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'insights' && <InsightsPage />}
      </main>
    </div>
  );
}
