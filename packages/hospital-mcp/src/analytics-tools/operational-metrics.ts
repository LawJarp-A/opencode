import {
    loadKPIMetrics,
    loadADTEvents,
} from "../analytics/data-loader.js";
import {
    calculateLengthOfStay,
    groupByPatient,
} from "../analytics/aggregators.js";
import { analyticsEngine } from "../analytics/engine.js";

/**
 * Get operational metrics like LOS, Occupancy, ED Waiting times
 */
export async function getOperationalMetrics(query?: {
    department?: string;
    period?: string;
}) {
    try {
        await analyticsEngine.initialize();
        const kpiMetrics = await loadKPIMetrics();
        const adtEvents = await loadADTEvents();

        // Filter metrics
        let filteredKPIs = kpiMetrics;
        if (query?.department) {
            filteredKPIs = filteredKPIs.filter(m => m.department === query.department);
        }
        if (query?.period) {
            filteredKPIs = filteredKPIs.filter(m => m.period === query.period);
        }

        // Get key operational metrics from KPI dashboard
        const avgLOS = filteredKPIs.find(m => m.metric_name === "Average Length of Stay")?.value || 0;
        const bedOccupancy = filteredKPIs.find(m => m.metric_name === "Bed Occupancy Rate")?.value || 0;
        const edWaitTime = filteredKPIs.find(m => m.metric_name === "Average ED Wait Time")?.value || 0;
        const lwbsRate = filteredKPIs.find(m => m.metric_name === "ED Left Without Being Seen Rate")?.value || 0;

        // Calculate real-time active census from ADT (approximate)
        const patientLocations = new Map<string, string>();
        adtEvents.sort((a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime())
            .forEach(e => {
                if (e.event_type === "Discharge") {
                    patientLocations.delete(e.patient_id);
                } else {
                    patientLocations.set(e.patient_id, e.to_unit);
                }
            });

        const currentCensus = patientLocations.size;

        return {
            average_length_of_stay: avgLOS,
            bed_occupancy_rate: bedOccupancy,
            ed_wait_time_minutes: edWaitTime,
            ed_lwbs_rate: lwbsRate,
            current_census: currentCensus,
            department: query?.department || "All",
            period: query?.period || "Current"
        };
    } catch (error: any) {
        throw new Error(`Failed to get operational metrics: ${error.message}`);
    }
}

/**
 * Analyze patient flow and bottlenecks
 */
export async function analyzePatientFlow(query?: { unit?: string }) {
    try {
        await analyticsEngine.initialize();
        const adtEvents = await loadADTEvents();

        // Simple flow analysis: Count transfers into specific units
        const transfersIn = adtEvents.filter(e =>
            e.event_type === "Transfer" && (!query?.unit || e.to_unit === query.unit)
        ).length;

        const admissions = adtEvents.filter(e =>
            e.event_type === "Admit" && (!query?.unit || e.to_unit === query.unit)
        ).length;

        const discharges = adtEvents.filter(e =>
            e.event_type === "Discharge" && (!query?.unit || e.from_unit === query.unit)
        ).length;

        return {
            unit: query?.unit || "All",
            admissions_count: admissions,
            transfers_in_count: transfersIn,
            discharges_count: discharges,
            net_flow: (admissions + transfersIn) - discharges
        };

    } catch (error: any) {
        throw new Error(`Failed to analyze patient flow: ${error.message}`);
    }
}
