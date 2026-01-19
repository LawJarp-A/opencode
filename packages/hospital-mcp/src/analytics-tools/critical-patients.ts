import { analyticsEngine } from "../analytics/engine.js";
import type { CriticalPatientQuery } from "../types/analytics.js";

/**
 * Identify critical patients requiring immediate attention
 */
export async function identifyCriticalPatients(query?: CriticalPatientQuery) {
    try {
        const criticalPatients = await analyticsEngine.identifyCriticalPatients(query);

        return {
            success: true,
            total_critical_patients: criticalPatients.length,
            patients: criticalPatients,
            summary: {
                critical_priority: criticalPatients.filter((p) => p.priority_level === "Critical").length,
                high_priority: criticalPatients.filter((p) => p.priority_level === "High").length,
                medium_priority: criticalPatients.filter((p) => p.priority_level === "Medium").length,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Get comprehensive risk profile for a specific patient
 */
export async function getPatientRiskProfile(patientId: string) {
    try {
        const profile = await analyticsEngine.getPatientRiskProfile(patientId);

        return {
            success: true,
            profile,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Analyze acuity level for a hospital unit
 */
export async function analyzeUnitAcuity(unitName: string) {
    try {
        const acuity = await analyticsEngine.analyzeUnitAcuity(unitName);

        if (!acuity) {
            return {
                success: false,
                error: `No patients found in unit: ${unitName}`,
            };
        }

        return {
            success: true,
            unit_acuity: acuity,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}
