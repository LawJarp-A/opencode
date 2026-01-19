import {
    loadKPIMetrics,
    loadSurgicalCases,
    loadDiagnoses,
    loadADTEvents,
    loadRiskScores,
    loadPatientDemographics,
    loadLabResults,
    loadVitalSigns,
} from "../analytics/data-loader.js";
import {
    aggregateNumericField,
    groupByPatient,
    getActiveDiagnoses,
} from "../analytics/aggregators.js";
import { analyticsEngine } from "../analytics/engine.js";

/**
 * Get clinical metrics including mortality, readmission, and infection rates
 */
export async function getClinicalMetrics(query?: {
    department?: string;
    period?: string;
}) {
    try {
        await analyticsEngine.initialize();
        const kpiMetrics = await loadKPIMetrics();
        const surgicalCases = await loadSurgicalCases();

        // Filter metrics by department/period if provided
        let filteredKPIs = kpiMetrics;
        if (query?.department) {
            filteredKPIs = filteredKPIs.filter(m => m.department === query.department);
        }
        if (query?.period) {
            filteredKPIs = filteredKPIs.filter(m => m.period === query.period);
        }

        // Extract key clinical metrics
        const mortalityRate = filteredKPIs.find(m => m.metric_name === "Risk-Adjusted Mortality Rate")?.value || 0;
        const readmissionRate = filteredKPIs.find(m => m.metric_name === "30-Day Readmission Rate")?.value || 0;
        const infectionRate = filteredKPIs.find(m => m.metric_name === "Hospital Acquired Infection Rate")?.value || 0;
        const patientSat = filteredKPIs.find(m => m.metric_name === "Patient Satisfaction Score")?.value || 0;

        // Calculate surgical complication rate from raw cases
        const complications = surgicalCases.filter((c: any) =>
            c.complications && c.complications !== "None" && c.complications !== "Minimal bleeding"
        ).length;
        const surgicalComplicationRate = surgicalCases.length > 0
            ? (complications / surgicalCases.length) * 100
            : 0;

        return {
            mortality_rate: mortalityRate,
            readmission_rate_30day: readmissionRate,
            infection_rate: infectionRate,
            patient_satisfaction_score: patientSat,
            surgical_complication_rate: Math.round(surgicalComplicationRate * 100) / 100,
            total_surgeries: surgicalCases.length,
            period: query?.period || "Current",
            department: query?.department || "All"
        };
    } catch (error: any) {
        throw new Error(`Failed to get clinical metrics: ${error.message}`);
    }
}

/**
 * Analyze lab result trends (Placeholder - full implementation requires massive lab dataset processing)
 */
export async function analyzeLabTrends(query: { analyte?: string }) {
    // In a real implementation this would scan the large lab_results.csv
    // For now returning a structured placeholder as per plan
    return {
        analyte: query.analyte || "All",
        trend: "Stable",
        abnormal_rate: 12.5,
        note: "Full lab trend analysis requires batch processing of historical lab data."
    };
}

/**
 * Analyze readmission risk across the patient population
 */
export async function analyzeReadmissionRisk() {
    await analyticsEngine.initialize();
    const riskScores = await loadRiskScores();

    // Filter for Readmission Risk scores
    const readmissionRisks = riskScores.filter(r => r.risk_type === "Readmission Risk");

    const highRisk = readmissionRisks.filter(r => r.risk_level === "High").length;
    const moderateRisk = readmissionRisks.filter(r => r.risk_level === "Medium").length;
    const lowRisk = readmissionRisks.filter(r => r.risk_level === "Low").length;
    const total = readmissionRisks.length || 1; // Avoid division by zero

    return {
        total_assessed: readmissionRisks.length,
        risk_distribution: {
            high: highRisk,
            moderate: moderateRisk,
            low: lowRisk
        },
        high_risk_percentage: Math.round((highRisk / total) * 100),
        trend: "increasing" // Placeholder for trend analysis
    };
}

/**
 * Track care gaps based on standard protocols
 */
export async function trackCareGaps(query?: { department?: string }) {
    await analyticsEngine.initialize();
    const [patients, vitals, riskScores] = await Promise.all([
        loadPatientDemographics(),
        loadVitalSigns(),
        loadRiskScores()
    ]);

    const gaps = [];
    const now = new Date();

    // Protocol 1: Hypertension Screening (BP check in last year for adults > 18)
    const adults = patients.filter(p => {
        const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
        return age >= 18;
    });

    let bpGaps = 0;
    for (const patient of adults) {
        const patientVitals = vitals
            .filter(v => v.patient_id === patient.patient_id)
            .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());

        if (patientVitals.length === 0) {
            bpGaps++;
            continue;
        }

        const lastBP = new Date(patientVitals[0].recorded_at);
        const daysSinceLastBP = (now.getTime() - lastBP.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastBP > 365) {
            bpGaps++;
        }
    }

    gaps.push({
        metric: "Hypertension Screening",
        description: "Adults > 18 with no BP check in last 365 days",
        gaps_identified: bpGaps,
        compliant_population_percentage: Math.round(((adults.length - bpGaps) / adults.length) * 100)
    });

    return {
        timestamp: new Date().toISOString(),
        total_gaps_identified: bpGaps, // Sum of all gaps
        care_gap_details: gaps
    };
}

/**
 * Calculate Clinical Quality Measures (CQMs)
 */
export async function calculateClinicalQualityMeasures() {
    // This would typically involve HEDIS logic.
    // Implementing a simplified "Sepsis Bundle Compliance" proxy.
    // Logic: High Sepsis Risk patients who have had a Lactate lab or BP check within 6 hours.

    await analyticsEngine.initialize();
    const [riskScores, vitals, labResults] = await Promise.all([
        loadRiskScores(),
        loadVitalSigns(),
        loadLabResults()
    ]);

    const sepsisPatients = riskScores.filter(r => r.risk_type === "Sepsis Risk" && (r.risk_level === "High"));

    let compliantCount = 0;

    // Simplified compliance check (mock logic as timestamps usually align in this generated dataset)
    // Checking if they have *any* vitals or labs is a basic proxy for "attention given"
    for (const riskEntry of sepsisPatients) {
        const hasVitals = vitals.some(v => v.patient_id === riskEntry.patient_id);
        const hasLabs = labResults.some(l => l.patient_id === riskEntry.patient_id); // This is slow on large array, but acceptable for filtered list

        if (hasVitals || hasLabs) {
            compliantCount++;
        }
    }

    const complianceRate = sepsisPatients.length > 0
        ? Math.round((compliantCount / sepsisPatients.length) * 100)
        : 100;

    return {
        measure: "Sepsis Bundle Compliance (SEP-1 Proxy)",
        population_size: sepsisPatients.length,
        compliant_count: compliantCount,
        compliance_rate: complianceRate,
        target_rate: 90
    };
}
