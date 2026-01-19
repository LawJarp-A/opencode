"""
Shared utility functions and data for hospital data generation
"""
import random
from datetime import datetime, timedelta

# Healthcare Standards Data

ICD10_CODES = {
    'E11.9': 'Type 2 diabetes mellitus without complications',
    'I10': 'Essential (primary) hypertension',
    'E78.5': 'Hyperlipidemia, unspecified',
    'J44.9': 'Chronic obstructive pulmonary disease, unspecified',
    'M79.3': 'Panniculitis, unspecified',
    'F41.9': 'Anxiety disorder, unspecified',
    'F32.9': 'Major depressive disorder, single episode, unspecified',
    'K21.9': 'Gastro-esophageal reflux disease without esophagitis',
    'M81.0': 'Age-related osteoporosis without current pathological fracture',
    'I25.10': 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    'N18.3': 'Chronic kidney disease, stage 3',
    'J45.909': 'Unspecified asthma, uncomplicated',
    'E03.9': 'Hypothyroidism, unspecified',
    'I48.91': 'Unspecified atrial fibrillation',
    'I50.9': 'Heart failure, unspecified',
    'C50.919': 'Malignant neoplasm of unspecified site of unspecified female breast',
    'C61': 'Malignant neoplasm of prostate',
    'C34.90': 'Malignant neoplasm of unspecified part of unspecified bronchus or lung',
    'J18.9': 'Pneumonia, unspecified organism',
    'K80.20': 'Calculus of gallbladder without cholecystitis without obstruction',
    'M17.9': 'Osteoarthritis of knee, unspecified',
    'M15.9': 'Polyosteoarthritis, unspecified',
    'G47.33': 'Obstructive sleep apnea',
    'K58.9': 'Irritable bowel syndrome without diarrhea',
    'M54.5': 'Low back pain',
}

LOINC_CODES = {
    '2345-7': 'Glucose [Mass/volume] in Serum or Plasma',
    '2093-3': 'Cholesterol [Mass/volume] in Serum or Plasma',
    '2571-8': 'Triglyceride [Mass/volume] in Serum or Plasma',
    '2085-9': 'Cholesterol in HDL [Mass/volume] in Serum or Plasma',
    '13457-7': 'Cholesterol in LDL [Mass/volume] in Serum or Plasma calculated',
    '718-7': 'Hemoglobin [Mass/volume] in Blood',
    '6690-2': 'Leukocytes [#/volume] in Blood by Automated count',
    '777-3': 'Platelets [#/volume] in Blood by Automated count',
    '2160-0': 'Creatinine [Mass/volume] in Serum or Plasma',
    '3094-0': 'Urea nitrogen [Mass/volume] in Serum or Plasma',
    '2951-2': 'Sodium [Moles/volume] in Serum or Plasma',
    '2823-3': 'Potassium [Moles/volume] in Serum or Plasma',
    '17861-6': 'Calcium [Mass/volume] in Serum or Plasma',
    '1742-6': 'Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma',
    '1920-8': 'Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma',
    '1975-2': 'Bilirubin.total [Mass/volume] in Serum or Plasma',
    '3151-8': 'Prothrombin time (PT)',
    '6301-6': 'INR in Platelet poor plasma by Coagulation assay',
    '4548-4': 'Hemoglobin A1c/Hemoglobin.total in Blood',
    '3016-3': 'Thyrotropin [Units/volume] in Serum or Plasma',
}

