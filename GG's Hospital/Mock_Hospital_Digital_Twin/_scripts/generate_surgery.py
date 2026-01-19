"""
Generate surgery records and implants data
"""
import os
import sys
import random
import pandas as pd
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import CPT_CODES, random_date, generate_staff_id

random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_surgical_cases(patients_df):
    """Generate surgical case records"""
    cases = []
    
    surgical_procedures = [
        ('Appendectomy, laparoscopic', '44970'),
        ('Cholecystectomy, laparoscopic', '47562'),
        ('Hernia repair, inguinal', '49505'),
        ('Hysterectomy, total abdominal', '58150'),
        ('Knee arthroscopy, surgical', '29881'),
        ('Hip replacement, total', '27130'),
        ('Knee replacement, total', '27447'),
        ('Coronary artery bypass graft', '33533'),
        ('Cataract surgery with IOL', '66984'),
        ('Tonsillectomy', '42826'),
        ('Cesarean section', '59510'),
        ('Mastectomy, partial', '19301'),
        ('Prostatectomy, radical', '55866'),
        ('Spinal fusion, lumbar', '22612'),
        ('Carpal tunnel release', '64721'),
        ('Rotator cuff repair', '29827'),
        ('Ankle fracture fixation', '27792'),
    ]
    
    anesthesia_types = ['General', 'Spinal', 'Epidural', 'Regional block', 'Local with sedation']
    complication_types = ['None', 'Minimal bleeding', 'Infection', 'Delayed healing', 
                          'Post-op pain', 'Nausea/vomiting']
    
    # 25% of patients have had surgery
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.25), random_state=42).iterrows():
        num_surgeries = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
        
        for i in range(num_surgeries):
            case_id = f"SCASE{len(cases)+1:07d}"
            
            procedure_name, cpt_code = random.choice(surgical_procedures)
            
            surgery_date = random_date(2020, 2025)
            
            # Duration in minutes
            base_duration = random.randint(30, 300)
            duration_minutes = base_duration + random.randint(-15, 30)
            
            # Blood loss
            blood_loss_ml = random.randint(10, 500) if 'laparoscopic' in procedure_name.lower() else random.randint(50, 1500)
            
            anesthesia_type = random.choice(anesthesia_types)
            complications = random.choices(complication_types, weights=[80, 8, 4, 3, 3, 2])[0]
            
            case = {
                'case_id': case_id,
                'patient_id': patient['patient_id'],
                'surgery_date': surgery_date.strftime('%Y-%m-%d'),
                'procedure_name': procedure_name,
                'cpt_code': cpt_code,
                'surgeon_id': generate_staff_id(),
                'anesthesia_type': anesthesia_type,
                'anesthesiologist_id': generate_staff_id(),
                'duration_minutes': duration_minutes,
                'blood_loss_ml': blood_loss_ml,
                'complications': complications
            }
            cases.append(case)
    
    return pd.DataFrame(cases)

def generate_implants(cases_df):
    """Generate implant records"""
    implants = []
    
    implant_procedures = {
        'Hip replacement, total': [
            ('Hip prosthesis, metal on polyethylene', 'Smith & Nephew'),
            ('Acetabular cup, ceramic', 'Zimmer Biomet'),
        ],
        'Knee replacement, total': [
            ('Total knee prosthesis', 'Stryker'),
            ('Tibial component, metal-backed', 'DePuy Synthes'),
        ],
        'Cataract surgery with IOL': [
            ('Intraocular lens', 'Alcon'),
            ('Foldable IOL', 'Johnson & Johnson Vision'),
        ],
        'Spinal fusion, lumbar': [
            ('Spinal cage, titanium', 'Medtronic'),
            ('Pedicle screw system', 'NuVasive'),
        ],
        'Coronary artery bypass graft': [
            ('Coronary stent, drug-eluting', 'Abbott'),
            ('Heart valve, mechanical', 'Edwards Lifesciences'),
        ],
    }
    
    for idx, case in cases_df.iterrows():
        procedure = case['procedure_name']
        
        # Check if this procedure uses implants
        for proc_key, implant_list in implant_procedures.items():
            if proc_key in procedure:
                # Randomly select one or more implants
                num_implants = random.randint(1, 2)
                selected_implants = random.sample(implant_list, min(num_implants, len(implant_list)))
                
                for device_name, manufacturer in selected_implants:
                    implant_id = f"IMP{len(implants)+1:07d}"
                    
                    # Generate UDI
                    udi = f"(01){random.randint(10000000000000, 99999999999999)}" + \
                          f"(11){case['surgery_date'].replace('-', '')}" + \
                          f"(21){random.randint(1000000, 9999999)}"
                    
                    serial_number = f"SN{random.randint(100000, 999999)}"
                    
                    implant = {
                        'implant_id': implant_id,
                        'case_id': case['case_id'],
                        'patient_id': case['patient_id'],
                        'device_name': device_name,
                        'udi': udi,
                        'serial_number': serial_number,
                        'manufacturer': manufacturer,
                        'implant_date': case['surgery_date'],
                        'location': procedure.split(',')[0]  # Body location
                    }
                    implants.append(implant)
                break
    
    return pd.DataFrame(implants)

def main():
    print("Generating Surgery Records...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate surgical cases
    print("1. Generating surgical cases...")
    cases_df = generate_surgical_cases(patients_df)
    output_file = '../Surgery_Records/surgical_cases.csv'
    cases_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(cases_df)} surgical cases → {output_file}")
    
    # Generate implants
    print("\n2. Generating implant records...")
    implants_df = generate_implants(cases_df)
    output_file = '../Surgery_Records/implants.csv'
    implants_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(implants_df)} implant records → {output_file}")
    
    print("\n" + "="*60)
    print("Surgery Records Data Generation Complete!")
    print("="*60)
    print(f"Surgical Cases: {len(cases_df)} records")
    print(f"Implants: {len(implants_df)} records")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
