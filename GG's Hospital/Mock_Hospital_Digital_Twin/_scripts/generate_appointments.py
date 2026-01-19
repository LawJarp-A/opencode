"""
Generate appointments and visit summaries
"""
import os
import sys
import random
import pandas as pd
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))
from shared_data import DEPARTMENTS, random_datetime, generate_staff_id

random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_appointments(patients_df):
    """Generate appointment records"""
    appointments = []
    
    visit_types = ['Office Visit', 'Follow-up', 'Annual Physical', 'Urgent Care',
                   'Telemedicine', 'Pre-op', 'Post-op', 'Consultation', 'Procedure']
    
    locations = ['Main Campus - Building A', 'Main Campus - Building B',
                 'North Clinic', 'South Clinic', 'East Medical Center',
                 'West Urgent Care', 'Telehealth']
    
    statuses = ['Completed', 'Scheduled', 'Cancelled', 'No-show']
    
    reasons = [
        'Annual checkup', 'Follow-up visit', 'New problem', 'Chronic disease management',
        'Medication refill', 'Lab review', 'Imaging review', 'Post-surgical follow-up',
        'Vaccination', 'Physical exam', 'Consultation', 'Procedure'
    ]
    
    # 90% of patients have appointments
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.9), random_state=42).iterrows():
        num_appointments = random.randint(1, 8)
        
        for i in range(num_appointments):
            appointment_id = f"APT{len(appointments)+1:08d}"
            
            # Appointment date (spread over last 2 years and upcoming 3 months)
            date_time = random_datetime(2023, 2025)
            
            # If in the future, it's scheduled
            if date_time > datetime.now():
                status = 'Scheduled'
            else:
                status = random.choices(statuses, weights=[85, 0, 10, 5])[0]
            
            visit_type = random.choice(visit_types)
            location = random.choice(locations) if visit_type != 'Telemedicine' else 'Telehealth'
            
            # Select appropriate department
            department = random.choice(DEPARTMENTS[:10])  # Exclude non-clinical depts
            
            duration_minutes = random.choices([15, 20, 30, 45, 60], weights=[20, 30, 30, 15, 5])[0]
            
            appointment = {
                'appointment_id': appointment_id,
                'patient_id': patient['patient_id'],
                'date_time': date_time.strftime('%Y-%m-%d %H:%M'),
                'location': location,
                'department': department,
                'visit_type': visit_type,
                'provider_id': generate_staff_id(),
                'status': status,
                'reason': random.choice(reasons),
                'duration_minutes': duration_minutes
            }
            appointments.append(appointment)
    
    return pd.DataFrame(appointments)

