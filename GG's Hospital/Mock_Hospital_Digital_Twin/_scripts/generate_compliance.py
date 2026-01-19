"""
Generate compliance and consent data including audit logs
"""
import os
import sys
import random
import pandas as pd

sys.path.append(os.path.dirname(__file__))
from shared_data import random_datetime, generate_staff_id

random.seed(42)

def load_patients():
    """Load patients from CSV"""
    return pd.read_csv('../Patient_Identity/patients.csv')

def generate_consent_forms():
    """Generate sample consent form templates"""
    forms_content = """# Hospital Consent Forms

Sample consent form templates used in the hospital system.

---

## Consent for Treatment

**I hereby give my consent for medical treatment at GG's Hospital.**

I understand that:
1. I have the right to be informed of my diagnosis, proposed treatment, and prognosis.
2. I have the right to refuse treatment or request discontinuation of treatment at any time.
3. I authorize the hospital staff to perform necessary medical procedures as deemed appropriate by my healthcare providers.
4. I understand that the practice of medicine is not an exact science and that no guarantees have been made regarding the results of examinations or treatment.

Patient Signature: _______________________________  Date: ______________

Witness Signature: _______________________________  Date: ______________

---

## Consent for Release of Medical Information

**I authorize GG's Hospital to release my protected health information (PHI) as specified below:**

Release Information To:
- Name: _________________________________
- Organization: _________________________________
- Purpose: _________________________________

Information to be Released:
- [ ] Complete medical record
- [ ] Clinical notes
- [ ] Laboratory results
- [ ] Radiology reports
- [ ] Medications
- [ ] Other: _________________________________

I understand that:
1. I have the right to revoke this authorization at any time by written notice.
2. Information released may be subject to re-disclosure by the recipient.
3. This authorization expires one year from the date of signature unless otherwise specified.

Patient Signature: _______________________________  Date: ______________

---

## Consent for Research Participation

**I voluntarily agree to participate in the research study described to me.**

Study Title: _________________________________

I understand that:
1. My participation is voluntary and I may withdraw at any time.
2. My decision to participate or not will not affect my medical care.
3. All information collected will be kept confidential to the extent allowed by law.
4. There may be risks and benefits associated with participation.
5. I have had the opportunity to ask questions and they have been answered to my satisfaction.

Patient Signature: _______________________________  Date: ______________

Principal Investigator: _______________________________  Date: ______________

---

## Do Not Resuscitate (DNR) Order

**I hereby request that in the event of cardiac or respiratory arrest, no resuscitation measures be initiated.**

I understand that:
1. This order means that if my heart stops or I stop breathing, no CPR will be performed.
2. I will still receive all other medical treatments not excluded by this order.
3. I may revoke this order at any time verbally or in writing.
4. This order has been discussed with my physician.

Patient Signature: _______________________________  Date: ______________

Physician Signature: _______________________________  Date: ______________

Witness Signature: _______________________________  Date: ______________

---

## Consent for Surgical Procedure

**I hereby give consent for the surgical procedure described below:**

Procedure: _________________________________

Surgeon: _________________________________

I have been informed of:
1. The nature of the proposed procedure
2. Reasonable alternatives to the proposed procedure
3. The risks and benefits of the procedure and alternatives
4. The risks of not having the procedure

I understand that:
1. During the procedure, unexpected conditions may require additional procedures.
2. No guarantees have been made about the results of the procedure.
3. I have had the opportunity to ask questions.

Patient Signature: _______________________________  Date: ______________

Surgeon Signature: _______________________________  Date: ______________

Witness Signature: _______________________________  Date: ______________

---

## Authorization for Disclosure of Hospital Billing Information

**I authorize GG's Hospital to disclose my billing information to insurance companies and other relevant parties for payment purposes.**

I understand that:
1. Information disclosed may include diagnosis, procedures, and charges.
2. This authorization is necessary for insurance claim processing.
3. I am responsible for any amounts not covered by insurance.

Patient Signature: _______________________________  Date: ______________
"""
    
    return forms_content

def generate_audit_logs(patients_df):
    """Generate HIPAA audit logs"""
    logs = []
    
    action_types = ['Chart Access', 'Record Modification', 'Print Record', 
                    'Export Data', 'Login', 'Logout', 'Search Patient',
                    'View Labs', 'View Imaging', 'View Medications', 
                    'Order Entry', 'Prescription']
    
    user_roles = ['Physician', 'Nurse', 'Pharmacist', 'Lab Tech', 'Radiologist',
                  'Billing Specialist', 'Registration', 'IT Admin']
    
    reasons = ['Patient Care', 'Clinical Review', 'Billing', 'Quality Assurance',
               'Research', 'Administration', 'Patient Request', '']
    
    # Generate 5000 audit log entries
    for i in range(5000):
        audit_id = f"AUD{i+1:08d}"
        
        # Random staff member
        user_id = generate_staff_id()
        user_role = random.choice(user_roles)
        
        # Random patient (80% of accesses are for 20% of patients - realistic pattern)
        if random.random() < 0.8:
            patient = patients_df.sample(n=1, random_state=random.randint(0, 10000)).iloc[0]
        else:
            patient = patients_df.sample(n=1).iloc[0]
        
        action_type = random.choice(action_types)
        
        # Resource accessed
        if action_type in ['Login', 'Logout']:
            resource = 'System'
        else:
            resources = ['Patient Chart', 'Lab Results', 'Imaging', 'Medications', 
                        'Problem List', 'Vitals', 'Billing']
            resource = random.choice(resources)
        
        timestamp = random_datetime(2024, 2025)
        
        # IP address (realistic hospital IPs)
        ip_address = f"10.{random.randint(10,50)}.{random.randint(1,254)}.{random.randint(1,254)}"
        
        # Reason for access
        if action_type in ['Login', 'Logout']:
            reason = ''
        else:
            reason = random.choice(reasons)
        
        # Success (98% success rate)
        success = random.random() < 0.98
        
        log = {
            'audit_id': audit_id,
            'user_id': user_id,
            'user_role': user_role,
            'patient_id': patient['patient_id'] if action_type not in ['Login', 'Logout'] else '',
            'action_type': action_type,
            'resource_accessed': resource,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'ip_address': ip_address,
            'reason': reason,
            'success': 'Yes' if success else 'No'
        }
        logs.append(log)
    
    return pd.DataFrame(logs)

def main():
    print("Generating Compliance & Consent Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate consent forms
    print("1. Generating consent form templates...")
    forms_content = generate_consent_forms()
    output_file = '../Compliance_Consent/consent_forms.md'
    with open(output_file, 'w') as f:
        f.write(forms_content)
    print(f"   ✓ Created consent form templates → {output_file}")
    
    # Generate audit logs
    print("\n2. Generating HIPAA audit logs...")
    logs_df = generate_audit_logs(patients_df)
    output_file = '../Compliance_Consent/audit_logs.csv'
    logs_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(logs_df)} audit log entries → {output_file}")
    
    print("\n" + "="*60)
    print("Compliance & Consent Data Generation Complete!")
    print("="*60)
    print(f"Audit Logs: {len(logs_df)} records")
    print(f"Unique Users: {logs_df['user_id'].nunique()}")
    print(f"Failed Access Attempts: {len(logs_df[logs_df['success'] == 'No'])}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
