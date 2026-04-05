
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/helpers';

export default function SummaryCards() {
  const getSummary = useFinanceStore((s) => s.getSummary);
  const { balance, income, expenses } = getSummary();

  const cards = [
    {
      label: 'Total Balance',
      value: balance,
      icon: '◈',
      color: 'balance',
      prefix: balance >= 0 ? '+' : '',
      subtitle: 'Net worth this period',
    },
    {
      label: 'Total Income',
      value: income,
      icon: '↑',
      color: 'income',
      prefix: '+',
      subtitle: 'All earnings combined',
    },
    {
      label: 'Total Expenses',
      value: expenses,
      icon: '↓',
      color: 'expense',
      prefix: '-',
      subtitle: 'All spending combined',
    },
    {
      label: 'Savings Rate',
      value: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
      icon: '%',
      color: 'savings',
      isPercent: true,
      subtitle: 'Income saved',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card card-${card.color}`}>
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <span className="card-label">{card.label}</span>
          </div>
          <div className="card-value">
            {card.isPercent
              ? `${card.value}%`
              : `${card.prefix}${formatCurrency(card.value)}`}
          </div>
          <div className="card-subtitle">{card.subtitle}</div>
          <div className="card-glow" />
        </div>
      ))}
    </div>
  );
}
