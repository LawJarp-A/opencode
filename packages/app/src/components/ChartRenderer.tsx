import { Chart } from '@antv/g2';
import { onMount, onCleanup, createEffect } from 'solid-js';

interface ChartRendererProps {
    spec: any; // Chart specification from MCP chart tools
    containerId: string;
    height?: number;
}

/**
 * ChartRenderer - Renders AntV G2 charts from MCP-generated specifications
 * 
 * This component takes a chart spec returned by the chart-mcp server
 * (e.g., from generate_pie_chart, generate_line_chart, etc.) and
 * renders it using AntV G2 with ShopOS design system styling.
 * 
 * Usage:
 * ```tsx
 * <ChartRenderer
 *   spec={chartSpecFromAgent}
 *   containerId="readmission-chart"
 *   height={400}
 * />
 * ```
 */
export function ChartRenderer(props: ChartRendererProps) {
    let containerRef: HTMLDivElement | undefined;
    let chartInstance: Chart | null = null;

    onMount(() => {
        if (containerRef && props.spec) {
            // Initialize chart with ShopOS styling
            chartInstance = new Chart({
                container: containerRef,
                autoFit: true,
                height: props.height || 400,
            });

            // Apply global theme overrides for ShopOS design system
            chartInstance.theme({
                // Use beige/matte background instead of white
                backgroundColor: '#F6F1E8',

                // Typography: Segoe UI font stack
                fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',

                // Colors: Restrained palette (no loud colors)
                colors10: [
                    '#2563EB', // Primary Blue
                    '#16A34A', // Success Green
                    '#D97706', // Warning Amber
                    '#DC2626', // Error Red
                    '#E7B68C', // Warm Peach
                    '#5C5C5C', // Muted Gray
                    '#8A8A8A', // Tertiary Gray
                    '#141414', // Near Black
                    '#FBF7F0', // Warm Off-White
                    '#E6E0D8', // Border Subtle
                ],

                // Subtle borders and shadows
                stroke: '#E6E0D8',
                styleSheet: {
                    brandColor: '#2563EB',
                    backgroundColor: '#FFFFFF',
                },
            });

            // Apply the chart spec from MCP
            chartInstance.options(props.spec);
            chartInstance.render();
        }
    });

    // Update chart when spec changes
    createEffect(() => {
        if (chartInstance && props.spec) {
            chartInstance.changeData(props.spec.data);
            chartInstance.render();
        }
    });

    // Cleanup on unmount
    onCleanup(() => {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    });

    return (
        <div
            ref={containerRef}
            id={props.containerId}
            style={{
                width: '100%',
                height: `${props.height || 400}px`,
                background: '#FFFFFF',
                border: '1px solid #E6E0D8',
                'border-radius': '14px',
                padding: '16px',
                'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
        />
    );
}
