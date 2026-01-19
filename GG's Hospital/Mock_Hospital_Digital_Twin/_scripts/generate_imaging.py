"""
Generate imaging orders and radiology reports
"""
import os
import sys
import random
import pandas as pd
from datetime import datetime

sys.path.append(os.path.dirname(__file__))
from shared_data import random_datetime, generate_staff_id

random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_radiology_orders(patients_df):
    """Generate radiology orders"""
    orders = []
    
    imaging_studies = [
        ('X-Ray', 'Chest', '71046'),
        ('X-Ray', 'Abdomen', '74018'),
        ('X-Ray', 'Spine', '72100'),
        ('X-Ray', 'Extremity', '73000'),
        ('CT', 'Head', '70450'),
        ('CT', 'Chest', '71250'),
        ('CT', 'Abdomen/Pelvis', '74177'),
        ('MRI', 'Brain', '70553'),
        ('MRI', 'Spine', '72148'),
        ('MRI', 'Knee', '73721'),
        ('Ultrasound', 'Abdomen', '76700'),
        ('Ultrasound', 'Pelvis', '76856'),
        ('Mammogram', 'Bilateral', '77067'),
    ]
    
    indications = [
        'Chest pain', 'Shortness of breath', 'Abdominal pain', 'Back pain',
        'Headache', 'Trauma', 'Follow-up', 'Screening', 'Rule out fracture',
        'Fever of unknown origin', 'Suspected mass', 'Chronic condition monitoring'
    ]
    
    priorities = ['Routine', 'STAT', 'Urgent']
    statuses = ['Completed', 'Scheduled', 'In Progress', 'Cancelled']
    
    # 50% of patients have imaging orders
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.5), random_state=42).iterrows():
        num_orders = random.randint(1, 5)
        
        for i in range(num_orders):
            order_id = f"RAD{len(orders)+1:08d}"
            encounter_id = f"ENC{random.randint(100000, 999999)}"
            
            modality, body_part, cpt_code = random.choice(imaging_studies)
            indication = random.choice(indications)
            
            order_date = random_datetime(2023, 2025)
            priority = random.choices(priorities, weights=[85, 5, 10])[0]
            status = random.choices(statuses, weights=[80, 10, 8, 2])[0]
            
            order = {
                'order_id': order_id,
                'patient_id': patient['patient_id'],
                'encounter_id': encounter_id,
                'modality': modality,
                'body_part': body_part,
                'cpt_code': cpt_code,
                'indication': indication,
                'order_date': order_date.strftime('%Y-%m-%d %H:%M'),
                'ordering_provider': generate_staff_id(),
                'priority': priority,
                'status': status
            }
            orders.append(order)
    
    return pd.DataFrame(orders)

def generate_radiology_reports():
    """Generate sample radiology reports"""
    reports = [
        {
            'order_id': 'RAD00000123',
            'patient_id': 'P000042',
            'exam': 'CT Chest without Contrast',
            'date': '2025-01-15',
            'radiologist': 'Dr. Sarah Chen, MD',
            'report': '''**CLINICAL HISTORY**: 67-year-old male with persistent cough and shortness of breath.

**TECHNIQUE**: Multidetector CT of the chest was performed without intravenous contrast.

**COMPARISON**: Chest X-ray dated 2024-12-20.

**FINDINGS**:
- **Lungs**: No focal consolidation, mass, or nodule. No pleural effusion or pneumothorax.
- **Mediastinum**: Heart size is normal. No mediastinal or hilar lymphadenopathy.
- **Airways**: Trachea and mainstem bronchi are patent.
- **Bones**: No suspicious lytic or blastic lesions.
- **Soft Tissues**: Unremarkable.

**IMPRESSION**:
1. No acute cardiopulmonary abnormality.
2. Mild emphysematous changes consistent with patient's smoking history.'''
        },
        {
            'order_id': 'RAD00000456',
            'patient_id': 'P000127',
            'exam': 'MRI Brain with and without Contrast',
            'date': '2025-01-14',
            'radiologist': 'Dr. Michael Rodriguez, MD',
            'report': '''**CLINICAL HISTORY**: Episodes of severe headaches with visual disturbances.

**TECHNIQUE**: MRI of the brain was performed with and without gadolinium contrast.

**COMPARISON**: None.

**FINDINGS**:
- **Brain Parenchyma**: No acute infarct, hemorrhage, or mass lesion. White matter appears within normal limits for age.
- **Ventricles**: Normal in size and configuration.
- **Extra-axial Spaces**: No extra-axial fluid collection.
- **Orbits**: Unremarkable.
- **Paranasal Sinuses**: Clear.
- **Mastoid Air Cells**: Well-aerated.

**IMPRESSION**:
1. No acute intracranial abnormality.
2. Suggest clinical correlation and consideration of neurology consultation for headache management.'''
        },
        {
            'order_id': 'RAD00000789',
            'patient_id': 'P000389',
            'exam': 'X-Ray Lumbar Spine',
            'date': '2025-01-16',
            'radiologist': 'Dr. Jennifer Lee, MD',
            'report': '''**CLINICAL HISTORY**: Chronic low back pain.

**TECHNIQUE**: AP and lateral views of the lumbar spine.

**COMPARISON**: Prior lumbar spine X-ray dated 2023-08-10.

**FINDINGS**:
- **Alignment**: Slight levoscoliosis of the lumbar spine.
- **Vertebral Bodies**: Moderate degenerative disc disease at L4-L5 and L5-S1 with disc space narrowing.
- **Posterior Elements**: Facet joint arthropathy at L4-L5.
- **Soft Tissues**: No abnormal soft tissue calcification.

**IMPRESSION**:
1. Moderate degenerative disc disease at L4-L5 and L5-S1, progressed since prior study.
2. Facet arthropathy.
3. Recommend MRI if symptoms warrant further evaluation.'''
        },
        {
            'order_id': 'RAD00000234',
            'patient_id': 'P000521',
            'exam': 'Ultrasound Abdomen Complete',
            'date': '2025-01-13',
            'radiologist': 'Dr. Robert Williams, MD',
            'report': '''**CLINICAL HISTORY**: Right upper quadrant pain.

**TECHNIQUE**: Real-time ultrasound of the abdomen.

**FINDINGS**:
- **Liver**: Normal size and echogenicity. No focal lesion.
- **Gallbladder**: Multiple small echogenic foci with posterior shadowing consistent with gallstones. Wall thickness normal. No pericholecystic fluid.
- **Bile Ducts**: Common bile duct measures 4 mm (normal).
- **Pancreas**: Partially visualized, appears unremarkable.
- **Kidneys**: Both kidneys normal in size and echogenicity. No hydronephrosis or stones.
- **Spleen**: Normal size.

**IMPRESSION**:
1. Cholelithiasis (gallstones) without evidence of acute cholecystitis.
2. Otherwise unremarkable abdominal ultrasound.
3. Clinical correlation recommended.'''
        },
        {
            'order_id': 'RAD00000567',
            'patient_id': 'P000678',
            'exam': 'CT Abdomen and Pelvis with Contrast',
            'date': '2025-01-17',
            'radiologist': 'Dr. Amanda Patel, MD',
            'report': '''**CLINICAL HISTORY**: Abdominal pain and fever.

**TECHNIQUE**: MDCT of the abdomen and pelvis with oral and IV contrast.

**COMPARISON**: None.

**FINDINGS**:
- **Liver**: Normal size, no focal lesion.
- **Gallbladder**: Unremarkable.
- **Pancreas**: Normal.
- **Spleen**: Normal.
- **Kidneys**: Normal enhancement bilaterally.
- **Appendix**: Enlarged appendix measuring 11 mm with periappendiceal fat stranding and a small amount of free fluid. Appendicolith present.
- **Bowel**: No obstruction or perforation.
- **Pelvis**: Small amount of free fluid.

**IMPRESSION**:
1. Acute appendicitis with appendicolith.
2. Recommend surgical consultation.'''
        },
        {
            'order_id': 'RAD00000890',
            'patient_id': 'P000815',
            'exam': 'Chest X-Ray PA and Lateral',
            'date': '2025-01-12',
            'radiologist': 'Dr. David Thompson, MD',
            'report': '''**CLINICAL HISTORY**: Cough and fever.

**TECHNIQUE**: PA and lateral chest radiograph.

**COMPARISON**: Chest X-ray dated 2024-11-05.

**FINDINGS**:
- **Lungs**: Patchy airspace opacity in the right lower lobe consistent with pneumonia. No pleural effusion.
- **Heart**: Normal size.
- **Mediastinum**: Normal contours.
- **Bones**: Degenerative changes in the thoracic spine.

**IMPRESSION**:
1. Right lower lobe pneumonia.
2. Recommend appropriate antibiotic therapy and follow-up imaging to document resolution.'''
        },
        {
            'order_id': 'RAD00001123',
            'patient_id': 'P000903',
            'exam': 'Mammogram Screening Bilateral',
            'date': '2025-01-18',
            'radiologist': 'Dr. Lisa Martinez, MD',
            'report': '''**CLINICAL HISTORY**: Routine screening mammogram, 52-year-old female.

**TECHNIQUE**: Digital mammography with bilateral MLO and CC views.

**COMPARISON**: Prior mammogram dated 2024-01-10.

**BREAST DENSITY**: Heterogeneously dense breast tissue, which may obscure small masses (BI-RADS Category c).

**FINDINGS**:
- **Right Breast**: No suspicious mass, architectural distortion, or calcifications.
- **Left Breast**: No suspicious mass, architectural distortion, or calcifications.
- **Lymph Nodes**: Normal appearing axillary lymph nodes bilaterally.

**IMPRESSION**:
BI-RADS Category 1: Negative.
Recommend routine annual screening mammography.'''
        },
        {
            'order_id': 'RAD00001456',
            'patient_id': 'P001045',
            'exam': 'MRI Right Knee without Contrast',
            'date': '2025-01-11',
            'radiologist': 'Dr. Kevin Johnson, MD',
            'report': '''**CLINICAL HISTORY**: Right knee pain and swelling, history of sports injury.

**TECHNIQUE**: MRI of the right knee without IV contrast.

**COMPARISON**: None.

**FINDINGS**:
- **Menisci**: Horizontal linear hyperintense signal within the posterior horn of the medial meniscus extending to the articular surface, consistent with a tear.
- **Cruciate Ligaments**: ACL and PCL intact.
- **Collateral Ligaments**: MCL and LCL intact.
- **Cartilage**: Mild cartilage thinning in the medial compartment.
- **Joint Effusion**: Moderate joint effusion.
- **Bone Marrow**: Bone marrow edema in the medial tibial plateau.

**IMPRESSION**:
1. Medial meniscus tear (posterior horn).
2. Moderate joint effusion.
3. Bone marrow edema pattern in medial tibial plateau.
4. Recommend orthopedic consultation.'''
        }
    ]
    
    return reports

def main():
    print("Generating Imaging Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate radiology orders
    print("1. Generating radiology orders...")
    orders_df = generate_radiology_orders(patients_df)
    output_file = '../Imaging/radiology_orders.csv'
    orders_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(orders_df)} radiology orders → {output_file}")
    
    # Generate radiology reports
    print("\n2. Generating radiology reports...")
    reports = generate_radiology_reports()
    output_file = '../Imaging/radiology_reports.md'
    
    with open(output_file, 'w') as f:
        f.write("# Radiology Reports\n\n")
        f.write("Sample radiology reports with clinical history, technique, findings, and impressions.\n\n")
        f.write("---\n\n")
        
        for report in reports:
            f.write(f"## Order ID: {report['order_id']}\n\n")
            f.write(f"**Patient ID**: {report['patient_id']}  \n")
            f.write(f"**Exam**: {report['exam']}  \n")
            f.write(f"**Date**: {report['date']}  \n")
            f.write(f"**Radiologist**: {report['radiologist']}\n\n")
            f.write(report['report'])
            f.write("\n\n---\n\n")
    
    print(f"   ✓ Created {len(reports)} radiology reports → {output_file}")
    
    print("\n" + "="*60)
    print("Imaging Data Generation Complete!")
    print("="*60)
    print(f"Radiology Orders: {len(orders_df)} records")
    print(f"Radiology Reports: {len(reports)} documents")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
