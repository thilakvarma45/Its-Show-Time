// Utility functions for formatting data

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
};

export const formatBookingId = (id) => {
  if (!id) return null;
  const raw = String(id);
  // If backend already provided a BK-prefixed code, use it as-is.
  if (raw.toUpperCase().startsWith('BK')) return raw.toUpperCase();
  // Fallback for legacy numeric ids.
  return `BK${raw}`;
};
