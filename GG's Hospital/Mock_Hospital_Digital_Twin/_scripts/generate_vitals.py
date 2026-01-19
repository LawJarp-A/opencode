"""
Generate vital signs and nursing assessments
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import random_datetime, generate_staff_id

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_vital_signs(patients_df):
    """Generate vital signs records"""
    vitals = []
    
    # Generate vitals for 70% of patients (those with recent encounters)
    sample_patients = patients_df.sample(n=int(len(patients_df) * 0.7), random_state=42)
    
    for idx, patient in sample_patients.iterrows():
        # Number of vital sign records based on age/complexity
        if patient['age'] < 40:
            num_records = random.randint(1, 5)
        elif patient['age'] < 65:
            num_records = random.randint(3, 10)
        else:
            num_records = random.randint(5, 20)
        
        for i in range(num_records):
            vital_id = f"VIT{len(vitals)+1:08d}"
            encounter_id = f"ENC{random.randint(100000, 999999)}"
            
            # Generate realistic vitals with some variation
            # Temperature (F): 97.0 - 100.4
            temp = round(np.random.normal(98.6, 0.5), 1)
            temp = np.clip(temp, 96.0, 101.0)
            
            # Heart rate: 60-100 normal, wider range for hospital
            hr = int(np.random.normal(75, 10))
            hr = np.clip(hr, 50, 120)
            
            # Blood pressure
            if patient['age'] > 50:
                bp_sys = int(np.random.normal(135, 15))
                bp_dia = int(np.random.normal(85, 10))
            else:
                bp_sys = int(np.random.normal(120, 12))
                bp_dia = int(np.random.normal(78, 8))
            bp_sys = np.clip(bp_sys, 90, 180)
            bp_dia = np.clip(bp_dia, 60, 110)
            
            # Respiratory rate: 12-20 normal
            resp_rate = int(np.random.normal(16, 2))
            resp_rate = np.clip(resp_rate, 10, 25)
            
            # SpO2: 95-100 normal
            spo2 = int(np.random.normal(97, 2))
            spo2 = np.clip(spo2, 92, 100)
            
            # Pain score: 0-10
            pain_score = random.choices([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                       weights=[30, 15, 15, 12, 10, 8, 5, 3, 1, 0.5, 0.5])[0]
            
            # Weight and height
            if patient['gender'] == 'Male':
                weight_lbs = int(np.random.normal(180, 30))
                height_in = int(np.random.normal(69, 3))
            else:
                weight_lbs = int(np.random.normal(150, 25))
                height_in = int(np.random.normal(64, 3))
            
            # BMI calculation
            bmi = round((weight_lbs / (height_in ** 2)) * 703, 1)
            
            timestamp = random_datetime(2024, 2025)
            
            vital = {
                'vital_id': vital_id,
                'patient_id': patient['patient_id'],
                'encounter_id': encounter_id,
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M'),
                'temperature_f': temp,
                'heart_rate': hr,
                'bp_systolic': bp_sys,
                'bp_diastolic': bp_dia,
                'respiratory_rate': resp_rate,
                'spo2': spo2,
                'pain_score': pain_score,
                'weight_lbs': weight_lbs,
                'height_in': height_in,
                'bmi': bmi,
                'recorded_by': generate_staff_id()
            }
            vitals.append(vital)
    
    return pd.DataFrame(vitals)

def generate_nursing_assessments():
    """Generate sample nursing assessment narratives"""
    assessments = []
    
    assessment_templates = [
        {
            'patient': 'P000042',
            'date': '2025-01-15',
            'nurse': 'RN Martinez',
            'assessment': '''**Pain Assessment**: Patient reports 6/10 lower back pain, radiating to right leg. Pain described as sharp and intermittent. Administered prescribed pain medication. Patient education provided on proper body mechanics.

**Fall Risk**: Fall risk score: 8 (moderate risk). Patient oriented x3, steady gait with walker. Call bell within reach. Bed in low position with side rails up x2.

**Skin Assessment**: Skin warm, dry, and intact. No areas of redness or breakdown noted. Stage 2 pressure ulcer on sacrum measuring 2cm x 1.5cm, improving from previous assessment. Dressing changed per protocol.'''
        },
        {
            'patient': 'P000127',
            'date': '2025-01-14',
            'nurse': 'RN Johnson',
            'assessment': '''**Pain Assessment**: Patient denies pain at rest. Reports 3/10 pain with movement at surgical site. Incision clean, dry, and intact with steri-strips in place. Patient educated on pain management options.

**Fall Risk**: Fall risk score: 3 (low risk). Patient ambulatory without assistance. No recent falls reported.

**Skin Assessment**: Skin pink, warm, dry. No edema noted. Surgical incision right lower quadrant healing well, no signs of infection.'''
        },
        {
            'patient': 'P000389',
            'date': '2025-01-16',
            'nurse': 'RN Chen',
            'assessment': '''**Pain Assessment**: Patient with chronic pain syndrome, baseline 5/10. Currently reports 7/10 pain despite scheduled medications. Pain management team consulted.

**Fall Risk**: Fall risk score: 12 (high risk). Recent fall 3 days ago. Patient requires assistance with ambulation. Physical therapy consulted for walker fitting and gait training.

**Skin Assessment**: Multiple bruises on bilateral upper extremities from recent fall. No skin tears. Heels clear, no pressure areas noted.'''
        },
        {
            'patient': 'P000521',
            'date': '2025-01-13',
            'nurse': 'RN Patel',
            'assessment': '''**Pain Assessment**: Patient rates pain 2/10, well-controlled on current regimen. No requests for additional pain medication.

**Fall Risk**: Fall risk score: 5 (low-moderate risk). Patient independent with ADLs. Aware of fall precautions. Non-skid footwear in use.

**Skin Assessment**: Skin assessment complete. Skin turgor normal. No areas of concern. Patient well-hydrated.'''
        },
        {
            'patient': 'P000678',
            'date': '2025-01-17',
            'nurse': 'RN Thompson',
            'assessment': '''**Pain Assessment**: Post-operative day 1. Pain 8/10, requiring IV pain medication. PCA initiated with good relief. Patient instructed on PCA use and safety measures.

**Fall Risk**: Fall risk score: 10 (high risk). Post-operative, requires maximum assistance with transfers. Bed alarm activated. Frequent rounding initiated.

**Skin Assessment**: Surgical dressing dry and intact. No drainage noted. Extremities warm with good perfusion. Sequential compression devices in place and functioning.'''
        },
        {
            'patient': 'P000815',
            'date': '2025-01-12',
            'nurse': 'RN Williams',
            'assessment': '''**Pain Assessment**: Patient has dementia, nonverbal. Pain assessment per PAINAD scale: 4 (moderate pain). Facial grimacing noted with repositioning. PRN acetaminophen administered.

**Fall Risk**: Fall risk score: 15 (very high risk). Confused and agitated. Bed alarm on. Family at bedside. Fall prevention protocol initiated.

**Skin Assessment**: Diaper area with mild redness. Barrier cream applied. Turned and repositioned q2h. No other areas of breakdown.'''
        },
        {
            'patient': 'P000903',
            'date': '2025-01-18',
            'nurse': 'RN Rodriguez',
            'assessment': '''**Pain Assessment**: Patient denies pain. Comfortable in semi-Fowler's position.

**Fall Risk**: Fall risk score: 4 (low risk). Alert and oriented. Ambulating in hallway with supervision. Steady gait.

**Skin Assessment**: Skin warm, dry, intact. Good turgor. No wounds or pressure areas. IV site right forearm - no redness, swelling, or tenderness.'''
        },
        {
            'patient': 'P001045',
            'date': '2025-01-11',
            'nurse': 'RN Lee',
            'assessment': '''**Pain Assessment**: Chronic pain patient, reports baseline pain 6/10. Rates current pain 6/10, no change from baseline. Taking medications as prescribed.

**Fall Risk**: Fall risk score: 7 (moderate risk). Uses cane for ambulation. Home safety evaluation completed by OT.

**Skin Assessment**: Venous stasis ulcer left lower leg 4cm x 3cm. Wound bed pink with granulation tissue. Compression wrap applied per protocol. Patient educated on leg elevation.'''
        }
    ]
    
    return assessment_templates

def main():
    print("Generating Observations & Vitals Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate vital signs
    print("1. Generating vital signs...")
    vitals_df = generate_vital_signs(patients_df)
    output_file = '../Observations_Vitals/vital_signs.csv'
    vitals_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(vitals_df)} vital sign records → {output_file}")
    
    # Generate nursing assessments
    print("\n2. Generating nursing assessments...")
    assessments = generate_nursing_assessments()
    output_file = '../Observations_Vitals/nursing_assessments.md'
    
    with open(output_file, 'w') as f:
        f.write("# Nursing Assessments\n\n")
        f.write("Sample nursing assessment documentation including pain, fall risk, and skin assessments.\n\n")
        f.write("---\n\n")
        
        for assessment in assessments:
            f.write(f"## Patient ID: {assessment['patient']}\n\n")
            f.write(f"**Date**: {assessment['date']}  \n")
            f.write(f"**Nurse**: {assessment['nurse']}\n\n")
            f.write(assessment['assessment'])
            f.write("\n\n---\n\n")
    
    print(f"   ✓ Created {len(assessments)} nursing assessment notes → {output_file}")
    
    print("\n" + "="*60)
    print("Observations & Vitals Data Generation Complete!")
    print("="*60)
    print(f"Vital Signs: {len(vitals_df)} records")
    print(f"Nursing Assessments: {len(assessments)} notes")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
