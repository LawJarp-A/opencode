import type {
    VitalSigns,
    RiskScore,
    Diagnosis,
    ADTEvent,
    CriticalPatient,
    RiskFactor,
    UnitAcuity,
} from "../types/analytics.js";

/**
 * Calculate acuity score for a patient based on multiple factors
 */
export function calculatePatientAcuity(
    riskScores: RiskScore[],
    vitals: VitalSigns[],
    diagnoses: Diagnosis[],
    currentUnit: string
): number {
    let acuityScore = 0;

    // Risk score contribution (0-40 points)
    const highRiskCount = riskScores.filter((r) => r.risk_level === "High").length;
    const mediumRiskCount = riskScores.filter((r) => r.risk_level === "Medium").length;
    acuityScore += highRiskCount * 10 + mediumRiskCount * 5;

    // Vital signs contribution (0-30 points)
    if (vitals.length > 0) {
        const latestVitals = vitals[vitals.length - 1];
        let vitalScore = 0;

        // Temperature (fever or hypothermia)
        if (latestVitals.temperature_f > 100.4 || latestVitals.temperature_f < 95) vitalScore += 5;

        // Heart rate (tachycardia or bradycardia)
        if (latestVitals.heart_rate > 100 || latestVitals.heart_rate < 60) vitalScore += 5;

        // Blood pressure (hypertension or hypotension)
        if (latestVitals.bp_systolic > 140 || latestVitals.bp_systolic < 90) vitalScore += 5;

        // Respiratory rate
        if (latestVitals.respiratory_rate > 20 || latestVitals.respiratory_rate < 12) vitalScore += 5;

        // SpO2 (hypoxia)
        if (latestVitals.spo2 < 95) vitalScore += 5;

        // Pain score
        if (latestVitals.pain_score >= 7) vitalScore += 5;

        acuityScore += Math.min(vitalScore, 30);
    }

    // Diagnosis severity contribution (0-20 points)
    const severeCount = diagnoses.filter((d) => d.severity === "Severe" && d.status === "Active").length;
    const moderateCount = diagnoses.filter((d) => d.severity === "Moderate" && d.status === "Active").length;
    acuityScore += severeCount * 10 + moderateCount * 5;
    acuityScore = Math.min(acuityScore, 20); // Cap at 20

    // Unit-based contribution (0-10 points)
    const criticalUnits = ["ICU", "Emergency Department", "Step-Down Unit", "Telemetry"];
    if (criticalUnits.some((unit) => currentUnit.includes(unit))) {
        acuityScore += 10;
    }

    return Math.min(acuityScore, 100); // Cap at 100
}

/**
 * Identify risk factors for a patient
 */
export function identifyRiskFactors(
    riskScores: RiskScore[],
    vitals: VitalSigns[],
    diagnoses: Diagnosis[],
    currentUnit: string
): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // High-risk predictive scores
    const highRisks = riskScores.filter((r) => r.risk_level === "High");
    highRisks.forEach((risk) => {
        factors.push({
            category: "Predictive Risk",
            description: `High ${risk.risk_type}: ${risk.contributing_factors}`,
            severity: "High",
            value: risk.score,
        });
    });

    // Abnormal vital signs
    if (vitals.length > 0) {
        const latest = vitals[vitals.length - 1];

        if (latest.temperature_f > 100.4) {
            factors.push({
                category: "Vital Signs",
                description: `Fever: ${latest.temperature_f}°F`,
                severity: latest.temperature_f > 102 ? "High" : "Medium",
                value: latest.temperature_f,
            });
        }

        if (latest.spo2 < 95) {
            factors.push({
                category: "Vital Signs",
                description: `Low oxygen saturation: ${latest.spo2}%`,
                severity: latest.spo2 < 90 ? "High" : "Medium",
                value: latest.spo2,
            });
        }

        if (latest.heart_rate > 100) {
            factors.push({
                category: "Vital Signs",
                description: `Tachycardia: ${latest.heart_rate} bpm`,
                severity: latest.heart_rate > 120 ? "High" : "Medium",
                value: latest.heart_rate,
            });
        }

        if (latest.bp_systolic < 90) {
            factors.push({
                category: "Vital Signs",
                description: `Hypotension: ${latest.bp_systolic}/${latest.bp_diastolic} mmHg`,
                severity: "High",
                value: latest.bp_systolic,
            });
        }
    }

    // Severe diagnoses
    const severeDiagnoses = diagnoses.filter((d) => d.severity === "Severe" && d.status === "Active");
    severeDiagnoses.forEach((dx) => {
        factors.push({
            category: "Diagnosis",
            description: `Severe condition: ${dx.diagnosis}`,
            severity: "High",
            value: dx.icd10_code,
        });
    });

    // Critical unit location
    if (currentUnit.includes("ICU")) {
        factors.push({
            category: "Location",
            description: `Patient in ${currentUnit}`,
            severity: "High",
            value: currentUnit,
        });
    }

    return factors;
}

/**
 * Generate recommended actions based on risk factors
 */
export function generateRecommendedActions(riskFactors: RiskFactor[]): string[] {
    const actions: string[] = [];
    const categories = new Set(riskFactors.map((f) => f.category));

    if (riskFactors.some((f) => f.severity === "High" && f.category === "Predictive Risk")) {
        actions.push("Review predictive risk scores and implement preventive interventions");
    }

    if (riskFactors.some((f) => f.category === "Vital Signs" && f.description.includes("oxygen"))) {
        actions.push("Monitor oxygen saturation closely, consider supplemental oxygen");
    }

    if (riskFactors.some((f) => f.category === "Vital Signs" && f.description.includes("Hypotension"))) {
        actions.push("Assess for shock, consider fluid resuscitation");
    }

    if (riskFactors.some((f) => f.category === "Vital Signs" && f.description.includes("Fever"))) {
        actions.push("Investigate source of fever, consider sepsis workup");
    }

    if (riskFactors.some((f) => f.category === "Diagnosis" && f.severity === "High")) {
        actions.push("Ensure treatment plan addresses severe diagnoses");
    }

    if (categories.has("Location") && riskFactors.length > 3) {
        actions.push("Consider intensivist consultation");
    }

    if (actions.length === 0) {
        actions.push("Continue current monitoring and treatment plan");
    }

    return actions;
}

/**
 * Determine priority level based on acuity score
 */
export function determinePriorityLevel(acuityScore: number): "Critical" | "High" | "Medium" {
    if (acuityScore >= 70) return "Critical";
    if (acuityScore >= 40) return "High";
    return "Medium";
}

/**
 * Calculate average value from array of numbers
 */
export function calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate median value from array of numbers
 */
export function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Calculate percentile from array of numbers
 */
export function calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate rate (percentage)
 */
export function calculateRate(numerator: number, denominator: number): number {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
}
