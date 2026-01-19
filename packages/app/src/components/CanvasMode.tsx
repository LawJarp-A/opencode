import { Component, For, Show, createSignal, createMemo } from "solid-js";
import { chartCatalog, chartActions, ChartMetadata } from "@/context/chart-catalog";
import { ChartRenderer } from "./ChartRenderer";
import { Button } from "@opencode-ai/ui/button";
import { Icon } from "@opencode-ai/ui/icon";
import { IconButton } from "@opencode-ai/ui/icon-button";

const categories = ["Clinical", "Operational", "Financial", "Pharmacy", "Compliance"] as const;

export const CanvasMode: Component<{ onClose: () => void }> = (props) => {
    const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);

    const filteredCharts = createMemo(() => {
        let charts = chartCatalog.charts;

        if (selectedCategory()) {
            charts = charts.filter((c) => c.category === selectedCategory());
        }

        return charts.sort((a, b) => b.updatedAt - a.updatedAt);
    });

    return (
        <div class="fixed inset-0 z-50 bg-surface-base flex flex-col">
            {/* Header */}
            <div class="h-14 border-b border-border-base flex items-center justify-between px-6"
                style={{ background: "#F6F1E8" }}>
                <div class="flex items-center gap-3">
                    <Icon name="chart-line" size="large" class="text-primary-base" />
                    <h1 class="text-20-semibold text-text-base"
                        style={{ "font-family": '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}>
                        Canvas Mode
                    </h1>
                    <span class="text-13-regular text-text-subtle">
                        {filteredCharts().length} chart{filteredCharts().length !== 1 ? "s" : ""}
                    </span>
                </div>
                <IconButton icon="x" onClick={props.onClose} />
            </div>

            {/* Category Filters */}
            <div class="border-b border-border-base px-6 py-3 flex gap-2"
                style={{ background: "#FBF7F0" }}>
                <Button
                    variant={selectedCategory() === null ? "filled" : "ghost"}
                    size="small"
                    onClick={() => setSelectedCategory(null)}
                >
                    All
                </Button>
                <For each={categories}>
                    {(category) => (
                        <Button
                            variant={selectedCategory() === category ? "filled" : "ghost"}
                            size="small"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    )}
                </For>
            </div>

            {/* Chart Grid */}
            <div class="flex-1 overflow-auto p-6" style={{ background: "#F6F1E8" }}>
                <Show
                    when={filteredCharts().length > 0}
                    fallback={
                        <div class="flex flex-col items-center justify-center h-full text-text-subtle">
                            <Icon name="chart-line" size="xlarge" class="mb-3 opacity-30" />
                            <p class="text-14-medium">No charts yet</p>
                            <p class="text-13-regular mt-1">Ask an agent to generate charts from hospital data</p>
                        </div>
                    }
                >
                    <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                        <For each={filteredCharts()}>
                            {(chart) => <ChartCard chart={chart} />}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
};

const ChartCard: Component<{ chart: ChartMetadata }> = (props) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const handleDelete = () => {
        if (confirm(`Delete "${props.chart.title}"?`)) {
            chartActions.delete(props.chart.id);
        }
    };

    const handleExport = () => {
        // Export functionality will be implemented in Phase 5
        console.log("Export chart:", props.chart.id);
        alert("Export feature coming soon!");
    };

    return (
        <div class="border border-border-base rounded-16 bg-surface-raised overflow-hidden"
            style={{ "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
            {/* Chart Render */}
            <div class="p-4">
                <ChartRenderer
                    spec={props.chart.spec}
                    containerId={`chart-${props.chart.id}`}
                    height={300}
                />
            </div>

            {/* Metadata */}
            <div class="border-t border-border-base p-4" style={{ background: "#FFFFFF" }}>
                <h3 class="text-14-semibold text-text-base mb-1"
                    style={{ "font-family": '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}>
                    {props.chart.title}
                </h3>
                <p class="text-12-regular text-text-subtle mb-3">{props.chart.description}</p>

                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-12-medium text-text-base px-2 py-1 rounded-8"
                        style={{
                            background: "#2563EB",
                            color: "#FFFFFF",
                            "font-family": '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
                        }}>
                        {props.chart.category}
                    </span>
                    <For each={props.chart.tags.slice(0, 3)}>
                        {(tag) => (
                            <span class="text-12-regular text-text-subtle px-2 py-1 rounded-8"
                                style={{ background: "#E6E0D8" }}>
                                {tag}
                            </span>
                        )}
                    </For>
                </div>

                <div class="flex items-center justify-between mt-3 pt-3 border-t"
                    style={{ "border-color": "#E6E0D8" }}>
                    <span class="text-11-regular text-text-subtle">
                        Updated {formatDate(props.chart.updatedAt)}
                    </span>
                    <div class="flex gap-1">
                        <IconButton
                            icon="download"
                            size="small"
                            onClick={handleExport}
                        />
                        <IconButton
                            icon="trash"
                            size="small"
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
