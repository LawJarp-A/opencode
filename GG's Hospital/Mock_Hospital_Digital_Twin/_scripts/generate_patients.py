"""
Generate patient identity data including patients, emergency contacts, and social determinants
"""
import os
import sys
import random
import json
from datetime import datetime, timedelta
from faker import Faker
import pandas as pd
import numpy as np

# Add parent directory to path to import shared_data
sys.path.append(os.path.dirname(__file__))
from shared_data import generate_mrn, random_date, INSURANCE_PAYERS

fake = Faker()
Faker.seed(42)
random.seed(42)
np.random.seed(42)

NUM_PATIENTS = 2400  # Generate 2400 patients (2x original dataset)

def generate_patients(num_patients):
    """Generate patient demographic data"""
    patients = []
    
    genders = ['Male', 'Female', 'Non-binary']
    gender_weights = [48, 48, 4]
    
    ethnicities = ['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 
                   'Native American', 'Pacific Islander', 'Other', 'Prefer not to say']
    ethnicity_weights = [60, 13, 18, 6, 1, 0.5, 1, 0.5]
    
    languages = ['English', 'Spanish', 'Mandarin', 'Cantonese', 'Tagalog', 
                 'Vietnamese', 'Korean', 'Russian', 'Arabic', 'French']
    language_weights = [70, 13, 3, 2, 2, 2, 1.5, 1.5, 2, 3]
    
    for i in range(num_patients):
        patient_id = f"P{str(i+1).zfill(6)}"
        mrn = generate_mrn()
        
        gender = random.choices(genders, weights=gender_weights)[0]
        
        # Generate age-appropriate names
        if gender == 'Male':
            first_name = fake.first_name_male()
        elif gender == 'Female':
            first_name = fake.first_name_female()
        else:
            first_name = fake.first_name()
        
        last_name = fake.last_name()
        
        # Age distribution: more older patients typical of hospital population
        age = int(np.random.beta(2, 2) * 90 + 10)  # Range 10-100, centered around 50
        dob = datetime.now() - timedelta(days=age*365.25)
        
        ethnicity = random.choices(ethnicities, weights=ethnicity_weights)[0]
        language = random.choices(languages, weights=language_weights)[0]
        
        # Insurance assignment
        if age >= 65:
            insurance_plan = 'Medicare'
        elif random.random() < 0.15:  # 15% uninsured/Medicaid
            insurance_plan = random.choice(['Medicaid', 'Self-Pay'])
        else:
            insurance_plan = random.choice(INSURANCE_PAYERS[:5])
        
        insurance_id = f"{insurance_plan[:3].upper()}{random.randint(100000000, 999999999)}"
        
        registration_date = random_date(2015, 2024)
        
        patient = {
            'patient_id': patient_id,
            'mrn': mrn,
            'first_name': first_name,
            'last_name': last_name,
            'dob': dob.strftime('%Y-%m-%d'),
            'age': age,
            'gender': gender,
            'ethnicity': ethnicity,
            'language': language,
            'address': fake.street_address(),
            'city': fake.city(),
            'state': fake.state_abbr(),
            'zip': fake.zipcode(),
            'phone': fake.phone_number(),
            'email': f"{first_name.lower()}.{last_name.lower()}{random.randint(1,999)}@{fake.free_email_domain()}",
            'insurance_plan': insurance_plan,
            'insurance_id': insurance_id,
            'registration_date': registration_date.strftime('%Y-%m-%d'),
            'status': 'Active' if random.random() > 0.05 else 'Inactive'
        }
        
        patients.append(patient)
    
    return pd.DataFrame(patients)

def generate_emergency_contacts(patients_df):
    """Generate emergency contact data for patients"""
    contacts = []
    relationships = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 
                     'Partner', 'Grandparent', 'Grandchild', 'Other']
    
    for idx, patient in patients_df.iterrows():
        # 85% of patients have at least one emergency contact
        if random.random() < 0.85:
            num_contacts = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
            
            for i in range(num_contacts):
                contact_id = f"EC{len(contacts)+1:06d}"
                
                # Generate relationship-appropriate names
                relationship = random.choice(relationships)
                if relationship == 'Spouse':
                    contact_name = f"{fake.first_name()} {patient['last_name']}"
                else:
                    contact_name = fake.name()
                
                contact = {
                    'contact_id': contact_id,
                    'patient_id': patient['patient_id'],
                    'name': contact_name,
                    'relationship': relationship,
                    'phone': fake.phone_number(),
                    'address': patient['address'] if random.random() < 0.6 else fake.street_address(),
                    'is_primary': 'Yes' if i == 0 else 'No'
                }
                contacts.append(contact)
    
    return pd.DataFrame(contacts)

def generate_social_determinants(patients_df):
    """Generate social determinants of health data for a subset of patients"""
    sdoh_data = []
    
    # Generate SDOH data for 30% of patients
    sample_patients = patients_df.sample(n=int(len(patients_df) * 0.3), random_state=42)
    
    housing_status = ['Owns home', 'Rents apartment', 'Rents house', 'Lives with family',
                      'Homeless', 'Temporary housing', 'Assisted living']
    housing_weights = [35, 30, 15, 12, 3, 2, 3]
    
    income_levels = ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k', 'Prefer not to say']
    income_weights = [20, 25, 22, 15, 13, 5]
    
    education_levels = ['Less than high school', 'High school/GED', 'Some college',
                        'Associate degree', 'Bachelor degree', 'Graduate degree']
    education_weights = [12, 28, 22, 8, 20, 10]
    
    employment_status = ['Employed full-time', 'Employed part-time', 'Self-employed',
                         'Unemployed', 'Retired', 'Disabled', 'Student']
    
    for idx, patient in sample_patients.iterrows():
        # Determine employment based on age
        if patient['age'] >= 65:
            employment = random.choices(['Retired', 'Employed part-time', 'Employed full-time'],
                                        weights=[70, 20, 10])[0]
        elif patient['age'] < 22:
            employment = random.choices(['Student', 'Employed part-time', 'Unemployed'],
                                        weights=[60, 30, 10])[0]
        else:
            employment = random.choice(employment_status[:4])
        
        sdoh_record = {
            'patient_id': patient['patient_id'],
            'housing_status': random.choices(housing_status, weights=housing_weights)[0],
            'income_level': random.choices(income_levels, weights=income_weights)[0],
            'education_level': random.choices(education_levels, weights=education_weights)[0],
            'employment_status': employment,
            'food_security': random.choices(['Secure', 'Insecure'], weights=[75, 25])[0],
            'transportation_access': random.choices(['Reliable', 'Limited', 'None'], 
                                                    weights=[70, 22, 8])[0],
            'social_isolation_risk': random.choices(['Low', 'Moderate', 'High'], 
                                                     weights=[60, 30, 10])[0],
            'data_collected_date': random_date(2023, 2025).strftime('%Y-%m-%d')
        }
        sdoh_data.append(sdoh_record)
    
    return sdoh_data

def main():
    print("Generating Patient Identity Data...")
    print(f"Target: {NUM_PATIENTS} patients")
    
    # Generate patients
    print("\n1. Generating patient records...")
    patients_df = generate_patients(NUM_PATIENTS)
    output_file = '../Patient_Identity/patients.csv'
    patients_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(patients_df)} patients → {output_file}")
    
    # Generate emergency contacts
    print("\n2. Generating emergency contacts...")
    contacts_df = generate_emergency_contacts(patients_df)
    output_file = '../Patient_Identity/emergency_contacts.csv'
    contacts_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(contacts_df)} emergency contacts → {output_file}")
    
    # Generate social determinants
    print("\n3. Generating social determinants of health data...")
    sdoh_data = generate_social_determinants(patients_df)
    output_file = '../Patient_Identity/social_determinants.json'
    with open(output_file, 'w') as f:
        json.dump(sdoh_data, f, indent=2)
    print(f"   ✓ Created {len(sdoh_data)} SDOH records → {output_file}")
    
    print("\n" + "="*60)
    print("Patient Identity Data Generation Complete!")
    print("="*60)
    print(f"Total Patients: {len(patients_df)}")
    print(f"Active Patients: {len(patients_df[patients_df['status'] == 'Active'])}")
    print(f"Emergency Contacts: {len(contacts_df)}")
    print(f"SDOH Records: {len(sdoh_data)}")

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
