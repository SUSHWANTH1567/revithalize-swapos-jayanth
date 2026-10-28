import { describe, it, expect } from "vitest";
import {
  calculateElectricityCost,
  calculateGrossMargin,
  calculateMarginPercentage,
  calculateAverageRevenuePerSwap,
  filterCompletedTransactions,
  DEFAULT_ELECTRICITY_TARIFF,
} from "./calculations";

describe("SwapOS Financial Calculations", () => {
  it("uses the default tariff of ₹6.50/kWh", () => {
    expect(DEFAULT_ELECTRICITY_TARIFF).toBe(6.5);
  });

  it("calculates electricity cost preserving raw intermediate precision", () => {
    // Standard operational test: 2203.2 kWh * ₹6.50/kWh = 14320.8
    expect(calculateElectricityCost(2203.2)).toBe(14320.8);

    // Decimal energy preserves floating-point arithmetic
    expect(calculateElectricityCost(10.125, 6.5)).toBe(10.125 * 6.5);
  });

  it("calculates electricity cost with a custom tariff", () => {
    expect(calculateElectricityCost(100, 7.25)).toBe(725.0);
  });

  it("preserves arithmetic on negative energy values without artificial clamping", () => {
    expect(calculateElectricityCost(-10, 6.5)).toBe(-65);
  });

  it("safely handles 0, null, and non-numeric energy inputs", () => {
    expect(calculateElectricityCost(0)).toBe(0);
    expect(calculateElectricityCost(null)).toBe(0);
    expect(calculateElectricityCost(undefined)).toBe(0);
    expect(calculateElectricityCost("invalid")).toBe(0);
  });

  it("calculates gross margin accurately preserving raw floating-point precision", () => {
    // Standard operational test: Revenue: 27,540, Cost: 14,320.80 -> Margin: 13,219.2
    expect(calculateGrossMargin(27540, 14320.8)).toBe(27540 - 14320.8);
  });

  it("calculates negative gross margin when costs exceed revenue", () => {
    expect(calculateGrossMargin(5000, 7500)).toBe(-2500);
  });

  it("calculates margin percentage matching SwapOS baseline (~48%)", () => {
    // ₹133,056 margin on ₹277,200 revenue = 47.999% -> rounds to 48%
    expect(calculateMarginPercentage(133056, 277200)).toBe(48);
  });

  it("returns zero margin percentage when revenue is zero or negative (division-by-zero defense)", () => {
    expect(calculateMarginPercentage(500, 0)).toBe(0);
    expect(calculateMarginPercentage(0, 0)).toBe(0);
    expect(calculateMarginPercentage(100, -500)).toBe(0);
  });

  it("calculates average revenue per swap without premature rounding", () => {
    // ₹270,000 across 3,000 swaps = 90
    expect(calculateAverageRevenuePerSwap(270000, 3000)).toBe(90);

    // Decimal value preserved unrounded for call-site formatting
    expect(calculateAverageRevenuePerSwap(100, 3)).toBe(100 / 3);
  });

  it("returns zero for average revenue per swap when swaps are zero (division-by-zero defense)", () => {
    expect(calculateAverageRevenuePerSwap(50000, 0)).toBe(0);
    expect(calculateAverageRevenuePerSwap(0, 0)).toBe(0);
  });
});

describe("SwapOS Transaction Filtering", () => {
  it("filters completed transactions correctly, case-insensitively", () => {
    const mockTransactions = [
      { id: "TX-1", status: "COMPLETED", amount: 90 },
      { id: "TX-2", status: "completed", amount: 90 },
      { id: "TX-3", status: "Completed", amount: 90 },
      { id: "TX-4", status: "FAILED", amount: 90 },
      { id: "TX-5", status: "PENDING", amount: 90 },
      { id: "TX-6", status: null, amount: 90 },
      { id: "TX-7", amount: 90 }, // missing status key
    ];

    const completed = filterCompletedTransactions(mockTransactions);
    expect(completed).toHaveLength(3);
    expect(completed.map((t) => t.id)).toEqual(["TX-1", "TX-2", "TX-3"]);
  });

  it("handles empty arrays, null, and non-array inputs safely", () => {
    expect(filterCompletedTransactions([])).toEqual([]);
    expect(filterCompletedTransactions(null)).toEqual([]);
    expect(filterCompletedTransactions(undefined)).toEqual([]);
    expect(filterCompletedTransactions("not-an-array")).toEqual([]);
    expect(filterCompletedTransactions({})).toEqual([]);
  });
});
