import {
    loadAuditLogs,
    loadStaffSchedule,
    loadADTEvents,
} from "../analytics/data-loader.js";
import { analyticsEngine } from "../analytics/engine.js";
import { getCurrentUnit } from "../analytics/aggregators.js";

/**
 * Analyze access logs for compliance violations
 */
export async function analyzeAccessLogs(query?: {
    start_date?: string,
    end_date?: string
}) {
    await analyticsEngine.initialize();
    const [auditLogs, staffSchedule, adtEvents] = await Promise.all([
        loadAuditLogs(),
        loadStaffSchedule(),
        loadADTEvents()
    ]);

    // VIP Snooping Detection
    // For this mock, we'll arbitrarily designate some patients as "VIP" based on ID pattern or random selection
    // In a real system, this would come from the patient profile
    const vipPatients = ["P000001", "P000010", "P000100"]; // Mock VIP list

    let vipSnoopingIncidents = 0;
    let breakGlassEvents = 0;
    let afterHoursAccess = 0;

    const incidents = [];

    // Map staff to their assigned units (simplified - taking first assignment found)
    const staffUnitMap = new Map<string, string>();
    for (const schedule of staffSchedule) {
        staffUnitMap.set(schedule.staff_id, schedule.assigned_unit);
    }

    const startDate = query?.start_date ? new Date(query.start_date).getTime() : 0;
    const endDate = query?.end_date ? new Date(query.end_date).getTime() : Date.now();

    for (const log of auditLogs) {
        const logTime = new Date(log.timestamp).getTime();

        // Time filter
        if (startDate && logTime < startDate) continue;
        if (endDate && logTime > endDate) continue;

        // 1. Break Glass / Emergency Access
        if (
            log.reason?.toLowerCase().includes("emergency") ||
            log.action_type === "Break Glass"
        ) {
            breakGlassEvents++;
        }

        // 2. VIP Snooping
        // If resource is a patient record of a VIP
        if (log.patient_id && vipPatients.includes(log.patient_id)) {
            const accessorUnit = staffUnitMap.get(log.user_id);
            const patientUnit = getCurrentUnit(log.patient_id, adtEvents);

            // If accessor is NOT in the same unit as the patient, flag it
            // Also exclude if user is clearly an admin or billing (checking user_role)
            const isClinical = ["Physician", "Nurse", "Resident", "CNA"].includes(log.user_role);

            if (isClinical && accessorUnit && patientUnit && accessorUnit !== patientUnit) {
                vipSnoopingIncidents++;
                incidents.push({
                    type: "VIP Snooping Risk",
                    user_id: log.user_id,
                    role: log.user_role,
                    patient_id: log.patient_id,
                    timestamp: log.timestamp,
                    details: `Access to VIP patient in ${patientUnit} by staff from ${accessorUnit}`
                });
            }
        }
    }

    return {
        period: query?.start_date ? `${query.start_date} to ${query.end_date}` : "All Time",
        total_logs_analyzed: auditLogs.length,
        metrics: {
            vip_snooping_incidents: vipSnoopingIncidents,
            break_glass_events: breakGlassEvents,
            after_hours_access_count: afterHoursAccess // Placeholder as implemented logic focused on others
        },
        flagged_incidents: incidents.slice(0, 20) // Limit output
    };
}

/**
 * Detect specifically VIP Snooping (for focused tool calls)
 */
export async function detectVIPSnooping() {
    const report = await analyzeAccessLogs();
    return {
        snooping_incidents: report.metrics.vip_snooping_incidents,
        details: report.flagged_incidents.filter(i => i.type === "VIP Snooping Risk")
    };
}

/**
 * Monitor Break Glass usage
 */
export async function monitorBreakGlass() {
    const report = await analyzeAccessLogs();
    return {
        break_glass_events: report.metrics.break_glass_events,
        status: report.metrics.break_glass_events > 0 ? "Review Required" : "Normal"
    };
}
