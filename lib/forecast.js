// AushadhiSetu Forecast Module — enhanced with low_history + expiry check
// JS-only (not BQML) — disclosed in README

/**
 * @param {Array} transactions - sorted newest-first by date, each {issued, date}
 * @param {number} currentStock - on-hand units
 * @param {string|null} nearestExpiry - YYYY-MM-DD of soonest batch expiry
 * @returns forecast object with risk code
 */
export function calculateForecast(transactions, currentStock, nearestExpiry = null) {
  const low_history = !transactions || transactions.length < 30;

  if (!transactions || transactions.length === 0) {
    return { avg: 0, days: -1, stockout_date: null, code: 'GREEN', currentStock, low_history, expiry_days: null };
  }

  // Take last 14 entries (assumed sorted newest-first)
  const last14 = transactions.slice(0, 14);
  const sum = last14.reduce((s, tx) => s + (tx.issued || 0), 0);
  const avg = parseFloat((sum / last14.length).toFixed(2));

  // Days of stock
  const days = avg === 0 ? 999 : Math.floor(currentStock / avg);
  const stockout_date = avg === 0 ? null : new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

  // Expiry check
  let expiry_days = null;
  if (nearestExpiry) {
    expiry_days = Math.floor((new Date(nearestExpiry).getTime() - Date.now()) / 86400000);
  }

  // Risk code: RED <=14d, AMBER 15-30d OR expiry<=90d with overstock, GREEN else
  let code = 'GREEN';
  if (days <= 14) {
    code = 'RED';
  } else if (days <= 30) {
    code = 'AMBER';
  } else if (expiry_days !== null && expiry_days <= 90 && currentStock > avg * 30) {
    // Overstock with nearing expiry
    code = 'AMBER';
  }

  return { avg, days, stockout_date, code, currentStock, low_history, expiry_days };
}
