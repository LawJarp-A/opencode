"""
Generate analytics and reporting data
"""
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))

random.seed(42)
np.random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_kpi_dashboard():
    """Generate KPI dashboard metrics"""
    kpis = []
    
    # Define time periods
    periods = [
        ('2024-Q1', '2024-01-01', '2024-03-31'),
        ('2024-Q2', '2024-04-01', '2024-06-30'),
        ('2024-Q3', '2024-07-01', '2024-09-30'),
        ('2024-Q4', '2024-10-01', '2024-12-31'),
    ]
    
    departments = ['Emergency Department', 'Internal Medicine', 'Surgery', 
                   'Cardiology', 'Orthopedics', 'Overall Hospital']
    
    for period_name, period_start, period_end in periods:
        for dept in departments:
            # Average Length of Stay
            kpis.append({
                'metric_name': 'Average Length of Stay',
                'value': round(random.uniform(3.5, 6.5), 2),
                'unit': 'days',
                'period_start': period_start,
                'period_end': period_end,
                'department': dept,
                'benchmark': 5.0
            })
            
            # Readmission Rate (30-day)
            kpis.append({
                'metric_name': '30-Day Readmission Rate',
                'value': round(random.uniform(8, 15), 2),
                'unit': 'percent',
                'period_start': period_start,
                'period_end': period_end,
                'department': dept,
                'benchmark': 12.0
            })
            
            # Bed Occupancy Rate
            if dept not in ['Emergency Department']:
                kpis.append({
                    'metric_name': 'Bed Occupancy Rate',
                    'value': round(random.uniform(72, 92), 2),
                    'unit': 'percent',
                    'period_start': period_start,
                    'period_end': period_end,
                    'department': dept,
                    'benchmark': 85.0
                })
            
            # OR Utilization (Surgery only)
            if dept in ['Surgery', 'Orthopedics', 'Cardiology', 'Overall Hospital']:
                kpis.append({
                    'metric_name': 'OR Utilization Rate',
                    'value': round(random.uniform(65, 85), 2),
                    'unit': 'percent',
                    'period_start': period_start,
                    'period_end': period_end,
                    'department': dept,
                    'benchmark': 75.0
                })
            
            # ED Wait Time
            if dept == 'Emergency Department':
                kpis.append({
                    'metric_name': 'Average ED Wait Time',
                    'value': round(random.uniform(25, 65), 1),
                    'unit': 'minutes',
                    'period_start': period_start,
                    'period_end': period_end,
                    'department': dept,
                    'benchmark': 45.0
                })
                
                kpis.append({
                    'metric_name': 'ED Left Without Being Seen Rate',
                    'value': round(random.uniform(1.5, 4.5), 2),
                    'unit': 'percent',
                    'period_start': period_start,
                    'period_end': period_end,
                    'department': dept,
                    'benchmark': 3.0
                })
            
            # Patient Satisfaction
            kpis.append({
                'metric_name': 'Patient Satisfaction Score',
                'value': round(random.uniform(75, 95), 1),
                'unit': 'score (0-100)',
                'period_start': period_start,
                'period_end': period_end,
                'department': dept,
                'benchmark': 85.0
            })
            
            # Hospital Acquired Infection Rate
            kpis.append({
                'metric_name': 'Hospital Acquired Infection Rate',
                'value': round(random.uniform(0.8, 3.2), 2),
                'unit': 'per 1000 patient days',
                'period_start': period_start,
                'period_end': period_end,
                'department': dept,
                'benchmark': 2.0
            })
            
            # Mortality Rate
            kpis.append({
                'metric_name': 'Risk-Adjusted Mortality Rate',
                'value': round(random.uniform(1.2, 3.5), 2),
                'unit': 'percent',
                'period_start': period_start,
                'period_end': period_end,
                'department': dept,
                'benchmark': 2.5
            })
    
    return pd.DataFrame(kpis)

def generate_predictive_risk_scores(patients_df):
    """Generate predictive risk scores for patients"""
    risk_scores = []
    
    risk_types = [
        'Readmission Risk',
        'Fall Risk',
        'Sepsis Risk',
        'Mortality Risk',
        'Pressure Ulcer Risk',
        'Medication Non-Adherence Risk'
    ]
    
    model_versions = ['v2.1', 'v2.3', 'v3.0']
    
    # Generate risk scores for 50% of patients
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.5), random_state=42).iterrows():
        # Each patient gets 1-3 risk scores
        num_scores = random.randint(1, 3)
        selected_risks = random.sample(risk_types, num_scores)
        
        for risk_type in selected_risks:
            score_id = f"RISK{len(risk_scores)+1:07d}"
            
            # Generate score (0-100)
            # Older patients typically have higher risk scores
            if patient['age'] > 65:
                base_score = random.uniform(40, 85)
            elif patient['age'] > 50:
                base_score = random.uniform(25, 60)
            else:
                base_score = random.uniform(10, 45)
            
            score = round(base_score, 1)
            
            # Classify risk level
            if score < 30:
                risk_level = 'Low'
            elif score < 60:
                risk_level = 'Medium'
            else:
                risk_level = 'High'
            
            # Generate contributing factors
            all_factors = {
                'Readmission Risk': ['Recent hospitalization', 'Multiple comorbidities', 
                                    'Poor medication adherence', 'Lack of social support'],
                'Fall Risk': ['Advanced age', 'History of falls', 'Gait instability', 
                             'Multiple medications', 'Cognitive impairment'],
                'Sepsis Risk': ['Immunocompromised', 'Recent surgery', 'Chronic disease',
                               'Advanced age', 'Indwelling devices'],
                'Mortality Risk': ['Advanced age', 'Multiple comorbidities', 'Critical illness',
                                  'Recent deterioration', 'Frailty'],
                'Pressure Ulcer Risk': ['Limited mobility', 'Poor nutrition', 'Moisture/incontinence',
                                       'Advanced age', 'Cognitive impairment'],
                'Medication Non-Adherence Risk': ['Multiple medications', 'Cognitive impairment',
                                                  'Cost barriers', 'Complex regimen', 'Depression']
            }
            
            factors = random.sample(all_factors.get(risk_type, []), random.randint(2, 4))
            
            calculated_date = datetime.now() - timedelta(days=random.randint(0, 30))
            
            risk_score = {
                'score_id': score_id,
                'patient_id': patient['patient_id'],
                'risk_type': risk_type,
                'score': score,
                'risk_level': risk_level,
                'model_version': random.choice(model_versions),
                'calculated_date': calculated_date.strftime('%Y-%m-%d'),
                'contributing_factors': '; '.join(factors)
            }
            risk_scores.append(risk_score)
    
    return pd.DataFrame(risk_scores)

def main():
    print("Generating Analytics & Reporting Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate KPI dashboard
    print("1. Generating KPI dashboard...")
    kpi_df = generate_kpi_dashboard()
    output_file = '../Analytics_Reporting/kpi_dashboard.csv'
    kpi_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(kpi_df)} KPI records → {output_file}")
    
    # Generate predictive risk scores
    print("\n2. Generating predictive risk scores...")
    risk_df = generate_predictive_risk_scores(patients_df)
    output_file = '../Analytics_Reporting/predictive_risk_scores.csv'
    risk_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(risk_df)} risk score records → {output_file}")
    
    print("\n" + "="*60)
    print("Analytics & Reporting Data Generation Complete!")
    print("="*60)
    print(f"KPI Metrics: {len(kpi_df)} records")
    print(f"Predictive Risk Scores: {len(risk_df)} records")
    print(f"High Risk Patients: {len(risk_df[risk_df['risk_level'] == 'High'])}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
