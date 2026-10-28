/**
 * SwapOS Core Calculation & Business Logic Utilities
 *
 * Provides centralized calculation utilities used directly by SwapOS components.
 * Preserves the original formulas and arithmetic for standard numeric application inputs.
 *
 * Note on Input Normalization:
 * For non-numeric, null, or undefined inputs, these helpers safely normalize
 * values via `Number(val) || 0`, returning 0 rather than NaN (which unhandled
 * arithmetic in raw JavaScript would produce).
 */

export const DEFAULT_ELECTRICITY_TARIFF = 6.50; // INR per kWh

/**
 * Calculates electricity cost for a given energy consumption.
 * Formula: energy * tariff (for numeric inputs)
 * Normalizes invalid/missing inputs to 0.
 *
 * @param {number} energyKwh - Energy consumed in kWh.
 * @param {number} [tariff=6.50] - Electricity tariff in INR/kWh.
 * @returns {number} Electricity cost preserving raw intermediate precision.
 */
export function calculateElectricityCost(energyKwh, tariff = DEFAULT_ELECTRICITY_TARIFF) {
  const energy = Number(energyKwh) || 0;
  const rate = Number(tariff) || 0;
  return energy * rate;
}

/**
 * Calculates gross margin between total revenue and electricity operating cost.
 * Formula: totalRevenue - electricityCost (for numeric inputs)
 * Normalizes invalid/missing inputs to 0.
 *
 * @param {number} totalRevenue - Total gross revenue in INR.
 * @param {number} electricityCost - Electricity cost in INR.
 * @returns {number} Gross margin preserving raw intermediate precision.
 */
export function calculateGrossMargin(totalRevenue, electricityCost) {
  const revenue = Number(totalRevenue) || 0;
  const cost = Number(electricityCost) || 0;
  return revenue - cost;
}

/**
 * Calculates the gross margin percentage rounded to the nearest integer.
 * Formula: totalRevenue > 0 ? Math.round((grossMargin / totalRevenue) * 100) : 0
 *
 * @param {number} grossMargin - Gross margin in INR.
 * @param {number} totalRevenue - Total revenue in INR.
 * @returns {number} Percentage as an integer (0-100).
 */
export function calculateMarginPercentage(grossMargin, totalRevenue) {
  const revenue = Number(totalRevenue) || 0;
  const margin = Number(grossMargin) || 0;
  return revenue > 0 ? Math.round((margin / revenue) * 100) : 0;
}

/**
 * Calculates the average revenue generated per completed battery swap.
 * Formula: totalSwaps > 0 ? totalRevenue / totalSwaps : 0
 *
 * @param {number} totalRevenue - Total revenue in INR.
 * @param {number} totalSwaps - Count of completed swaps.
 * @returns {number} Raw unrounded average revenue per swap.
 */
export function calculateAverageRevenuePerSwap(totalRevenue, totalSwaps) {
  const revenue = Number(totalRevenue) || 0;
  const swaps = Number(totalSwaps) || 0;
  return swaps > 0 ? revenue / swaps : 0;
}

/**
 * Filters a transaction list to retain only completed transactions.
 * Matches status case-insensitively ('COMPLETED').
 * Non-array inputs safely evaluate to an empty array.
 *
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @returns {Array<Object>} Filtered list of completed transactions.
 */
export function filterCompletedTransactions(transactions) {
  if (!Array.isArray(transactions)) return [];
  return transactions.filter(
    (tx) => String(tx?.status || "").toUpperCase() === "COMPLETED"
  );
}
