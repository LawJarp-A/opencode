import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import type {
    VitalSigns,
    RiskScore,
    Diagnosis,
    ADTEvent,
    KPIMetric,
    CachedData,
    DataCache,
} from "../types/analytics.js";

// Data file paths
const DATA_DIR = "/Users/gg/Documents/ShopOS/GG's Hospital/Mock_Hospital_Digital_Twin";

const DATA_PATHS = {
    VITAL_SIGNS: `${DATA_DIR}/Observations_Vitals/vital_signs.csv`,
    RISK_SCORES: `${DATA_DIR}/Analytics_Reporting/predictive_risk_scores.csv`,
    DIAGNOSES: `${DATA_DIR}/Clinical_History/problem_list.csv`,
    ADT_EVENTS: `${DATA_DIR}/Workflow_Admin/adt_events.csv`,
    KPI_METRICS: `${DATA_DIR}/Analytics_Reporting/kpi_dashboard.csv`,
    LAB_RESULTS: `${DATA_DIR}/Lab_Results/lab_results.csv`,
    MEDICATIONS: `${DATA_DIR}/Medications/medication_orders.csv`,
    SURGICAL_CASES: `${DATA_DIR}/Surgery_Records/surgical_cases.csv`,
    PATIENTS: `${DATA_DIR}/Patient_Identity/patients.csv`,
    MED_ADMINISTRATION: `${DATA_DIR}/Medications/med_administration.csv`,
    PHARMACY_INVENTORY: `${DATA_DIR}/Medications/pharmacy_inventory.csv`,
    AUDIT_LOGS: `${DATA_DIR}/Compliance_Consent/audit_logs.csv`,
    STAFF_SCHEDULE: `${DATA_DIR}/Workflow_Admin/staff_schedule.csv`,
    VENDORS: `${DATA_DIR}/Supply_Chain/vendors.csv`,
    GENERAL_INVENTORY: `${DATA_DIR}/Supply_Chain/general_inventory.csv`,
    PURCHASE_ORDERS: `${DATA_DIR}/Supply_Chain/purchase_orders.csv`,
};

// Cache configuration
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory cache
let dataCache: DataCache = {};

/**
 * Load and parse a CSV file
 */
async function loadCSV<T>(filePath: string): Promise<T[]> {
    try {
        const fileContent = await readFile(filePath, "utf-8");
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        return records as T[];
    } catch (error) {
        console.error(`Error loading CSV file ${filePath}:`, error);
        throw new Error(`Failed to load data from ${filePath}`);
    }
}

/**
 * Check if cached data is still valid
 */
function isCacheValid<T>(cached: CachedData<T> | undefined): boolean {
    if (!cached) return false;
    const age = Date.now() - cached.loaded_at.getTime();
    return age < cached.ttl_ms;
}

/**
 * Load vital signs data with caching
 */
export async function loadVitalSigns(forceRefresh = false): Promise<VitalSigns[]> {
    if (!forceRefresh && isCacheValid(dataCache.vital_signs)) {
        return dataCache.vital_signs!.data;
    }

    const data = await loadCSV<VitalSigns>(DATA_PATHS.VITAL_SIGNS);
    dataCache.vital_signs = {
        data,
        loaded_at: new Date(),
        ttl_ms: CACHE_TTL_MS,
    };
    return data;
}

/**
 * Load risk scores data with caching
 */
export async function loadRiskScores(forceRefresh = false): Promise<RiskScore[]> {
    if (!forceRefresh && isCacheValid(dataCache.risk_scores)) {
        return dataCache.risk_scores!.data;
    }

    const data = await loadCSV<RiskScore>(DATA_PATHS.RISK_SCORES);
    dataCache.risk_scores = {
        data,
        loaded_at: new Date(),
        ttl_ms: CACHE_TTL_MS,
    };
    return data;
}

/**
 * Load diagnoses data with caching
 */
