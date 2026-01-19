# Mock Hospital Digital Twin

A comprehensive synthetic dataset simulating a modern hospital's digital ecosystem.

## Overview

This dataset contains **1,200 synthetic patient records** with complete clinical, administrative, and technical data spanning multiple hospital systems.

## Data Standards

- **ICD-10**: International Classification of Diseases, 10th Revision
- **LOINC**: Logical Observation Identifiers Names and Codes (lab tests)
- **CPT**: Current Procedural Terminology (procedures)
- **RxNorm**: Normalized drug codes
- **CVX**: Vaccine codes
- **HL7 v2**: Health Level 7 messaging standard
- **FHIR R4**: Fast Healthcare Interoperability Resources

## Dataset Structure

### 1. Patient Identity (`Patient_Identity/`)
- **patients.csv** (1,200 records): Demographics, contact info, insurance
- **emergency_contacts.csv**: Emergency contact information
- **social_determinants.json**: Social determinants of health data

### 2. Clinical History (`Clinical_History/`)
- **problem_list.csv**: Active and historical diagnoses with ICD-10 codes
- **past_surgical_history.csv**: Surgical procedures with CPT codes
- **family_history.csv**: Family medical history

### 3. Observations & Vitals (`Observations_Vitals/`)
- **vital_signs.csv**: Temperature, BP, heart rate, SpO2, pain scores, BMI
- **nursing_assessments.md**: Narrative nursing documentation

### 4. Allergies & Immunizations (`Allergies_Immunizations/`)
- **allergies.csv**: Drug, food, and environmental allergies
- **immunizations.csv**: Vaccination history with CVX codes

### 5. Medications (`Medications/`)
- **medication_orders.csv**: Medication orders with RxNorm codes
- **med_administration.csv**: Medication Administration Record (MAR)
- **pharmacy_inventory.csv**: Pharmacy stock with NDC codes

### 6. Lab Results (`Lab_Results/`)
- **lab_orders.csv**: Lab orders with LOINC codes
- **lab_results.csv**: Lab results with reference ranges and abnormal flags

### 7. Imaging (`Imaging/`)
- **radiology_orders.csv**: Imaging orders (X-ray, CT, MRI, ultrasound)
- **radiology_reports.md**: Narrative radiology reports with findings

### 8. Surgery Records (`Surgery_Records/`)
- **surgical_cases.csv**: Surgical procedures with outcomes
- **implants.csv**: Medical device implants with UDI codes

### 9. Appointments & Visits (`Appointments_Visits/`)
- **appointments.csv**: Appointment scheduling data
- **visit_summary.md**: Clinical documentation (SOAP notes)

### 10. Billing & Insurance (`Billing_Insurance/`)
- **insurance_plans.csv**: Insurance plan details
- **claims.csv**: Insurance claims with ICD-10 and CPT codes

### 11. Compliance & Consent (`Compliance_Consent/`)
- **consent_forms.md**: Sample consent form templates
- **audit_logs.csv**: HIPAA audit trail (5,000 records)

### 12. Workflow & Admin (`Workflow_Admin/`)
- **adt_events.csv**: Admit/Discharge/Transfer events
- **staff_schedule.csv**: Staff scheduling
- **task_list.csv**: Clinical task management

### 13. Interoperability (`Interoperability/`)
- **hl7_samples.md**: HL7 v2 sample messages (ADT, ORU, ORM)
- **fhir_resources.json**: FHIR R4 resource bundles

### 14. Analytics & Reporting (`Analytics_Reporting/`)
- **kpi_dashboard.csv**: Hospital KPIs and quality metrics
- **predictive_risk_scores.csv**: AI/ML risk prediction scores

## Data Volume Summary

| Category | Approximate Record Count |
|----------|-------------------------|
| Patients | 1,200 |
| Emergency Contacts | ~1,000 |
| Clinical Problems | ~5,000 |
| Vital Signs | ~8,000 |
| Allergies | ~500 |
| Immunizations | ~6,000 |
| Medication Orders | ~4,000 |
| MAR Entries | ~3,000 |
| Lab Orders | ~15,000 |
| Lab Results | ~15,000 |
| Imaging Orders | ~1,500 |
| Surgical Cases | ~750 |
| Appointments | ~8,000 |
| Insurance Claims | ~5,000 |
| Audit Logs | 5,000 |
| ADT Events | ~1,200 |
| Staff Schedules | ~2,500 |
| Clinical Tasks | ~3,000 |
| Risk Scores | ~1,800 |

## Use Cases

This dataset is suitable for:

- **Healthcare IT Development**: Testing EHR/EMR systems
- **Clinical Decision Support**: Training ML models
- **Population Health Analytics**: Risk stratification and cohort analysis
- **Revenue Cycle Management**: Billing system development
- **Interoperability Testing**: HL7/FHIR integration
- **Quality Improvement**: Dashboard and reporting development
- **Education & Training**: Healthcare informatics coursework
- **Research**: Health services research prototyping

## Data Quality Notes

- All data is **100% synthetic** - no real patient information
- Referential integrity maintained across all files
- Realistic distributions and correlations
- Appropriate use of healthcare coding standards
- Mixture of structured (CSV/JSON) and unstructured (MD) data

## Important Considerations

⚠️ **This is synthetic data for development and testing purposes only.**

- Not suitable for clinical decision-making
- Not validated for research publication
- Date ranges: 2020-2025 (some future appointments)
- No real patient identifiers or PHI

## File Formats

- **CSV**: Comma-separated values (importable to Excel, databases)
- **JSON**: JavaScript Object Notation (programmable data structures)
- **MD**: Markdown (human-readable narrative text)

## Getting Started

1. **Explore the data**: Begin with `Patient_Identity/patients.csv`
2. **Check linkages**: Use `patient_id` to join related tables
3. **Review standards**: See medical codes in context
4. **Build dashboards**: Use KPI data for visualization practice
5. **Test integrations**: Try parsing HL7/FHIR samples

## Generated On

Date: 2026-01-19 16:39:28

## License

This synthetic dataset is provided as-is for educational and development purposes.

---

**Happy Building! 🏥**
