import {
    loadVitalSigns,
    loadRiskScores,
    loadDiagnoses,
    loadADTEvents,
    loadKPIMetrics,
    preloadCache,
} from "./data-loader.js";
import {
    groupByPatient,
    getCurrentUnit,
    getMostRecentPerPatient,
    getActiveDiagnoses,
    getHighRiskPatients,
} from "./aggregators.js";
import {
    calculatePatientAcuity,
    identifyRiskFactors,
    generateRecommendedActions,
    determinePriorityLevel,
} from "./calculators.js";
import type {
    CriticalPatient,
    UnitAcuity,
    CriticalPatientQuery,
} from "../types/analytics.js";

/**
 * Main Analytics Engine
 */
export class AnalyticsEngine {
    private initialized = false;

    /**
     * Initialize the analytics engine and preload data
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;
        await preloadCache();
        this.initialized = true;
    }

    /**
     * Ensure engine is initialized
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }

    /**
     * Identify critical patients across the hospital
     */
    async identifyCriticalPatients(query?: CriticalPatientQuery): Promise<CriticalPatient[]> {
        await this.ensureInitialized();

        // Load all necessary data
        const [riskScores, vitalSigns, diagnoses, adtEvents] = await Promise.all([
            loadRiskScores(),
            loadVitalSigns(),
            loadDiagnoses(),
            loadADTEvents(),
        ]);

        // Group data by patient
        const riskByPatient = groupByPatient(riskScores);
        const vitalsPerPatient = getMostRecentPerPatient(vitalSigns, "recorded_at", 5);
        const diagnosesPerPatient = groupByPatient(getActiveDiagnoses(diagnoses));

        // Get all unique patient IDs
        const allPatientIds = new Set([
            ...riskByPatient.keys(),
            ...vitalsPerPatient.keys(),
            ...diagnosesPerPatient.keys(),
        ]);

        const criticalPatients: CriticalPatient[] = [];

        // Analyze each patient
        for (const patientId of allPatientIds) {
            const patientRisks = riskByPatient.get(patientId) || [];
            const patientVitals = vitalsPerPatient.get(patientId) || [];
            const patientDiagnoses = diagnosesPerPatient.get(patientId) || [];
            const currentUnit = getCurrentUnit(patientId, adtEvents);

            // Skip discharged patients
            if (currentUnit === "Discharged") continue;

            // Filter by unit if specified
            if (query?.unit && !currentUnit.includes(query.unit)) continue;

            // Calculate acuity score
            const acuityScore = calculatePatientAcuity(
                patientRisks,
                patientVitals,
                patientDiagnoses,
                currentUnit
            );

            // Filter by minimum acuity score if specified
            if (query?.min_acuity_score && acuityScore < query.min_acuity_score) continue;

            // Skip stable patients if requested
            if (!query?.include_stable && acuityScore < 40) continue;

            // Identify risk factors
            const riskFactors = identifyRiskFactors(
                patientRisks,
                patientVitals,
                patientDiagnoses,
                currentUnit
            );

            // Filter by risk types if specified
            if (query?.risk_types && query.risk_types.length > 0) {
                const hasRequestedRisk = patientRisks.some((r) =>
                    query.risk_types!.includes(r.risk_type)
                );
                if (!hasRequestedRisk) continue;
            }

            // Generate recommended actions
            const recommendedActions = generateRecommendedActions(riskFactors);

            // Determine priority level
            const priorityLevel = determinePriorityLevel(acuityScore);

            criticalPatients.push({
                patient_id: patientId,
                patient_name: `Patient ${patientId}`, // Would need to join with patient demographics
                current_unit: currentUnit,
                risk_factors: riskFactors,
                acuity_score: Math.round(acuityScore * 10) / 10, // Round to 1 decimal
                priority_level: priorityLevel,
                recommended_actions: recommendedActions,
            });
        }

        // Sort by acuity score (highest first)
        criticalPatients.sort((a, b) => b.acuity_score - a.acuity_score);

        return criticalPatients;
    }

    /**
     * Analyze acuity for a specific unit
     */
    async analyzeUnitAcuity(unitName: string): Promise<UnitAcuity | null> {
        await this.ensureInitialized();

        const criticalPatients = await this.identifyCriticalPatients({ unit: unitName, include_stable: true });

        if (criticalPatients.length === 0) {
            return null;
        }

        const acuityScores = criticalPatients.map((p) => p.acuity_score);
        const averageAcuity = acuityScores.reduce((sum, score) => sum + score, 0) / acuityScores.length;

        const criticalCount = criticalPatients.filter((p) => p.priority_level === "Critical").length;
        const highRiskCount = criticalPatients.filter((p) => p.priority_level === "High").length;

        let acuityLevel: "Critical" | "High" | "Moderate" | "Low";
        if (averageAcuity >= 70) acuityLevel = "Critical";
        else if (averageAcuity >= 50) acuityLevel = "High";
        else if (averageAcuity >= 30) acuityLevel = "Moderate";
        else acuityLevel = "Low";

        return {
            unit_name: unitName,
            patient_count: criticalPatients.length,
            average_acuity_score: Math.round(averageAcuity * 10) / 10,
            critical_patient_count: criticalCount,
            high_risk_patient_count: highRiskCount,
            acuity_level: acuityLevel,
            patient_breakdown: criticalPatients.map((p) => ({
                patient_id: p.patient_id,
                acuity_score: p.acuity_score,
            })),
        };
    }

    /**
     * Get comprehensive risk profile for a specific patient
     */
    async getPatientRiskProfile(patientId: string): Promise<any> {
        await this.ensureInitialized();

        const [riskScores, vitalSigns, diagnoses, adtEvents] = await Promise.all([
            loadRiskScores(),
            loadVitalSigns(),
            loadDiagnoses(),
            loadADTEvents(),
        ]);

        const patientRisks = riskScores.filter((r) => r.patient_id === patientId);
        const patientVitals = vitalSigns
            .filter((v) => v.patient_id === patientId)
            .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
            .slice(0, 10);
        const patientDiagnoses = diagnoses.filter(
            (d) => d.patient_id === patientId && (d.status === "Active" || d.status === "Chronic")
        );
        const currentUnit = getCurrentUnit(patientId, adtEvents);

        const acuityScore = calculatePatientAcuity(
            patientRisks,
            patientVitals,
            patientDiagnoses,
            currentUnit
        );

        const riskFactors = identifyRiskFactors(
            patientRisks,
            patientVitals,
            patientDiagnoses,
            currentUnit
        );

        return {
            patient_id: patientId,
            current_unit: currentUnit,
            acuity_score: Math.round(acuityScore * 10) / 10,
            priority_level: determinePriorityLevel(acuityScore),
            risk_scores: patientRisks,
            recent_vitals: patientVitals.slice(0, 5),
            active_diagnoses: patientDiagnoses,
            risk_factors: riskFactors,
            recommended_actions: generateRecommendedActions(riskFactors),
        };
    }
}

// Export singleton instance
export const analyticsEngine = new AnalyticsEngine();
