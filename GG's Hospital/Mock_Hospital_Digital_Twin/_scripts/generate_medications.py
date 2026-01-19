"""
Generate medication orders, administration records, and pharmacy inventory
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import RXNORM_CODES, random_date, random_datetime, generate_staff_id

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_medication_orders(patients_df):
    """Generate medication orders"""
    orders = []
    
    routes = ['Oral', 'IV', 'IM', 'Subcutaneous', 'Topical', 'Inhalation', 'Ophthalmic', 'Otic']
    frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 
                   'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
                   'At bedtime', 'As needed', 'Once weekly']
    statuses = ['Active', 'Completed', 'Discontinued', 'On hold']
    
    rxnorm_items = list(RXNORM_CODES.items())
    
    # 80% of patients have at least one medication
    for idx, patient in patients_df.iterrows():
        if random.random() < 0.8:
            # Older patients typically have more medications
            if patient['age'] < 40:
                num_meds = random.choices([0, 1, 2, 3], weights=[20, 40, 30, 10])[0]
            elif patient['age'] < 65:
                num_meds = random.choices([1, 2, 3, 4, 5], weights=[15, 25, 30, 20, 10])[0]
            else:
                num_meds = random.choices([2, 3, 4, 5, 6, 7, 8], weights=[10, 15, 20, 20, 15, 10, 10])[0]
            
            selected_meds = random.sample(rxnorm_items, min(num_meds, len(rxnorm_items)))
            
            for rxnorm_code, drug_description in selected_meds:
                order_id = f"MED{len(orders)+1:08d}"
                
                # Parse drug name and dose from description
                parts = drug_description.split(' ')
                drug_name = parts[0]
                dose = ' '.join(parts[1:3]) if len(parts) > 2 else parts[1]
                
                # Determine route based on formulation
                if 'Oral Tablet' in drug_description or 'Oral Capsule' in drug_description:
                    route = 'Oral'
                elif 'Inhaler' in drug_description:
                    route = 'Inhalation'
                elif 'Nasal Spray' in drug_description:
                    route = 'Intranasal'
                else:
                    route = random.choice(routes)
                
                frequency = random.choice(frequencies)
                
                # Start date (in the past)
                start_date = random_date(2023, 2025)
                
                # End date for some medications
                status = random.choices(statuses, weights=[70, 15, 10, 5])[0]
                end_date = ''
                if status in ['Completed', 'Discontinued']:
                    days_duration = random.randint(7, 180)
                    end_date = (start_date + timedelta(days=days_duration)).strftime('%Y-%m-%d')
                
                order = {
                    'order_id': order_id,
                    'patient_id': patient['patient_id'],
                    'drug_name': drug_name,
                    'rxnorm_code': rxnorm_code,
                    'dose': dose,
                    'route': route,
                    'frequency': frequency,
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date,
                    'prescriber_id': generate_staff_id(),
                    'status': status
                }
                orders.append(order)
    
    return pd.DataFrame(orders)

def generate_med_administration(orders_df):
    """Generate medication administration records (MAR)"""
    administrations = []
    
    # Sample active orders to generate administrations
    active_orders = orders_df[orders_df['status'] == 'Active'].copy()
    
    # Generate administrations for recent dates
    for idx, order in active_orders.sample(n=min(500, len(active_orders)), random_state=42).iterrows():
        # Generate multiple administration records
        num_administrations = random.randint(3, 15)
        
        for i in range(num_administrations):
            admin_id = f"MAR{len(administrations)+1:08d}"
            
            # Scheduled time
            scheduled_time = random_datetime(2024, 2025)
            
            # Actual time (usually within 30 minutes of scheduled)
            time_diff = timedelta(minutes=random.randint(-30, 30))
            actual_time = scheduled_time + time_diff
            
            # Administration status
            admin_status = random.choices(['Given', 'Refused', 'Held', 'Missed'],
                                         weights=[90, 5, 3, 2])[0]
            
            dose_given = order['dose'] if admin_status == 'Given' else ''
            
            notes = ''
            if admin_status == 'Refused':
                notes = random.choice(['Patient refused medication', 
                                      'Patient states already feeling better',
                                      'Patient requesting to skip dose'])
            elif admin_status == 'Held':
                notes = random.choice(['Per MD order', 'Patient NPO', 'Vital signs out of range'])
            elif admin_status == 'Missed':
                notes = 'Patient off unit for procedure'
            
            administration = {
                'admin_id': admin_id,
                'order_id': order['order_id'],
                'patient_id': order['patient_id'],
                'drug_name': order['drug_name'],
                'scheduled_time': scheduled_time.strftime('%Y-%m-%d %H:%M'),
                'actual_time': actual_time.strftime('%Y-%m-%d %H:%M') if admin_status == 'Given' else '',
                'dose_given': dose_given,
                'route': order['route'],
                'nurse_id': generate_staff_id(),
                'status': admin_status,
                'notes': notes
            }
            administrations.append(administration)
    
    return pd.DataFrame(administrations)

def generate_pharmacy_inventory():
    """Generate pharmacy inventory"""
    inventory = []
    
    # Expand RxNorm codes to create inventory
    for rxnorm_code, description in RXNORM_CODES.items():
        inventory_id = f"INV{len(inventory)+1:06d}"
        
        # Parse drug information
        parts = description.split(' ')
        drug_name = parts[0]
        form = 'Tablet' if 'Tablet' in description else 'Capsule' if 'Capsule' in description else 'Inhaler' if 'Inhaler' in description else 'Spray' if 'Spray' in description else 'Other'
        strength = ' '.join(parts[1:3]) if len(parts) > 2 else parts[1]
        
        # Generate NDC code (realistic format)
        ndc_code = f"{random.randint(10000, 99999)}-{random.randint(100, 999)}-{random.randint(10, 99)}"
        
        # Stock level (random but realistic)
        stock_level = random.randint(50, 5000)
        
        # Unit
        if form in ['Tablet', 'Capsule']:
            unit = 'tablets' if form == 'Tablet' else 'capsules'
        elif form == 'Inhaler':
            unit = 'inhalers'
        elif form == 'Spray':
            unit = 'bottles'
        else:
            unit = 'units'
        
        # Lot number
        lot_number = f"LOT{random.randint(100000, 999999)}"
        
        # Expiry date (6 months to 2 years from now)
        expiry_date = datetime.now() + timedelta(days=random.randint(180, 730))
        
        # Location
        location = f"Pharmacy-{random.choice(['Main', 'North', 'South', 'ED'])}-{random.choice(['A', 'B', 'C'])}{random.randint(1,20)}"
        
        item = {
            'inventory_id': inventory_id,
            'drug_name': drug_name,
            'ndc_code': ndc_code,
            'rxnorm_code': rxnorm_code,
            'form': form,
            'strength': strength,
            'stock_level': stock_level,
            'unit': unit,
            'lot_number': lot_number,
            'expiry_date': expiry_date.strftime('%Y-%m-%d'),
            'location': location
        }
        inventory.append(item)
    
    # Add multiple lots for common medications
    common_meds = random.sample(inventory, min(10, len(inventory)))
    for med in common_meds:
        for i in range(2):
            new_item = med.copy()
            new_item['inventory_id'] = f"INV{len(inventory)+1:06d}"
            new_item['lot_number'] = f"LOT{random.randint(100000, 999999)}"
            new_item['stock_level'] = random.randint(50, 5000)
            expiry_date = datetime.now() + timedelta(days=random.randint(180, 730))
            new_item['expiry_date'] = expiry_date.strftime('%Y-%m-%d')
            inventory.append(new_item)
    
    return pd.DataFrame(inventory)

def main():
    print("Generating Medications Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate medication orders
    print("1. Generating medication orders...")
    orders_df = generate_medication_orders(patients_df)
    output_file = '../Medications/medication_orders.csv'
    orders_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(orders_df)} medication orders → {output_file}")
    
    # Generate medication administration records
    print("\n2. Generating medication administration records...")
    admin_df = generate_med_administration(orders_df)
    output_file = '../Medications/med_administration.csv'
    admin_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(admin_df)} MAR records → {output_file}")
    
    # Generate pharmacy inventory
    print("\n3. Generating pharmacy inventory...")
    inventory_df = generate_pharmacy_inventory()
    output_file = '../Medications/pharmacy_inventory.csv'
    inventory_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(inventory_df)} inventory items → {output_file}")
    
    print("\n" + "="*60)
    print("Medications Data Generation Complete!")
    print("="*60)
    print(f"Medication Orders: {len(orders_df)} records")
    print(f"Administration Records: {len(admin_df)} records")
    print(f"Pharmacy Inventory: {len(inventory_df)} items")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
