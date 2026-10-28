import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDashboard,
  getStations,
  getBatteries,
  getRiders,
  getTransactions,
} from "./api";

const EXPECTED_BASE = "https://revithalize-swapos-jayanth.onrender.com";

describe("SwapOS API Service Layer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getDashboard fetches from correct URL and returns JSON", async () => {
    const mockDashboardData = {
      totalStations: 5,
      totalBatteries: 24,
      totalSwaps: 3600,
      revenue: 277200,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDashboardData,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getDashboard();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(`${EXPECTED_BASE}/api/dashboard`);
    expect(result).toEqual(mockDashboardData);
  });

  it("getDashboard throws error on HTTP failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(getDashboard()).rejects.toThrow("Failed to load dashboard");
  });

  it("getStations fetches from /api/stations", async () => {
    const mockStations = [
      { id: 1, name: "Station 01", location: "Warangal Central" },
      { id: 2, name: "Station 02", location: "Kazipet" },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockStations,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getStations();

    expect(mockFetch).toHaveBeenCalledWith(`${EXPECTED_BASE}/api/stations`);
    expect(result).toEqual(mockStations);
  });

  it("getStations throws error on HTTP failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(getStations()).rejects.toThrow("Failed to load stations");
  });

  it("getBatteries fetches from /api/batteries", async () => {
    const mockBatteries = [
      { id: "BAT-1001", soc: 96, status: "CHARGED" },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBatteries,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getBatteries();

    expect(mockFetch).toHaveBeenCalledWith(`${EXPECTED_BASE}/api/batteries`);
    expect(result).toEqual(mockBatteries);
  });

  it("getBatteries throws error on HTTP failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(getBatteries()).rejects.toThrow("Failed to load batteries");
  });

  it("getRiders fetches from /api/riders", async () => {
    const mockRiders = [
      { id: 1, name: "Rider 1", status: "ACTIVE" },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRiders,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getRiders();

    expect(mockFetch).toHaveBeenCalledWith(`${EXPECTED_BASE}/api/riders`);
    expect(result).toEqual(mockRiders);
  });

  it("getRiders throws error on HTTP failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(getRiders()).rejects.toThrow("Failed to load riders");
  });

  it("getTransactions fetches from /api/transactions", async () => {
    const mockTransactions = [
      { id: "TX-1", amount: 90, status: "COMPLETED" },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTransactions,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getTransactions();

    expect(mockFetch).toHaveBeenCalledWith(`${EXPECTED_BASE}/api/transactions`);
    expect(result).toEqual(mockTransactions);
  });

  it("getTransactions throws error on HTTP failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(getTransactions()).rejects.toThrow("Failed to load transactions");
  });
});
