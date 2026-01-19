// Analytics Types for Hospital MCP

// ============================================================================
// Patient Risk and Acuity Types
// ============================================================================

export interface RiskScore {
    risk_id: string;
    patient_id: string;
    risk_type: string;
    score: number;
    risk_level: "Low" | "Medium" | "High";
    assessment_date: string;
    contributing_factors: string;
}

export interface VitalSigns {
    vital_id: string;
    patient_id: string;
    recorded_at: string;
    temperature_f: number;
    heart_rate: number;
    bp_systolic: number;
    bp_diastolic: number;
    respiratory_rate: number;
    spo2: number;
    pain_score: number;
}

export interface Diagnosis {
    problem_id: string;
    patient_id: string;
    diagnosis: string;
    icd10_code: string;
    onset_date: string;
    status: "Active" | "Chronic" | "Resolved" | "Inactive";
    severity: "Mild" | "Moderate" | "Severe";
}

export interface ADTEvent {
    event_id: string;
    patient_id: string;
    event_type: "Admit" | "Discharge" | "Transfer";
    event_timestamp: string;
    from_unit: string;
    to_unit: string;
}

// ============================================================================
// Analytics Results Types
// ============================================================================

export interface CriticalPatient {
    patient_id: string;
    patient_name: string;
    current_unit: string;
    risk_factors: RiskFactor[];
    acuity_score: number;
    priority_level: "Critical" | "High" | "Medium";
    recommended_actions: string[];
}

export interface RiskFactor {
    category: "Vital Signs" | "Lab Results" | "Diagnosis" | "Predictive Risk" | "Location";
    description: string;
    severity: "High" | "Medium" | "Low";
    value?: string | number;
}

export interface UnitAcuity {
    unit_name: string;
    patient_count: number;
    average_acuity_score: number;
    critical_patient_count: number;
    high_risk_patient_count: number;
    acuity_level: "Critical" | "High" | "Moderate" | "Low";
    patient_breakdown: {
        patient_id: string;
        acuity_score: number;
    }[];
}

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface KPIMetric {
    metric_id: string;
    metric_name: string;
    department: string;
    period: string;
    value: number;
    unit: string;
    target?: number;
    variance?: number;
}

export interface ClinicalMetrics {
    mortality_rate: number;
    readmission_rate_30day: number;
    infection_rate: number;
    fall_rate: number;
    patient_satisfaction_score: number;
    period: string;
    department?: string;
}

export interface OperationalMetrics {
    average_length_of_stay: number;
    bed_occupancy_rate: number;
    or_utilization_rate: number;
    ed_wait_time_avg: number;
    ed_lwbs_rate: number;
    discharge_before_noon_rate?: number;
    period: string;
    department?: string;
}

export interface LabAnalytics {
    total_tests: number;
    abnormal_count: number;
    abnormal_rate: number;
    by_analyte: {
        analyte: string;
        total: number;
        abnormal: number;
        abnormal_rate: number;
    }[];
    period: string;
}

export interface SurgicalAnalytics {
    total_cases: number;
    average_duration_minutes: number;
    complication_count: number;
    complication_rate: number;
    average_blood_loss_ml: number;
    by_procedure: {
        procedure_name: string;
        case_count: number;
        avg_duration: number;
        complication_rate: number;
    }[];
    period: string;
}

// ============================================================================
// Query Parameters Types
// ============================================================================

export interface AnalyticsQuery {
    start_date?: string;
    end_date?: string;
    department?: string;
    unit?: string;
    patient_id?: string;
    metric_type?: string;
}

export interface CriticalPatientQuery {
    unit?: string;
    min_acuity_score?: number;
    risk_types?: string[];
    include_stable?: boolean;
}

// ============================================================================
// Data Cache Types
// ============================================================================

export interface CachedData<T> {
    data: T[];
    loaded_at: Date;
    ttl_ms: number;
}

export interface DataCache {
    vital_signs?: CachedData<VitalSigns>;
    risk_scores?: CachedData<RiskScore>;
    diagnoses?: CachedData<Diagnosis>;
    adt_events?: CachedData<ADTEvent>;
    kpi_metrics?: CachedData<KPIMetric>;
}
