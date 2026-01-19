import { Component, For, Show, createMemo } from "solid-js";
import { ChartRenderer } from "./ChartRenderer";
import { chartActions } from "@/context/chart-catalog";

interface ChartToolResult {
    toolName: string;
    result: any;
    input?: any;
}

/**
 * Detects if a tool result is from chart-mcp and contains a chart spec
 */
function isChartToolResult(toolName: string, result: any): boolean {
    if (!toolName?.startsWith("generate_")) return false;
    if (!result || typeof result !== "object") return false;

    // AntV MCP chart tools return specs with specific properties
    // Check for common G2 spec properties
    return !!(
        result.type ||
        result.data ||
        result.encode ||
        result.mark ||
        (Array.isArray(result) && result.length > 0) // Some charts return data arrays
    );
}

/**
 * Extracts chart metadata from tool name and input
 */
function extractChartMetadata(toolName: string, input: any) {
    const chartType = toolName.replace("generate_", "").replace("_chart", "");

    // Infer category from chart type or data source
    const categoryMap: Record<string, "Clinical" | "Operational" | "Financial" | "Pharmacy" | "Compliance"> = {
        pie: "Clinical",
        line: "Operational",
        bar: "Financial",
        funnel: "Pharmacy",
        sankey: "Operational",
        radar: "Financial",
        column: "Operational",
        scatter: "Clinical",
        area: "Operational",
        histogram: "Clinical",
        boxplot: "Operational",
    };

    const category = categoryMap[chartType] || "Clinical";

    // Extract title and description from input if available
    const title = input?.title || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`;
    const description = input?.description || `Generated ${chartType} chart from hospital data`;

    // Extract tags
    const tags: string[] = [chartType];
    if (input?.dataSource) {
        tags.push(...input.dataSource.split("_").filter((t: string) => t.length > 3));
    }

    return { title, description, category, tags: tags.slice(0, 5) };
}

/**
 * Chart-aware tool result renderer
 * Automatically detects chart specs and renders them visually
 */
export const ChartToolResultRenderer: Component<{
    toolResults: ChartToolResult[];
}> = (props) => {
    const chartResults = createMemo(() => {
        return props.toolResults
            .filter((tr) => isChartToolResult(tr.toolName, tr.result))
            .map((tr, index) => {
                const metadata = extractChartMetadata(tr.toolName, tr.input);

                // Auto-catalog chart
                const chartId = chartActions.add({
                    title: metadata.title,
                    description: metadata.description,
                    category: metadata.category,
                    spec: tr.result,
                    dataSource: tr.input?.dataSource || tr.toolName,
                    tags: metadata.tags,
                });

                return {
                    id: chartId,
                    spec: tr.result,
                    metadata,
                    toolName: tr.toolName,
                };
            });
    });

    return (
        <Show when={chartResults().length > 0}>
            <div class="flex flex-col gap-4 my-4">
                <For each={chartResults()}>
                    {(chart) => (
                        <div class="border border-border-base rounded-14 overflow-hidden bg-surface-raised">
                            {/* Chart Header */}
                            <div class="px-4 py-3 border-b border-border-base" style={{ background: "#FBF7F0" }}>
                                <p class="text-13-semibold text-text-base"
                                    style={{ "font-family": '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}>
                                    {chart.metadata.title}
                                </p>
                                <p class="text-11-regular text-text-subtle mt-0.5">
                                    {chart.metadata.description}
                                </p>
                            </div>

                            {/* Chart Render */}
                            <div class="p-4">
                                <ChartRenderer
                                    spec={chart.spec}
                                    containerId={`inline-chart-${chart.id}`}
                                    height={350}
                                />
                            </div>

                            {/* Chart Footer */}
                            <div class="px-4 py-2 border-t border-border-base text-11-regular text-text-subtle"
                                style={{ background: "#F6F1E8" }}>
                                <span class="mr-2">Category: {chart.metadata.category}</span>
                                <span>•</span>
                                <span class="ml-2">Saved to Canvas Mode</span>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </Show>
    );
};

/**
 * Hook to extract chart tool results from message parts
 * Use this in SessionTurn or message rendering components
 */
export function useChartToolResults(messageParts: any[]): ChartToolResult[] {
    if (!messageParts || !Array.isArray(messageParts)) return [];

    const chartResults: ChartToolResult[] = [];

    for (const part of messageParts) {
        if (part.type !== "tool_result") continue;
        if (!part.toolName) continue;

        const toolName = part.toolName;
        const result = part.result;
        const input = part.input;

        if (isChartToolResult(toolName, result)) {
            chartResults.push({ toolName, result, input });
        }
    }

    return chartResults;
}
