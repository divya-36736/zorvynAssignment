import { useMemo } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency, formatMonth, getCategoryColor, getCategoryIcon } from '../../utils/helpers';

function MiniBarChart({ data, valueKey, labelKey, color = '#22d3ee' }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="mini-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-item">
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }}
            />
          </div>
          <span className="bar-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  let offset = 0;
  const segments = data.slice(0, 6).map((d) => {
    const pct = (d.total / total) * 100;
    const seg = { ...d, pct, offset };
    offset += pct;
    return seg;
  });

  const r = 60, cx = 80, cy = 80;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="donut-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={getCategoryColor(seg.category)}
            strokeWidth="20"
            strokeDasharray={`${(seg.pct / 100) * circumference} ${circumference}`}
            strokeDashoffset={-((seg.offset / 100) * circumference)}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="inherit">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold" fontFamily="inherit">
          {formatCurrency(total, true)}
        </text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg) => (
          <div key={seg.category} className="legend-item">
            <span className="legend-dot" style={{ background: getCategoryColor(seg.category) }} />
            <span className="legend-name">{seg.category}</span>
            <span className="legend-pct">{seg.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Insights() {
  const getCategoryBreakdown = useFinanceStore((s) => s.getCategoryBreakdown);
  const getMonthlyTrend = useFinanceStore((s) => s.getMonthlyTrend);
  const getSummary = useFinanceStore((s) => s.getSummary);

  const breakdown = getCategoryBreakdown();
  const monthly = getMonthlyTrend();
  const { income, expenses } = getSummary();

  const topCategory = breakdown[0];
  const lastTwo = monthly.slice(-2);
  const monthChange = lastTwo.length === 2
    ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses * 100).toFixed(1)
    : 0;

  const insights = useMemo(() => [
    {
      icon: '🔥',
      title: 'Highest Spending',
      value: topCategory ? `${getCategoryIcon(topCategory.category)} ${topCategory.category}` : '—',
      sub: topCategory ? formatCurrency(topCategory.total) : '',
      color: '#f59e0b',
    },
    {
      icon: '📊',
      title: 'Month-over-Month',
      value: `${monthChange > 0 ? '+' : ''}${monthChange}%`,
      sub: 'vs previous month spending',
      color: monthChange > 0 ? '#ef4444' : '#22c55e',
    },
    {
      icon: '💡',
      title: 'Savings Rate',
      value: income > 0 ? `${Math.round(((income - expenses) / income) * 100)}%` : '—',
      sub: 'of total income saved',
      color: '#22d3ee',
    },
    {
      icon: '📈',
      title: 'Income Sources',
      value: `${monthly.reduce((s, m) => s + (m.income > 0 ? 1 : 0), 0)} months active`,
      sub: `Avg ${formatCurrency(income / Math.max(monthly.length, 1), true)}/mo`,
      color: '#8b5cf6',
    },
  ], [breakdown, monthly]);

  return (
    <div className="insights-container">
      <div className="insight-cards">
        {insights.map((ins) => (
          <div key={ins.title} className="insight-card">
            <div className="insight-icon">{ins.icon}</div>
            <div className="insight-title">{ins.title}</div>
            <div className="insight-value" style={{ color: ins.color }}>{ins.value}</div>
            <div className="insight-sub">{ins.sub}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h3 className="chart-title">Spending by Category</h3>
          {breakdown.length > 0 ? (
            <DonutChart data={breakdown} />
          ) : (
            <div className="empty-state">No expense data</div>
          )}
        </div>

        <div className="chart-box">
          <h3 className="chart-title">Monthly Income Trend</h3>
          {monthly.length > 0 ? (
            <MiniBarChart
              data={monthly.map((m) => ({ ...m, label: formatMonth(m.month).split(' ')[0] }))}
              valueKey="income"
              labelKey="label"
              color="#22c55e"
            />
          ) : (
            <div className="empty-state">No trend data</div>
          )}
        </div>

        <div className="chart-box">
          <h3 className="chart-title">Monthly Expenses Trend</h3>
          {monthly.length > 0 ? (
            <MiniBarChart
              data={monthly.map((m) => ({ ...m, label: formatMonth(m.month).split(' ')[0] }))}
              valueKey="expenses"
              labelKey="label"
              color="#f87171"
            />
          ) : (
            <div className="empty-state">No trend data</div>
          )}
        </div>
      </div>

      <div className="category-breakdown-list">
        <h3 className="chart-title">Category Details</h3>
        {breakdown.length === 0 && <div className="empty-state">No data available</div>}
        {breakdown.map((b, i) => {
          const total = breakdown.reduce((s, x) => s + x.total, 0);
          const pct = ((b.total / total) * 100).toFixed(1);
          return (
            <div key={b.category} className="breakdown-row">
              <span className="breakdown-rank">#{i + 1}</span>
              <span className="breakdown-icon">{getCategoryIcon(b.category)}</span>
              <span className="breakdown-name">{b.category}</span>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${pct}%`, background: getCategoryColor(b.category) }}
                />
              </div>
              <span className="breakdown-pct">{pct}%</span>
              <span className="breakdown-amount">{formatCurrency(b.total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
