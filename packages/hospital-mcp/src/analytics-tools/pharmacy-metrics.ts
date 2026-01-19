import {
    loadMedAdministration,
    loadPharmacyInventory,
    loadMedicationOrders,
} from "../analytics/data-loader.js";
import { analyticsEngine } from "../analytics/engine.js";

/**
 * Calculate medication adherence rates
 */
export async function calculateMedicationAdherence(query?: {
    unit?: string;
    drug_class?: string;
}) {
    await analyticsEngine.initialize();
    const administrations = await loadMedAdministration();

    const totalAdmins = administrations.length;
    let onTime = 0;
    let late = 0;
    let missed = 0;
    let refused = 0;

    // Helper to parse time safely
    const parseTime = (t: string) => new Date(t).getTime();

    for (const admin of administrations) {
        if (admin.status === "Refused") {
            refused++;
            continue;
        }

        if (admin.status === "Not Given" || admin.status === "Missed") {
            missed++;
            continue;
        }

        if (admin.status === "Given" && admin.scheduled_time && admin.actual_time) {
            const scheduled = parseTime(admin.scheduled_time);
            const actual = parseTime(admin.actual_time);
            const diffMinutes = Math.abs(actual - scheduled) / (1000 * 60);

            // 60 minute window is standard for "on time"
            if (diffMinutes <= 60) {
                onTime++;
            } else {
                late++;
            }
        }
    }

    const adherenceRate = totalAdmins > 0
        ? Math.round(((onTime) / (totalAdmins - refused)) * 100)
        : 100;

    return {
        total_administrations: totalAdmins,
        adherence_rate: adherenceRate,
        breakdown: {
            on_time: onTime,
            late: late,
            missed: missed,
            refused: refused
        },
        insight: adherenceRate < 90 ? "Adherence usage below target (90%)" : "Adherence is optimal"
    };
}

/**
 * Predict pharmacy inventory shortages
 */
export async function predictInventoryShortages() {
    await analyticsEngine.initialize();
    const [inventory, administrations] = await Promise.all([
        loadPharmacyInventory(),
        loadMedAdministration()
    ]);

    const usageMap = new Map<string, number>();

    // Calculate simple usage count over the dataset period
    // Assuming dataset is roughly 1-2 weeks or we just take total count as a proxy for "velocity"
    for (const admin of administrations) {
        if (admin.status === "Given") {
            const drug = admin.drug_name;
            usageMap.set(drug, (usageMap.get(drug) || 0) + 1);
        }
    }

    const risks = [];

    for (const item of inventory) {
        const usage = usageMap.get(item.drug_name) || 0;
        const stock = parseInt(item.stock_level, 10);

        // Simple heuristic: if stock < 2x usage, flag it
        // Or if stock is critically low (< 10 units)
        if (stock < 10 || (usage > 0 && stock < usage)) {
            risks.push({
                drug_name: item.drug_name,
                current_stock: stock,
                estimated_demand: usage,
                risk_level: stock === 0 ? "Critical (Stockout)" : "High",
                location: item.location
            });
        }
    }

    return {
        total_items_tracked: inventory.length,
        items_at_risk: risks.length,
        shortage_risks: risks.sort((a, b) => a.current_stock - b.current_stock)
    };
}

/**
 * Monitor Opioid Stewardship (MME Tracking)
 */
export async function monitorOpioidStewardship() {
    await analyticsEngine.initialize();
    const administrations = await loadMedAdministration();

    // Simplified list of opioids for mock detection
    const OPIOID_KEYWORDS = [
        "Morphine", "Fentanyl", "Oxycodone", "Hydromorphone",
        "Hydrocodone", "Codeine", "Tramadol", "Methadone"
    ];

    let opioidAdmins = 0;
    const patientOpioidLoad = new Map<string, number>();

    for (const admin of administrations) {
        const isOpioid = OPIOID_KEYWORDS.some(k =>
            admin.drug_name && admin.drug_name.includes(k)
        );

        if (isOpioid && admin.status === "Given") {
            const patientId = admin.patient_id;
            patientOpioidLoad.set(patientId, (patientOpioidLoad.get(patientId) || 0) + 1);
            opioidAdmins++;
        }
    }

    // Convert map to array for sorting
    const highUtilizationPatients = Array.from(patientOpioidLoad.entries())
        .map(([patientId, count]) => ({ patient_id: patientId, administration_count: count }))
        .sort((a, b) => b.administration_count - a.administration_count)
        .slice(0, 10); // Top 10

    return {
        total_opioid_administrations: opioidAdmins,
        unique_patients_receiving_opioids: patientOpioidLoad.size,
        top_utilizers: highUtilizationPatients,
        stewardship_alert: opioidAdmins > 100 ? "High opioid usage detected across facility" : "Opioid usage within normal limits"
    };
}
