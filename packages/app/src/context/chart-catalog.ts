import { createStore } from "solid-js/store";
import { ulid } from "ulid";

export interface ChartMetadata {
    id: string; // Unique chart ID (ULID)
    title: string; // "Readmission Risk Distribution"
    description: string; // "Pie chart showing high/medium/low risk patients"
    category: "Clinical" | "Operational" | "Financial" | "Pharmacy" | "Compliance";
    spec: any; // AntV G2 chart spec (from chart-mcp)
    dataSource: string; // "analyze_readmission_risk"
    tags: string[]; // ["risk", "clinical-quality"]
    createdAt: number; // Timestamp
    updatedAt: number; // Timestamp
}

export interface ChartCatalogState {
    charts: ChartMetadata[];
}

export const [chartCatalog, setChartCatalog] = createStore<ChartCatalogState>({
    charts: [],
});

export const chartActions = {
    /**
     * Add a new chart to the catalog
     */
    add: (chart: Omit<ChartMetadata, "id" | "createdAt" | "updatedAt">): string => {
        const now = Date.now();
        const newChart: ChartMetadata = {
            ...chart,
            id: ulid(),
            createdAt: now,
            updatedAt: now,
        };
        setChartCatalog("charts", (prev) => [...prev, newChart]);
        return newChart.id;
    },

    /**
     * Update an existing chart's metadata or spec
     */
    update: (id: string, updates: Partial<Omit<ChartMetadata, "id" | "createdAt">>) => {
        setChartCatalog(
            "charts",
            (chart) => chart.id === id,
            { ...updates, updatedAt: Date.now() }
        );
    },

    /**
     * Delete a chart from the catalog
     */
    delete: (id: string) => {
        setChartCatalog("charts", (prev) => prev.filter((c) => c.id !== id));
    },

    /**
     * Get all charts in a specific category
     */
    getByCategory: (category: ChartMetadata["category"]) => {
        return chartCatalog.charts.filter((c) => c.category === category);
    },

    /**
     * Search charts by title, description, or tags
     */
    search: (query: string) => {
        const lower = query.toLowerCase();
        return chartCatalog.charts.filter(
            (c) =>
                c.title.toLowerCase().includes(lower) ||
                c.description.toLowerCase().includes(lower) ||
                c.tags.some((tag) => tag.toLowerCase().includes(lower))
        );
    },

    /**
     * Get chart by ID
     */
    getById: (id: string): ChartMetadata | undefined => {
        return chartCatalog.charts.find((c) => c.id === id);
    },

    /**
     * Clear all charts (useful for session reset)
     */
    clear: () => {
        setChartCatalog("charts", []);
    },
};