def generate_visit_summaries():
    """Generate sample SOAP notes for visits"""
    summaries = [
        {
            'patient_id': 'P000042',
            'date': '2025-01-15',
            'provider': 'Dr. Sarah Johnson, MD - Internal Medicine',
            'visit_type': 'Follow-up Visit',
            'note': '''**Subjective:**
Patient is a 67-year-old male presenting for follow-up of Type 2 diabetes and hypertension. Reports good medication compliance. Denies chest pain, shortness of breath, or palpitations. Blood sugars have been ranging 110-150 mg/dL. No hypoglycemic episodes. Diet and exercise compliance good.

**Objective:**
- Vitals: BP 128/82, HR 72, Temp 98.4°F, Weight 185 lbs (stable)
- General: Alert, well-appearing, no acute distress
- Cardiovascular: Regular rate and rhythm, no murmurs
- Respiratory: Clear to auscultation bilaterally
- Extremities: No edema, pulses intact

**Assessment:**
1. Type 2 Diabetes Mellitus - well controlled
2. Essential Hypertension - controlled
3. Hyperlipidemia - stable

**Plan:**
1. Continue Metformin 1000mg BID
2. Continue Lisinopril 20mg daily
3. Continue Atorvastatin 40mg daily
4. Repeat HbA1c and lipid panel in 3 months
5. Return to clinic in 3 months or sooner if concerns'''
        },
        {
            'patient_id': 'P000127',
            'date': '2025-01-14',
            'provider': 'Dr. Michael Chen, MD - Family Medicine',
            'visit_type': 'Annual Physical',
            'note': '''**Subjective:**
45-year-old female here for annual physical examination. No current complaints. Reports general good health. Exercises 3-4 times per week. Non-smoker, occasional alcohol use. Family history significant for breast cancer in mother (age 62).

**Objective:**
- Vitals: BP 118/76, HR 68, Temp 98.6°F, BMI 24.2
- General: Well-developed, well-nourished female in no distress
- HEENT: Normocephalic, PERRLA, TMs clear
- Cardiovascular: RRR, no murmurs
- Respiratory: Clear bilaterally
- Abdomen: Soft, non-tender, no organomegaly
- Breast: No masses or skin changes
- Extremities: Full ROM, no edema

**Assessment:**
1. Health maintenance visit - annual physical

**Plan:**
1. Screening labs: CBC, CMP, lipid panel, TSH
2. Mammogram ordered (due to family history)
3. Continue current exercise and diet
4. Return in 1 year for annual physical
5. Call for any new concerns'''
        },
        {
            'patient_id': 'P000389',
            'date': '2025-01-16',
            'provider': 'Dr. Lisa Rodriguez, MD - Pain Management',
            'visit_type': 'Follow-up Visit',
            'note': '''**Subjective:**
Patient with chronic low back pain presenting for follow-up. Reports pain level 6/10 despite current medications. Pain radiating to right leg. Physical therapy has helped somewhat. Denies bowel/bladder dysfunction or progressive weakness.

**Objective:**
- Vitals: BP 132/88, HR 78, Pain 6/10
- Gait: Slightly antalgic on right
- Spine: Tenderness over L4-L5 region
- Straight leg raise: Positive on right at 45 degrees
- Strength: 5/5 bilateral lower extremities
- Sensation: Intact to light touch

**Assessment:**
1. Chronic low back pain with radiculopathy
2. Lumbar degenerative disc disease (L4-L5, L5-S1)

**Plan:**
1. Continue Gabapentin 300mg TID
2. Add Meloxicam 15mg daily
3. Refer to spine specialist for evaluation
4. Consider epidural steroid injection
5. Continue physical therapy
6. Follow up in 4 weeks'''
        },
        {
            'patient_id': 'P000521',
            'date': '2025-01-13',
            'provider': 'Dr. Robert Williams, MD - Gastroenterology',
            'visit_type': 'Consultation',
            'note': '''**Subjective:**
52-year-old female referred for evaluation of right upper quadrant pain. Pain described as intermittent, worse after fatty meals. Associated with nausea. Denies fever, jaundice, or dark urine. Episodes have increased in frequency over past 3 months.

**Objective:**
- Vitals: BP 124/80, HR 72, Temp 98.4°F
- Abdomen: Soft, tender in RUQ, positive Murphy's sign
- No rebound or guarding
- Labs: WBC 7.2, normal LFTs
- U/S abdomen shows cholelithiasis without acute cholecystitis

**Assessment:**
1. Symptomatic cholelithiasis (gallstones)
2. Biliary colic

**Plan:**
1. Referral to general surgery for laparoscopic cholecystectomy
2. Low-fat diet until surgery
3. Hyoscyamine PRN for spasms
4. Presented case at surgical conference
5. Surgery scheduled for 2025-02-05'''
        },
        {
            'patient_id': 'P000678',
            'date': '2025-01-08',
            'provider': 'Dr. Jennifer Lee, MD - Cardiology',
            'visit_type': 'New Patient Consultation',
            'note': '''**Subjective:**
68-year-old male with history of hypertension, hyperlipidemia presenting with episodes of chest pressure with exertion. Symptoms resolve with rest. No chest pain at rest. No orthopnea or PND. Occasional palpitations.

**Objective:**
- Vitals: BP 142/90, HR 88 irregular, Temp 98.6°F
- Cardiovascular: Irregularly irregular rhythm, no murmurs
- Respiratory: Clear to auscultation
- Extremities: No edema, 2+ pulses
- EKG: Atrial fibrillation, rate 88, no acute ST changes

**Assessment:**
1. Atrial fibrillation, newly diagnosed
2. Stable angina
3. Hypertension
4. Hyperlipidemia

**Plan:**
1. Start Eliquis 5mg BID for anticoagulation
2. Start Metoprolol 25mg BID for rate control
3. Order stress test and echocardiogram
4. Order Holter monitor
5. Follow up in 2 weeks with test results
6. Patient educated on AFib and stroke risk'''
        }
    ]
    
    return summaries

def main():
    print("Generating Appointments & Visits Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate appointments
    print("1. Generating appointments...")
    appointments_df = generate_appointments(patients_df)
    output_file = '../Appointments_Visits/appointments.csv'
    appointments_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(appointments_df)} appointments → {output_file}")
    
    # Generate visit summaries
    print("\n2. Generating visit summaries (SOAP notes)...")
    summaries = generate_visit_summaries()
    output_file = '../Appointments_Visits/visit_summary.md'
    
    with open(output_file, 'w') as f:
        f.write("# Visit Summaries - SOAP Notes\n\n")
        f.write("Sample clinical documentation using SOAP (Subjective, Objective, Assessment, Plan) format.\n\n")
        f.write("---\n\n")
        
        for summary in summaries:
            f.write(f"## Patient ID: {summary['patient_id']}\n\n")
            f.write(f"**Date**: {summary['date']}  \n")
            f.write(f"**Provider**: {summary['provider']}  \n")
            f.write(f"**Visit Type**: {summary['visit_type']}\n\n")
            f.write(summary['note'])
            f.write("\n\n---\n\n")
    
    print(f"   ✓ Created {len(summaries)} visit summaries → {output_file}")
    
    print("\n" + "="*60)
    print("Appointments & Visits Data Generation Complete!")
    print("="*60)
    print(f"Appointments: {len(appointments_df)} records")
    print(f"Visit Summaries: {len(summaries)} notes")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