export async function loadDiagnoses(forceRefresh = false): Promise<Diagnosis[]> {
    if (!forceRefresh && isCacheValid(dataCache.diagnoses)) {
        return dataCache.diagnoses!.data;
    }

    const data = await loadCSV<Diagnosis>(DATA_PATHS.DIAGNOSES);
    dataCache.diagnoses = {
        data,
        loaded_at: new Date(),
        ttl_ms: CACHE_TTL_MS,
    };
    return data;
}

/**
 * Load ADT events data with caching
 */
export async function loadADTEvents(forceRefresh = false): Promise<ADTEvent[]> {
    if (!forceRefresh && isCacheValid(dataCache.adt_events)) {
        return dataCache.adt_events!.data;
    }

    const data = await loadCSV<ADTEvent>(DATA_PATHS.ADT_EVENTS);
    dataCache.adt_events = {
        data,
        loaded_at: new Date(),
        ttl_ms: CACHE_TTL_MS,
    };
    return data;
}

/**
 * Load KPI metrics data with caching
 */
export async function loadKPIMetrics(forceRefresh = false): Promise<KPIMetric[]> {
    if (!forceRefresh && isCacheValid(dataCache.kpi_metrics)) {
        return dataCache.kpi_metrics!.data;
    }

    const data = await loadCSV<KPIMetric>(DATA_PATHS.KPI_METRICS);
    dataCache.kpi_metrics = {
        data,
        loaded_at: new Date(),
        ttl_ms: CACHE_TTL_MS,
    };
    return data;
}

/**
 * Load lab results data (no caching for large dataset)
 */
export async function loadLabResults(): Promise<any[]> {
    return loadCSV(DATA_PATHS.LAB_RESULTS);
}

/**
 * Load medication orders data (no caching for large dataset)
 */
export async function loadMedicationOrders(): Promise<any[]> {
    return loadCSV(DATA_PATHS.MEDICATIONS);
}

/**
 * Load surgical cases data
 */
export async function loadSurgicalCases(): Promise<any[]> {
    return loadCSV(DATA_PATHS.SURGICAL_CASES);
}

/**
 * Load patient demographics data
 */
export async function loadPatientDemographics(): Promise<any[]> {
    return loadCSV(DATA_PATHS.PATIENTS);
}

/**
 * Load medication administration records
 */
export async function loadMedAdministration(): Promise<any[]> {
    return loadCSV(DATA_PATHS.MED_ADMINISTRATION);
}

/**
 * Load pharmacy inventory data
 */
export async function loadPharmacyInventory(): Promise<any[]> {
    return loadCSV(DATA_PATHS.PHARMACY_INVENTORY);
}

/**
 * Load audit logs
 */
export async function loadAuditLogs(): Promise<any[]> {
    return loadCSV(DATA_PATHS.AUDIT_LOGS);
}

/**
 * Load staff schedule
 */
export async function loadStaffSchedule(): Promise<any[]> {
    return loadCSV(DATA_PATHS.STAFF_SCHEDULE);
}
/**
 * Load vendors data
 */
export async function loadVendors(): Promise<any[]> {
    return loadCSV(DATA_PATHS.VENDORS);
}

/**
 * Load general inventory data
 */
export async function loadGeneralInventory(): Promise<any[]> {
    return loadCSV(DATA_PATHS.GENERAL_INVENTORY);
}

/**
 * Load purchase orders data
 */
export async function loadPurchaseOrders(): Promise<any[]> {
    return loadCSV(DATA_PATHS.PURCHASE_ORDERS);
}
/**
 * Clear all cached data
 */
export function clearCache(): void {
    dataCache = {};
}

/**
 * Preload all frequently accessed data into cache
 */
export async function preloadCache(): Promise<void> {
    console.error("Preloading analytics data cache...");
    await Promise.all([
        loadVitalSigns(true),
        loadRiskScores(true),
        loadDiagnoses(true),
        loadADTEvents(true),
        loadKPIMetrics(true),
    ]);
    console.error("Analytics data cache preloaded successfully");
}
