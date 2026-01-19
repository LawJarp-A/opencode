"""
Generate allergies and immunizations data
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import ALLERGENS, REACTIONS, CVX_CODES, random_date, generate_staff_id

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_allergies(patients_df):
    """Generate allergy records"""
    allergies = []
    
    allergen_types = ['Medication', 'Food', 'Environmental', 'Other']
    severities = ['Mild', 'Moderate', 'Severe']
    
    for idx, patient in patients_df.iterrows():
        # 40% of patients have documented allergies
        if random.random() < 0.4:
            num_allergies = random.choices([1, 2, 3, 4], weights=[60, 25, 10, 5])[0]
            
            selected_allergens = random.sample(ALLERGENS, min(num_allergies, len(ALLERGENS)))
            
            for allergen in selected_allergens:
                allergy_id = f"ALG{len(allergies)+1:07d}"
                
                # Determine allergen type
                if allergen in ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine', 'Morphine', 'Contrast dye']:
                    allergen_type = 'Medication'
                elif allergen in ['Shellfish', 'Peanuts', 'Tree nuts', 'Eggs', 'Milk', 'Soy', 'Wheat']:
                    allergen_type = 'Food'
                elif allergen in ['Latex', 'Bee stings']:
                    allergen_type = 'Environmental'
                else:
                    allergen_type = 'Other'
                
                # Select appropriate reaction
                reaction = random.choice(REACTIONS)
                
                # Severity correlates somewhat with reaction type
                if reaction in ['Anaphylaxis', 'Difficulty breathing']:
                    severity = random.choices(severities, weights=[5, 20, 75])[0]
                elif reaction in ['Hives', 'Swelling']:
                    severity = random.choices(severities, weights=[20, 60, 20])[0]
                else:
                    severity = random.choices(severities, weights=[50, 40, 10])[0]
                
                date_identified = random_date(2010, 2024)
                
                allergy = {
                    'allergy_id': allergy_id,
                    'patient_id': patient['patient_id'],
                    'allergen': allergen,
                    'allergen_type': allergen_type,
                    'reaction': reaction,
                    'severity': severity,
                    'date_identified': date_identified.strftime('%Y-%m-%d'),
                    'verified_by': generate_staff_id()
                }
                allergies.append(allergy)
    
    return pd.DataFrame(allergies)

def generate_immunizations(patients_df):
    """Generate immunization records"""
    immunizations = []
    
    cvx_items = list(CVX_CODES.items())
    routes = ['Intramuscular', 'Subcutaneous', 'Intradermal', 'Oral', 'Intranasal']
    sites = ['Left deltoid', 'Right deltoid', 'Left thigh', 'Right thigh', 'Left upper arm', 'Right upper arm']
    manufacturers = ['Pfizer', 'Moderna', 'Johnson & Johnson', 'Sanofi', 'GlaxoSmithKline', 'Merck']
    
    for idx, patient in patients_df.iterrows():
        # Generate immunizations based on age
        immunization_list = []
        
        # COVID vaccines (age 12+)
        if patient['age'] >= 12:
            covid_doses = random.randint(2, 5)
            for dose in range(covid_doses):
                cvx_code = random.choice(['208', '212'])
                vaccine_name = CVX_CODES[cvx_code]
                
                # Spacing between doses
                if dose == 0:
                    date_admin = random_date(2021, 2022)
                elif dose == 1:
                    date_admin = date_administered + timedelta(days=random.randint(21, 42))
                else:
                    date_admin = date_administered + timedelta(days=random.randint(120, 300))
                
                date_administered = date_admin
                
                immunization_list.append({
                    'cvx_code': cvx_code,
                    'vaccine_name': vaccine_name,
                    'dose_number': dose + 1,
                    'date_administered': date_administered,
                    'route': 'Intramuscular',
                    'site': random.choice(['Left deltoid', 'Right deltoid']),
                    'manufacturer': random.choice(['Pfizer', 'Moderna'])
                })
        
        # Flu vaccines (annual)
        current_year = 2025
        for year in range(max(current_year - 5, int(patient['dob'][:4]) + 6), current_year):
            if random.random() < 0.6:  # 60% get annual flu vaccine
                flu_date = datetime(year, random.randint(9, 11), random.randint(1, 28))
                if flu_date < datetime.now():
                    immunization_list.append({
                        'cvx_code': '141',
                        'vaccine_name': CVX_CODES['141'],
                        'dose_number': 1,
                        'date_administered': flu_date,
                        'route': 'Intramuscular',
                        'site': random.choice(['Left deltoid', 'Right deltoid']),
                        'manufacturer': random.choice(['Sanofi', 'GlaxoSmithKline'])
                    })
        
        # Pneumococcal vaccine (age 65+)
        if patient['age'] >= 65:
            min_year = max(2015, int(patient['dob'][:4]) + 65)
            max_year = 2024
            # Only generate if min_year is before or at max_year
            if min_year <= max_year:
                pneumo_date = random_date(min_year, max_year)
                immunization_list.append({
                    'cvx_code': '152',
                    'vaccine_name': CVX_CODES['152'],
                    'dose_number': 1,
                    'date_administered': pneumo_date,
                    'route': 'Intramuscular',
                    'site': random.choice(['Left deltoid', 'Right deltoid']),
                    'manufacturer': 'Merck'
                })
        
        # Tdap booster
        if patient['age'] >= 18 and random.random() < 0.7:
            min_year = max(2014, int(patient['dob'][:4]) + 18)
            if min_year <= 2024:
                tdap_date = random_date(min_year, 2024)
                immunization_list.append({
                    'cvx_code': '115',
                    'vaccine_name': CVX_CODES['115'],
                    'dose_number': 1,
                    'date_administered': tdap_date,
                    'route': 'Intramuscular',
                    'site': random.choice(['Left deltoid', 'Right deltoid']),
                    'manufacturer': random.choice(['Sanofi', 'GlaxoSmithKline'])
                })
        
        # Shingles vaccine (age 50+)
        if patient['age'] >= 50 and random.random() < 0.5:
            min_year = max(2018, int(patient['dob'][:4]) + 50)
            if min_year <= 2024:
                shingles_date = random_date(min_year, 2024)
                immunization_list.append({
                    'cvx_code': '187',
                    'vaccine_name': CVX_CODES['187'],
                    'dose_number': 1,
                    'date_administered': shingles_date,
                    'route': 'Intramuscular',
                    'site': random.choice(['Left deltoid', 'Right deltoid']),
                    'manufacturer': 'GlaxoSmithKline'
                })
        
        # Create records
        for imm in immunization_list:
            immunization_id = f"IMM{len(immunizations)+1:07d}"
            
            lot_number = f"LOT{random.randint(100000, 999999)}"
            
            record = {
                'immunization_id': immunization_id,
                'patient_id': patient['patient_id'],
                'vaccine_name': imm['vaccine_name'],
                'cvx_code': imm['cvx_code'],
                'date_administered': imm['date_administered'].strftime('%Y-%m-%d'),
                'dose_number': imm['dose_number'],
                'route': imm['route'],
                'site': imm['site'],
                'manufacturer': imm['manufacturer'],
                'lot_number': lot_number,
                'administered_by': generate_staff_id()
            }
            immunizations.append(record)
    
    return pd.DataFrame(immunizations)

def main():
    print("Generating Allergies & Immunizations Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate allergies
    print("1. Generating allergies...")
    allergies_df = generate_allergies(patients_df)
    output_file = '../Allergies_Immunizations/allergies.csv'
    allergies_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(allergies_df)} allergy records → {output_file}")
    
    # Generate immunizations
    print("\n2. Generating immunizations...")
    immunizations_df = generate_immunizations(patients_df)
    output_file = '../Allergies_Immunizations/immunizations.csv'
    immunizations_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(immunizations_df)} immunization records → {output_file}")
    
    print("\n" + "="*60)
    print("Allergies & Immunizations Data Generation Complete!")
    print("="*60)
    print(f"Allergies: {len(allergies_df)} records")
    print(f"Immunizations: {len(immunizations_df)} records")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
