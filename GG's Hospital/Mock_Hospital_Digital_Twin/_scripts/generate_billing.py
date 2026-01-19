"""
Generate billing and insurance data
"""
import os
import sys
import random
import pandas as pd
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import ICD10_CODES, CPT_CODES, INSURANCE_PAYERS, random_date

random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_insurance_plans():
    """Generate insurance plan details"""
    plans = []
    
    plan_types = ['HMO', 'PPO', 'EPO', 'POS', 'Medicare', 'Medicaid']
    network_types = ['In-Network', 'Out-of-Network', 'Both']
    
    for i, payer in enumerate(INSURANCE_PAYERS):
        plan_id = f"PLAN{i+1:04d}"
        
        # Determine plan type based on payer
        if payer == 'Medicare':
            plan_type = 'Medicare'
            copay = random.choice([0, 10, 20])
            deductible = random.choice([0, 203, 226])  # 2024 Medicare deductibles
            oop_max = random.randint(0, 7550)
        elif payer == 'Medicaid':
            plan_type = 'Medicaid'
            copay = random.choice([0, 3, 5])
            deductible = 0
            oop_max = 0
        else:
            plan_type = random.choice(['HMO', 'PPO', 'EPO', 'POS'])
            copay = random.choice([10, 15, 20, 25, 30, 40, 50])
            deductible = random.choice([500, 1000, 1500, 2000, 2500, 3000, 5000])
            oop_max = random.choice([3000, 4000, 5000, 6000, 7000, 8000, 9000])
        
        plan = {
            'plan_id': plan_id,
            'payer_name': payer,
            'plan_type': plan_type,
            'copay': copay,
            'deductible': deductible,
            'oop_max': oop_max,
            'network_type': random.choice(network_types),
            'active_from': '2023-01-01',
            'active_to': '2025-12-31'
        }
        plans.append(plan)
    
    return pd.DataFrame(plans)

def generate_claims(patients_df, plans_df):
    """Generate insurance claims"""
    claims = []
    
    claim_statuses = ['Paid', 'Pending', 'Denied', 'Appealed', 'Partially Paid']
    
    # Generate claims for 80% of patients
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.8), random_state=42).iterrows():
        num_claims = random.randint(1, 10)
        
        for i in range(num_claims):
            claim_id = f"CLM{len(claims)+1:010d}"
            encounter_id = f"ENC{random.randint(100000, 999999)}"
            
            # Match patient's insurance to a plan
            plan = plans_df[plans_df['payer_name'] == patient['insurance_plan']].iloc[0] if len(plans_df[plans_df['payer_name'] == patient['insurance_plan']]) > 0 else plans_df.iloc[0]
            
            service_date = random_date(2023, 2025)
            
            # Select ICD-10 and CPT codes
            icd10_code = random.choice(list(ICD10_CODES.keys()))
            cpt_code = random.choice(list(CPT_CODES.keys()))
            
            # Generate claim amounts
            if cpt_code.startswith('99'):  # Office visits
                billed_amount = random.randint(150, 400)
            elif cpt_code.startswith('7'):  # Imaging
                billed_amount = random.randint(300, 2000)
            elif cpt_code.startswith('8'):  # Lab
                billed_amount = random.randint(50, 300)
            elif int(cpt_code) >= 10000:  # Surgery
                billed_amount = random.randint(2000, 50000)
            else:
                billed_amount = random.randint(100, 1000)
            
            # Calculate allowed and paid amounts
            allowed_amount = int(billed_amount * random.uniform(0.6, 0.95))
            
            status = random.choices(claim_statuses, weights=[75, 10, 8, 2, 5])[0]
            
            if status == 'Paid':
                paid_amount = allowed_amount - plan['copay']
                patient_responsibility = plan['copay']
            elif status == 'Partially Paid':
                paid_amount = int(allowed_amount * random.uniform(0.5, 0.9))
                patient_responsibility = allowed_amount - paid_amount
            elif status == 'Denied':
                paid_amount = 0
                patient_responsibility = billed_amount
            else:  # Pending or Appealed
                paid_amount = 0
                patient_responsibility = 0
            
            submission_date = service_date + timedelta(days=random.randint(1, 30))
            
            claim = {
                'claim_id': claim_id,
                'patient_id': patient['patient_id'],
                'encounter_id': encounter_id,
                'plan_id': plan['plan_id'],
                'service_date': service_date.strftime('%Y-%m-%d'),
                'icd10_codes': icd10_code,
                'cpt_codes': cpt_code,
                'billed_amount': billed_amount,
                'allowed_amount': allowed_amount,
                'paid_amount': paid_amount,
                'patient_responsibility': patient_responsibility,
                'status': status,
                'submission_date': submission_date.strftime('%Y-%m-%d')
            }
            claims.append(claim)
    
    return pd.DataFrame(claims)

def main():
    print("Generating Billing & Insurance Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate insurance plans
    print("1. Generating insurance plans...")
    plans_df = generate_insurance_plans()
    output_file = '../Billing_Insurance/insurance_plans.csv'
    plans_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(plans_df)} insurance plans → {output_file}")
    
    # Generate claims
    print("\n2. Generating insurance claims...")
    claims_df = generate_claims(patients_df, plans_df)
    output_file = '../Billing_Insurance/claims.csv'
    claims_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(claims_df)} claims → {output_file}")
    
    print("\n" + "="*60)
    print("Billing & Insurance Data Generation Complete!")
    print("="*60)
    print(f"Insurance Plans: {len(plans_df)} records")
    print(f"Claims: {len(claims_df)} records")
    print(f"Total Billed: ${claims_df['billed_amount'].sum():,.2f}")
    print(f"Total Paid: ${claims_df['paid_amount'].sum():,.2f}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
