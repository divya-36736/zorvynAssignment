export const formatCurrency = (amount, compact = false) => {
  const abs = Math.abs(amount);
  if (compact && abs >= 100000) {
    return `₹${(abs / 100000).toFixed(1)}L`;
  }
  if (compact && abs >= 1000) {
    return `₹${(abs / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(abs);
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const d = new Date(year, month - 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const CATEGORY_COLORS = {
  Income: '#22c55e',
  Shopping: '#f59e0b',
  Food: '#ef4444',
  Entertainment: '#8b5cf6',
  Utilities: '#06b6d4',
  Health: '#ec4899',
  Transport: '#3b82f6',
  Housing: '#f97316',
  Other: '#6b7280',
};

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

export const CATEGORY_ICONS = {
  Income: '💰',
  Shopping: '🛍️',
  Food: '🍽️',
  Entertainment: '🎬',
  Utilities: '⚡',
  Health: '🏥',
  Transport: '🚗',
  Housing: '🏠',
  Other: '📦',
};

export const getCategoryIcon = (category) =>
  CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