CPT_CODES = {
    '99213': 'Office outpatient visit 15 minutes',
    '99214': 'Office outpatient visit 25 minutes',
    '99215': 'Office outpatient visit 40 minutes',
    '99221': 'Initial hospital care',
    '99222': 'Initial hospital care',
    '99223': 'Initial hospital care',
    '99232': 'Subsequent hospital care',
    '99233': 'Subsequent hospital care',
    '99238': 'Hospital discharge day management',
    '99281': 'Emergency department visit',
    '99282': 'Emergency department visit',
    '99283': 'Emergency department visit',
    '99284': 'Emergency department visit',
    '99285': 'Emergency department visit',
    '36415': 'Collection of venous blood by venipuncture',
    '80053': 'Comprehensive metabolic panel',
    '85025': 'Blood count; complete (CBC)',
    '80061': 'Lipid panel',
    '83036': 'Hemoglobin; glycosylated (A1C)',
    '71045': 'Radiologic examination, chest; single view',
    '71046': 'Radiologic examination, chest; 2 views',
    '70450': 'Computed tomography, head or brain',
    '70553': 'Magnetic resonance imaging, brain',
    '47562': 'Laparoscopy, surgical; cholecystectomy',
    '43239': 'Upper gastrointestinal endoscopy',
    '45378': 'Colonoscopy, diagnostic',
}

CVX_CODES = {
    '141': 'Influenza, seasonal, injectable',
    '152': 'Pneumococcal Polysaccharide, 23 valent',
    '208': 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    '212': 'COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5 mL dose',
    '115': 'Tdap',
    '121': 'Zoster vaccine, live',
    '187': 'Zoster vaccine recombinant',
    '08': 'Hepatitis B, adolescent or pediatric',
    '83': 'Hepatitis A, adult',
    '20': 'DTaP',
}

RXNORM_CODES = {
    '314076': 'Metformin 500 MG Oral Tablet',
    '314077': 'Metformin 850 MG Oral Tablet',
    '197737': 'Lisinopril 10 MG Oral Tablet',
    '197738': 'Lisinopril 20 MG Oral Tablet',
    '617318': 'Atorvastatin 20 MG Oral Tablet',
    '617312': 'Atorvastatin 40 MG Oral Tablet',
    '308136': 'Amlodipine 5 MG Oral Tablet',
    '308137': 'Amlodipine 10 MG Oral Tablet',
    '262120': 'Levothyroxine 100 MCG Oral Tablet',
    '966529': 'Gabapentin 300 MG Oral Capsule',
    '835900': 'Omeprazole 20 MG Delayed Release Oral Capsule',
    '245314': 'Albuterol 0.09 MG/ACTUAT Metered Dose Inhaler',
    '1361574': 'Fluticasone propionate 0.25 MG/ACTUAT Nasal Spray',
    '198031': 'Warfarin Sodium 5 MG Oral Tablet',
    '105585': 'Aspirin 81 MG Oral Tablet',
}

ALLERGENS = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine',
    'Morphine', 'Latex', 'Contrast dye', 'Shellfish', 'Peanuts',
    'Tree nuts', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Bee stings'
]

REACTIONS = [
    'Rash', 'Hives', 'Itching', 'Swelling', 'Anaphylaxis',
    'Difficulty breathing', 'Nausea', 'Vomiting', 'Diarrhea',
    'Dizziness', 'Lightheadedness', 'Tachycardia'
]

DEPARTMENTS = [
    'Emergency Department', 'Internal Medicine', 'Cardiology',
    'Pulmonology', 'Gastroenterology', 'Endocrinology',
    'Orthopedics', 'Neurology', 'Psychiatry', 'General Surgery',
    'Obstetrics & Gynecology', 'Pediatrics', 'Oncology',
    'Radiology', 'Laboratory', 'Pharmacy'
]

INSURANCE_PAYERS = [
    'Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna',
    'Cigna', 'Humana', 'Medicare', 'Medicaid',
    'Kaiser Permanente', 'Anthem', 'Centene'
]

def random_date(start_year=2020, end_year=2025):
    """Generate a random date between start and end years"""
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

def random_datetime(start_year=2020, end_year=2025):
    """Generate a random datetime"""
    date = random_date(start_year, end_year)
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    return date.replace(hour=hour, minute=minute)

def generate_mrn():
    """Generate a realistic Medical Record Number"""
    return f"MRN{random.randint(100000, 999999)}"

def generate_staff_id():
    """Generate a staff ID"""
    return f"STF{random.randint(1000, 9999)}"

def weighted_choice(choices, weights):
    """Make a weighted random choice"""
    return random.choices(choices, weights=weights, k=1)[0]
