"""
Generate clinical history data including problem lists, surgical history, and family history
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import ICD10_CODES, CPT_CODES, random_date, generate_staff_id

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_problem_list(patients_df):
    """Generate problem list with diagnoses"""
    problems = []
    
    icd10_items = list(ICD10_CODES.items())
    statuses = ['Active', 'Resolved', 'Chronic', 'Inactive']
    severities = ['Mild', 'Moderate', 'Severe']
    
    for idx, patient in patients_df.iterrows():
        # Number of problems increases with age
        if patient['age'] < 30:
            num_problems = random.choices([0, 1, 2, 3], weights=[30, 40, 20, 10])[0]
        elif patient['age'] < 50:
            num_problems = random.choices([1, 2, 3, 4, 5], weights=[20, 30, 25, 15, 10])[0]
        elif patient['age'] < 70:
            num_problems = random.choices([2, 3, 4, 5, 6, 7], weights=[10, 20, 25, 20, 15, 10])[0]
        else:
            num_problems = random.choices([3, 4, 5, 6, 7, 8], weights=[10, 15, 20, 20, 20, 15])[0]
        
        # Select random conditions
        selected_conditions = random.sample(icd10_items, min(num_problems, len(icd10_items)))
        
        for icd10_code, diagnosis in selected_conditions:
            problem_id = f"PROB{len(problems)+1:07d}"
            
            # Date diagnosed (within patient's adult years or recent years for young patients)
            years_back = random.randint(0, min(30, max(1, patient['age'] - 18)))
            date_diagnosed = datetime.now() - timedelta(days=years_back*365)
            
            # Determine status
            if 'Chronic' in diagnosis or 'diabetes' in diagnosis.lower():
                status = 'Chronic'
            else:
                status = random.choices(statuses, weights=[60, 20, 15, 5])[0]
            
            # Date resolved if applicable
            date_resolved = ''
            if status == 'Resolved':
                max_days = max(30, years_back*365)
                days_resolved = random.randint(30, max_days) if max_days > 30 else 30
                date_resolved = (datetime.now() - timedelta(days=days_resolved)).strftime('%Y-%m-%d')
            
            problem = {
                'problem_id': problem_id,
                'patient_id': patient['patient_id'],
                'diagnosis': diagnosis,
                'icd10_code': icd10_code,
                'status': status,
                'date_diagnosed': date_diagnosed.strftime('%Y-%m-%d'),
                'date_resolved': date_resolved,
                'severity': random.choice(severities),
                'provider_id': generate_staff_id()
            }
            problems.append(problem)
    
    return pd.DataFrame(problems)

def generate_surgical_history(patients_df):
    """Generate past surgical history"""
    surgeries = []
    
    surgical_procedures = [
        ('Appendectomy', '44970'),
        ('Cholecystectomy (Gallbladder removal)', '47562'),
        ('Hernia repair', '49505'),
        ('Hysterectomy', '58150'),
        ('Knee arthroscopy', '29881'),
        ('Hip replacement', '27130'),
        ('Knee replacement', '27447'),
        ('Coronary artery bypass graft', '33533'),
        ('Cataract surgery', '66984'),
        ('Tonsillectomy', '42826'),
        ('Cesarean section', '59510'),
        ('Mastectomy', '19307'),
        ('Prostatectomy', '55866'),
        ('Spinal fusion', '22612'),
        ('Carpal tunnel release', '64721'),
    ]
    
    for idx, patient in patients_df.iterrows():
        # Probability of surgery increases with age
        if patient['age'] < 30:
            num_surgeries = random.choices([0, 1], weights=[80, 20])[0]
        elif patient['age'] < 50:
            num_surgeries = random.choices([0, 1, 2], weights=[60, 30, 10])[0]
        elif patient['age'] < 70:
            num_surgeries = random.choices([0, 1, 2, 3], weights=[40, 35, 20, 5])[0]
        else:
            num_surgeries = random.choices([0, 1, 2, 3, 4], weights=[20, 30, 25, 15, 10])[0]
        
        if num_surgeries > 0:
            selected_procedures = random.sample(surgical_procedures, min(num_surgeries, len(surgical_procedures)))
            
            for procedure_name, cpt_code in selected_procedures:
                surgery_id = f"SURG{len(surgeries)+1:07d}"
                
                # Surgery date (in the past) - handle young patients
                max_years = max(1, min(40, patient['age'] - 18))
                years_back = random.randint(1, max_years)
                surgery_date = datetime.now() - timedelta(days=years_back*365 + random.randint(0, 365))
                
                surgery = {
                    'surgery_id': surgery_id,
                    'patient_id': patient['patient_id'],
                    'procedure_name': procedure_name,
                    'cpt_code': cpt_code,
                    'date': surgery_date.strftime('%Y-%m-%d'),
                    'surgeon_id': generate_staff_id(),
                    'facility': random.choice(['Main Hospital', 'Ambulatory Surgery Center', 'Outpatient Clinic']),
                    'complications': random.choices(['None', 'Minor complications', 'Infection', 'Delayed healing'],
                                                   weights=[85, 10, 3, 2])[0]
                }
                surgeries.append(surgery)
    
    return pd.DataFrame(surgeries)

def generate_family_history(patients_df):
    """Generate family medical history"""
    family_history = []
    
    conditions = [
        ('Heart disease', 'I25.10'),
        ('Diabetes', 'E11.9'),
        ('Hypertension', 'I10'),
        ('Cancer - Breast', 'C50.919'),
        ('Cancer - Colon', 'C18.9'),
        ('Cancer - Lung', 'C34.90'),
        ('Cancer - Prostate', 'C61'),
        ('Stroke', 'I63.9'),
        ('Alzheimer\'s disease', 'G30.9'),
        ('Depression', 'F32.9'),
        ('Asthma', 'J45.909'),
        ('Osteoporosis', 'M81.0'),
    ]
    
    relations = ['Mother', 'Father', 'Maternal Grandmother', 'Maternal Grandfather',
                 'Paternal Grandmother', 'Paternal Grandfather', 'Sister', 'Brother',
                 'Aunt', 'Uncle']
    
    living_status = ['Living', 'Deceased']
    
    for idx, patient in patients_df.iterrows():
        # 60% of patients have documented family history
        if random.random() < 0.6:
            num_conditions = random.choices([1, 2, 3, 4], weights=[40, 35, 20, 5])[0]
            
            selected_conditions = random.sample(conditions, min(num_conditions, len(conditions)))
            
            for condition_name, icd10_code in selected_conditions:
                history_id = f"FH{len(family_history)+1:07d}"
                
                relation = random.choice(relations)
                age_of_onset = random.randint(30, 80)
                
                # Deceased more likely for older relatives/conditions
                is_living = random.choices(living_status, weights=[65, 35])[0]
                
                record = {
                    'history_id': history_id,
                    'patient_id': patient['patient_id'],
                    'relation': relation,
                    'condition': condition_name,
                    'icd10_code': icd10_code,
                    'age_of_onset': age_of_onset,
                    'living_status': is_living
                }
                family_history.append(record)
    
    return pd.DataFrame(family_history)

def main():
    print("Generating Clinical History Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate problem list
    print("1. Generating problem list...")
    problems_df = generate_problem_list(patients_df)
    output_file = '../Clinical_History/problem_list.csv'
    problems_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(problems_df)} problems → {output_file}")
    
    # Generate surgical history
    print("\n2. Generating surgical history...")
    surgeries_df = generate_surgical_history(patients_df)
    output_file = '../Clinical_History/past_surgical_history.csv'
    surgeries_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(surgeries_df)} surgical procedures → {output_file}")
    
    # Generate family history
    print("\n3. Generating family history...")
    family_df = generate_family_history(patients_df)
    output_file = '../Clinical_History/family_history.csv'
    family_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(family_df)} family history records → {output_file}")
    
    print("\n" + "="*60)
    print("Clinical History Data Generation Complete!")
    print("="*60)
    print(f"Problem List: {len(problems_df)} records")
    print(f"Surgical History: {len(surgeries_df)} records")
    print(f"Family History: {len(family_df)} records")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
