import type {
    VitalSigns,
    RiskScore,
    Diagnosis,
    ADTEvent,
    UnitAcuity,
} from "../types/analytics.js";
import { calculateAverage } from "./calculators.js";

/**
 * Group data by patient ID
 */
export function groupByPatient<T extends { patient_id: string }>(data: T[]): Map<string, T[]> {
    const grouped = new Map<string, T[]>();
    for (const item of data) {
        const existing = grouped.get(item.patient_id) || [];
        existing.push(item);
        grouped.set(item.patient_id, existing);
    }
    return grouped;
}

/**
 * Group data by unit
 */
export function groupByUnit(adtEvents: ADTEvent[]): Map<string, string[]> {
    const unitPatients = new Map<string, Set<string>>();

    // Get the most recent event for each patient to determine current unit
    const patientLatestEvent = new Map<string, ADTEvent>();
    for (const event of adtEvents) {
        const existing = patientLatestEvent.get(event.patient_id);
        if (!existing || new Date(event.event_timestamp) > new Date(existing.event_timestamp)) {
            patientLatestEvent.set(event.patient_id, event);
        }
    }

    // Group patients by their current unit
    for (const [patientId, event] of patientLatestEvent.entries()) {
        const unit = event.event_type === "Discharge" ? "Discharged" : event.to_unit;
        if (!unitPatients.has(unit)) {
            unitPatients.set(unit, new Set());
        }
        unitPatients.get(unit)!.add(patientId);
    }

    // Convert Sets to Arrays
    const result = new Map<string, string[]>();
    for (const [unit, patients] of unitPatients.entries()) {
        result.set(unit, Array.from(patients));
    }

    return result;
}

/**
 * Get current unit for a patient
 */
export function getCurrentUnit(patientId: string, adtEvents: ADTEvent[]): string {
    const patientEvents = adtEvents
        .filter((e) => e.patient_id === patientId)
        .sort((a, b) => new Date(b.event_timestamp).getTime() - new Date(a.event_timestamp).getTime());

    if (patientEvents.length === 0) return "Unknown";

    const latestEvent = patientEvents[0];
    if (latestEvent.event_type === "Discharge") return "Discharged";

    return latestEvent.to_unit;
}

/**
 * Filter data by date range
 */
export function filterByDateRange<T extends { [key: string]: any }>(
    data: T[],
    dateField: keyof T,
    startDate?: string,
    endDate?: string
): T[] {
    return data.filter((item) => {
        const itemDate = new Date(item[dateField] as string);
        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;
        return true;
    });
}

/**
 * Get most recent records per patient
 */
export function getMostRecentPerPatient<T extends { patient_id: string;[key: string]: any }>(
    data: T[],
    dateField: keyof T,
    limit: number = 1
): Map<string, T[]> {
    const grouped = groupByPatient(data);
    const result = new Map<string, T[]>();

    for (const [patientId, records] of grouped.entries()) {
        const sorted = records.sort(
            (a, b) => new Date(b[dateField] as string).getTime() - new Date(a[dateField] as string).getTime()
        );
        result.set(patientId, sorted.slice(0, limit));
    }

    return result;
}

/**
 * Calculate aggregated statistics for a numeric field
 */
export interface AggregateStats {
    count: number;
    sum: number;
    average: number;
    min: number;
    max: number;
}

export function aggregateNumericField<T>(data: T[], field: keyof T): AggregateStats {
    const values = data.map((item) => Number(item[field])).filter((val) => !isNaN(val));

    if (values.length === 0) {
        return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
    }

    return {
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        average: calculateAverage(values),
        min: Math.min(...values),
        max: Math.max(...values),
    };
}

/**
 * Count occurrences by category
 */
export function countByCategory<T>(data: T[], field: keyof T): Map<string, number> {
    const counts = new Map<string, number>();

    for (const item of data) {
        const value = String(item[field]);
        counts.set(value, (counts.get(value) || 0) + 1);
    }

    return counts;
}

/**
 * Calculate percentage distribution by category
 */
export function percentageDistribution<T>(data: T[], field: keyof T): Map<string, number> {
    const counts = countByCategory(data, field);
    const total = data.length;
    const percentages = new Map<string, number>();

    for (const [category, count] of counts.entries()) {
        percentages.set(category, (count / total) * 100);
    }

    return percentages;
}

/**
 * Get active diagnoses for patients
 */
export function getActiveDiagnoses(diagnoses: Diagnosis[]): Diagnosis[] {
    return diagnoses.filter((d) => d.status === "Active" || d.status === "Chronic");
}

/**
 * Get high-risk patients from risk scores
 */
export function getHighRiskPatients(riskScores: RiskScore[]): Set<string> {
    const highRiskPatients = new Set<string>();

    for (const score of riskScores) {
        if (score.risk_level === "High") {
            highRiskPatients.add(score.patient_id);
        }
    }

    return highRiskPatients;
}

/**
 * Calculate time-based metrics (e.g., length of stay)
 */
export function calculateLengthOfStay(adtEvents: ADTEvent[], patientId: string): number | null {
    const patientEvents = adtEvents
        .filter((e) => e.patient_id === patientId)
        .sort((a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime());

    const admission = patientEvents.find((e) => e.event_type === "Admit");
    const discharge = patientEvents.find((e) => e.event_type === "Discharge");

    if (!admission) return null;
    if (!discharge) {
        // Patient still admitted, calculate current LOS
        const now = new Date();
        const admitDate = new Date(admission.event_timestamp);
        return (now.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24); // Days
    }

    const admitDate = new Date(admission.event_timestamp);
    const dischargeDate = new Date(discharge.event_timestamp);
    return (dischargeDate.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24); // Days
}
