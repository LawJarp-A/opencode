# GG's Hospital System Context

## Facility Overview
**Name**: GG's Hospital (Flagship Facility of Metropolis Health System)
**Location**: 1000 Health Caring Way, Metropolis, NY
**Type**: Level 1 Trauma Center & Teaching Hospital
**Capacity**: 500 Licensed Beds
**Trauma Designation**: American College of Surgeons Verified Level I

## Mission & Values
"To serve the Metropolis community with compassion, innovation, and clinical excellence."
- **Safety First**: Zero Harm culture.
- **Patient Centricity**: "Nothing about me without me."

## Departments & Units
| Unit | Code | Beds | Acuity (1-5) | Description |
|------|------|------|--------------|-------------|
| **Emergency Dept** | ED | 40 | 5 (Variable) | Level 1 Trauma, Stroke Center, Chest Pain Center |
| **Surgical ICU** | SICU | 25 | 5 (Critical) | Post-trauma, neurosurgery, transplant |
| **Medical ICU** | MICU | 25 | 5 (Critical) | Sepsis, ARDS, multi-organ failure |
| **Step-Down** | SDU | 40 | 4 (High) | Vent weaning, stable drips |
| **Med/Surg** | 3W/4E | 200 | 3 (Moderate) | General recovery, pneumonia, post-op |
| **Cardiology** | 5W | 50 | 3-4 (High) | Telemetry, post-cath, CHF |
| **Pediatrics** | PEDS | 40 | Variable | PICU and general peds floor |
| **Maternity** | L&D | 30 | Variable | Labor/Delivery, NICU Level III |

## Digital Twin Ecosystem
All patient and operational data is stored in the `Mock_Hospital_Digital_Twin` directory.

### Key Data Sources
- **Patient Identity**: `patients.csv` (Demographics), `social_determinants.json` (SDOH risk).
- **Clinical**: `problem_list.csv` (ICD-10), `medication_orders.csv` (RxNorm), `vital_signs.csv`.
- **Operations**: `adt_events.csv` (Patient flow), `staff_schedule.csv` (Resource allocation).
- **Compliance**: `audit_logs.csv` (HIPAA tracking).

## Core Protocols
- **Admission**: Requires valid physician order + ESI Level (ED) + Bed Assignment (Clinical Ops).
- **Code Blue**: Immediate response teams (ICU MD, RT, Anesthesia). Location announced overhead.
- **Stroke Alert**: "Code Stroke" -> CT Scan < 20 mins -> tPA decision < 45 mins.
- **Sepsis Bundle**: 3-Hour Bundle (Lactate, Cultures, Antibiotics, Fluids).
- **Privacy (HIPAA)**: "Break Glass" required for VIP records. Minimum Necessary Rule applies.
- **Downtime**: Use Paper Order Sets (Form #8849) if EMR (Epic) is offline.

## System Terminology
- **EMR**: Epic Hyperspace (Mocked)
- **Labs**: Sunquest
- **Imaging**: McKesson PACS
- **Pharmacy**: Pyxis MedStation ES
- **Coding**: 3M 360 Encompass
