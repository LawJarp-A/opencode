"""
Generate lab orders and results
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import LOINC_CODES, random_date, random_datetime, generate_staff_id

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_lab_orders(patients_df):
    """Generate lab orders"""
    orders = []
    
    # Common lab panels and their LOINC codes
    lab_panels = {
        'Complete Blood Count': ['718-7', '6690-2', '777-3'],
        'Basic Metabolic Panel': ['2951-2', '2823-3', '2345-7', '2160-0', '3094-0'],
        'Comprehensive Metabolic Panel': ['2951-2', '2823-3', '2345-7', '2160-0', '3094-0', 
                                          '1742-6', '1920-8', '1975-2', '17861-6'],
        'Lipid Panel': ['2093-3', '2571-8', '2085-9', '13457-7'],
        'Hemoglobin A1c': ['4548-4'],
        'Thyroid Panel': ['3016-3'],
        'Coagulation Panel': ['3151-8', '6301-6'],
    }
    
    specimen_types = ['Blood', 'Serum', 'Plasma', 'Urine', 'CSF']
    priorities = ['Routine', 'STAT', 'Urgent']
    statuses = ['Completed', 'Pending', 'In Progress', 'Cancelled']
    
    # 70% of patients have lab orders
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.7), random_state=42).iterrows():
        # Number of lab orders based on age and health status
        if patient['age'] < 40:
            num_orders = random.randint(1, 5)
        elif patient['age'] < 65:
            num_orders = random.randint(2, 10)
        else:
            num_orders = random.randint(5, 20)
        
        for i in range(num_orders):
            order_id = f"LAB{len(orders)+1:08d}"
            encounter_id = f"ENC{random.randint(100000, 999999)}"
            
            # Select a lab panel
            panel_name = random.choice(list(lab_panels.keys()))
            loinc_list = lab_panels[panel_name]
            
            # For this order, we'll create one entry per test in the panel
            for loinc_code in loinc_list:
                test_name = LOINC_CODES.get(loinc_code, 'Unknown Test')
                
                order_date = random_datetime(2023, 2025)
                
                # Specimen type
                if 'Urine' in test_name:
                    specimen = 'Urine'
                elif 'CSF' in test_name:
                    specimen = 'CSF'  
                else:
                    specimen = random.choice(['Blood', 'Serum', 'Plasma'])
                
                priority = random.choices(priorities, weights=[80, 10, 10])[0]
                status = random.choices(statuses, weights=[85, 5, 8, 2])[0]
                
                order = {
                    'order_id': f"{order_id}-{loinc_code}",
                    'patient_id': patient['patient_id'],
                    'encounter_id': encounter_id,
                    'test_name': test_name,
                    'loinc_code': loinc_code,
                    'specimen_type': specimen,
                    'order_date': order_date.strftime('%Y-%m-%d %H:%M'),
                    'ordering_provider': generate_staff_id(),
                    'priority': priority,
                    'status': status
                }
                orders.append(order)
    
    return pd.DataFrame(orders)

def generate_lab_results(orders_df):
    """Generate lab results based on orders"""
    results = []
    
    # Reference ranges and typical values for each test
    test_parameters = {
        '2345-7': {'name': 'Glucose', 'mean': 95, 'std': 15, 'unit': 'mg/dL', 'ref_range': '70-100 mg/dL', 'low': 70, 'high': 100},
        '2093-3': {'name': 'Cholesterol', 'mean': 195, 'std': 30, 'unit': 'mg/dL', 'ref_range': '<200 mg/dL', 'low': 0, 'high': 200},
        '2571-8': {'name': 'Triglycerides', 'mean': 130, 'std': 40, 'unit': 'mg/dL', 'ref_range': '<150 mg/dL', 'low': 0, 'high': 150},
        '2085-9': {'name': 'HDL Cholesterol', 'mean': 55, 'std': 12, 'unit': 'mg/dL', 'ref_range': '>40 mg/dL', 'low': 40, 'high': 999},
        '13457-7': {'name': 'LDL Cholesterol', 'mean': 115, 'std': 25, 'unit': 'mg/dL', 'ref_range': '<100 mg/dL', 'low': 0, 'high': 100},
        '718-7': {'name': 'Hemoglobin', 'mean': 14.0, 'std': 1.5, 'unit': 'g/dL', 'ref_range': '12-16 g/dL', 'low': 12, 'high': 16},
        '6690-2': {'name': 'WBC', 'mean': 7.5, 'std': 2.0, 'unit': 'K/uL', 'ref_range': '4-11 K/uL', 'low': 4, 'high': 11},
        '777-3': {'name': 'Platelets', 'mean': 250, 'std': 50, 'unit': 'K/uL', 'ref_range': '150-400 K/uL', 'low': 150, 'high': 400},
        '2160-0': {'name': 'Creatinine', 'mean': 1.0, 'std': 0.2, 'unit': 'mg/dL', 'ref_range': '0.7-1.3 mg/dL', 'low': 0.7, 'high': 1.3},
        '3094-0': {'name': 'BUN', 'mean': 15, 'std': 5, 'unit': 'mg/dL', 'ref_range': '7-20 mg/dL', 'low': 7, 'high': 20},
        '2951-2': {'name': 'Sodium', 'mean': 140, 'std': 3, 'unit': 'mmol/L', 'ref_range': '136-145 mmol/L', 'low': 136, 'high': 145},
        '2823-3': {'name': 'Potassium', 'mean': 4.2, 'std': 0.4, 'unit': 'mmol/L', 'ref_range': '3.5-5.0 mmol/L', 'low': 3.5, 'high': 5.0},
        '17861-6': {'name': 'Calcium', 'mean': 9.5, 'std': 0.5, 'unit': 'mg/dL', 'ref_range': '8.5-10.5 mg/dL', 'low': 8.5, 'high': 10.5},
        '1742-6': {'name': 'ALT', 'mean': 25, 'std': 10, 'unit': 'U/L', 'ref_range': '7-56 U/L', 'low': 7, 'high': 56},
        '1920-8': {'name': 'AST', 'mean': 28, 'std': 12, 'unit': 'U/L', 'ref_range': '10-40 U/L', 'low': 10, 'high': 40},
        '1975-2': {'name': 'Bilirubin Total', 'mean': 0.8, 'std': 0.3, 'unit': 'mg/dL', 'ref_range': '0.3-1.2 mg/dL', 'low': 0.3, 'high': 1.2},
        '3151-8': {'name': 'PT', 'mean': 12.5, 'std': 1.0, 'unit': 'seconds', 'ref_range': '11-13.5 seconds', 'low': 11, 'high': 13.5},
        '6301-6': {'name': 'INR', 'mean': 1.0, 'std': 0.1, 'unit': '', 'ref_range': '0.8-1.2', 'low': 0.8, 'high': 1.2},
        '4548-4': {'name': 'Hemoglobin A1c', 'mean': 5.8, 'std': 0.8, 'unit': '%', 'ref_range': '<5.7%', 'low': 0, 'high': 5.7},
        '3016-3': {'name': 'TSH', 'mean': 2.5, 'std': 1.0, 'unit': 'mIU/L', 'ref_range': '0.4-4.0 mIU/L', 'low': 0.4, 'high': 4.0},
    }
    
    # Generate results for completed orders
    completed_orders = orders_df[orders_df['status'] == 'Completed'].copy()
    
    for idx, order in completed_orders.iterrows():
        result_id = f"RES{len(results)+1:08d}"
        
        loinc_code = order['loinc_code']
        
        if loinc_code in test_parameters:
            params = test_parameters[loinc_code]
            
            # Generate value with some variation
            value = np.random.normal(params['mean'], params['std'])
            
            # Round appropriately
            if params['std'] < 1:
                value = round(value, 1)
            else:
                value = round(value, 0 if params['mean'] > 10 else 1)
            
            # Determine if abnormal
            if value < params['low']:
                abnormal_flag = 'Low'
            elif value > params['high']:
                abnormal_flag = 'High'
            else:
                abnormal_flag = ''
            
            # Result date (shortly after order date)
            order_date = datetime.strptime(order['order_date'], '%Y-%m-%d %H:%M')
            result_date = order_date + timedelta(hours=random.randint(2, 24))
            
            result = {
                'result_id': result_id,
                'order_id': order['order_id'],
                'patient_id': order['patient_id'],
                'analyte': params['name'],
                'loinc_code': loinc_code,
                'value': value,
                'unit': params['unit'],
                'reference_range': params['ref_range'],
                'abnormal_flag': abnormal_flag,
                'result_date': result_date.strftime('%Y-%m-%d %H:%M'),
                'performed_by': generate_staff_id()
            }
            results.append(result)
    
    return pd.DataFrame(results)

def main():
    print("Generating Lab Results Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate lab orders
    print("1. Generating lab orders...")
    orders_df = generate_lab_orders(patients_df)
    output_file = '../Lab_Results/lab_orders.csv'
    orders_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(orders_df)} lab orders → {output_file}")
    
    # Generate lab results
    print("\n2. Generating lab results...")
    results_df = generate_lab_results(orders_df)
    output_file = '../Lab_Results/lab_results.csv'
    results_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(results_df)} lab results → {output_file}")
    
    print("\n" + "="*60)
    print("Lab Results Data Generation Complete!")
    print("="*60)
    print(f"Lab Orders: {len(orders_df)} records")
    print(f"Lab Results: {len(results_df)} records")
    print(f"Abnormal Results: {len(results_df[results_df['abnormal_flag'] != ''])} records")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
