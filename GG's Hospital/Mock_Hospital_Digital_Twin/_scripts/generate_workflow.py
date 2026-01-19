"""
Generate workflow and administrative data (ADT events, staff schedules, task lists)
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

def generate_adt_events(patients_df):
    """Generate ADT (Admit, Discharge, Transfer) events"""
    events = []
    
    event_types = ['Admit', 'Discharge', 'Transfer']
    units = ['ICU', 'Medical/Surgical', 'Pediatrics', 'Maternity', 'Telemetry',
             'Oncology', 'Emergency Department', 'Step-Down Unit']
    
    reasons_admit = ['Chest pain', 'Shortness of breath', 'Abdominal pain', 'Trauma',
                     'Surgery', 'Sepsis', 'Pneumonia', 'Stroke']
    reasons_discharge = ['Improved', 'Stable for home', 'Transfer to rehab', 
                         'Transfer to SNF', 'AMA', 'Deceased']
    reasons_transfer = ['Downgrade from ICU', 'Upgrade to ICU', 'Bed availability',
                       'Specialty care needed']
    
    # Generate ADT events for 30% of patients (those with inpatient stays)
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.3), random_state=42).iterrows():
        num_stays = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
        
        for stay in range(num_stays):
            # Admit event
            event_id = f"ADT{len(events)+1:08d}"
            admit_datetime = random_datetime(2023, 2025)
            unit = random.choice(units)
            room = f"{random.randint(100, 599)}{random.choice(['A', 'B', ''])}"
            
            admit_event = {
                'event_id': event_id,
                'patient_id': patient['patient_id'],
                'event_type': 'Admit',
                'event_datetime': admit_datetime.strftime('%Y-%m-%d %H:%M'),
                'from_unit': 'Emergency Department',
                'from_room': '',
                'to_unit': unit,
                'to_room': room,
                'provider_id': generate_staff_id(),
                'reason': random.choice(reasons_admit)
            }
            events.append(admit_event)
            
            # Possible transfer events (30% chance)
            current_unit = unit
            current_room = room
            current_datetime = admit_datetime
            
            if random.random() < 0.3:
                event_id = f"ADT{len(events)+1:08d}"
                transfer_datetime = current_datetime + timedelta(days=random.randint(1, 5))
                new_unit = random.choice([u for u in units if u != current_unit])
                new_room = f"{random.randint(100, 599)}{random.choice(['A', 'B', ''])}"
                
                transfer_event = {
                    'event_id': event_id,
                    'patient_id': patient['patient_id'],
                    'event_type': 'Transfer',
                    'event_datetime': transfer_datetime.strftime('%Y-%m-%d %H:%M'),
                    'from_unit': current_unit,
                    'from_room': current_room,
                    'to_unit': new_unit,
                    'to_room': new_room,
                    'provider_id': generate_staff_id(),
                    'reason': random.choice(reasons_transfer)
                }
                events.append(transfer_event)
                current_unit = new_unit
                current_room = new_room
                current_datetime = transfer_datetime
            
            # Discharge event
            event_id = f"ADT{len(events)+1:08d}"
            discharge_datetime = current_datetime + timedelta(days=random.randint(1, 14))
            
            discharge_event = {
                'event_id': event_id,
                'patient_id': patient['patient_id'],
                'event_type': 'Discharge',
                'event_datetime': discharge_datetime.strftime('%Y-%m-%d %H:%M'),
                'from_unit': current_unit,
                'from_room': current_room,
                'to_unit': 'Home' if random.random() < 0.7 else random.choice(['SNF', 'Rehab', 'LTAC']),
                'to_room': '',
                'provider_id': generate_staff_id(),
                'reason': random.choice(reasons_discharge)
            }
            events.append(discharge_event)
    
    return pd.DataFrame(events)

def generate_staff_schedule():
    """Generate staff scheduling data"""
    schedules = []
    
    roles = ['RN', 'LPN', 'CNA', 'Physician', 'Resident', 'PA', 'NP', 
             'Pharmacist', 'Respiratory Therapist', 'Physical Therapist']
    
    shifts = [
        ('Day', '07:00', '19:00'),
        ('Night', '19:00', '07:00'),
        ('Morning', '07:00', '15:00'),
        ('Evening', '15:00', '23:00'),
        ('Overnight', '23:00', '07:00')
    ]
    
    units = ['ICU', 'Medical/Surgical', 'Pediatrics', 'Emergency Department',
             'Telemetry', 'Oncology', 'Step-Down Unit']
    
    # Generate 2 weeks of schedules
    start_date = datetime.now() - timedelta(days=7)
    
    for day in range(14):
        current_date = start_date + timedelta(days=day)
        
        # Generate multiple shifts per day
        for unit in units:
            # Different number of staff per shift based on unit
            staff_count = random.randint(10, 25)
            
            for i in range(staff_count):
                schedule_id = f"SCH{len(schedules)+1:08d}"
                staff_id = generate_staff_id()
                role = random.choice(roles)
                shift_name, shift_start, shift_end = random.choice(shifts)
                
                # Assign room/area within unit
                assigned_area = f"{unit} - Zone {random.choice(['A', 'B', 'C'])}"
                
                schedule = {
                    'schedule_id': schedule_id,
                    'staff_id': staff_id,
                    'staff_name': f"{random.choice(['Dr.', 'Nurse', ''])} {['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][random.randint(0, 4)]}",
                    'role': role,
                    'shift_date': current_date.strftime('%Y-%m-%d'),
                    'shift_start': shift_start,
                    'shift_end': shift_end,
                    'assigned_unit': unit,
                    'assigned_area': assigned_area
                }
                schedules.append(schedule)
    
    return pd.DataFrame(schedules)

def generate_task_list(patients_df):
    """Generate nursing and clinical task lists"""
    tasks = []
    
    task_types = [
        'Medication Administration', 'Vital Signs', 'Blood Draw', 'Dressing Change',
        'Patient Education', 'Discharge Planning', 'IV Start', 'Catheter Care',
        'Wound Care', 'Patient Transport', 'Consultation', 'Lab Order',
        'Imaging Order', 'Patient Assessment'
    ]
    
    priorities = ['High', 'Medium', 'Low']
    statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled']
    
    # Generate tasks for 50% of patients
    for idx, patient in patients_df.sample(n=int(len(patients_df) * 0.5), random_state=42).iterrows():
        num_tasks = random.randint(1, 8)
        
        for i in range(num_tasks):
            task_id = f"TSK{len(tasks)+1:08d}"
            
            task_type = random.choice(task_types)
            
            # Task description
            descriptions = {
                'Medication Administration': f'Administer {random.choice(["Metformin", "Lisinopril", "Aspirin", "Insulin"])}',
                'Vital Signs': 'Check and document vital signs',
                'Blood Draw': f'{random.choice(["Morning", "Fasting"])} labs',
                'Dressing Change': 'Change surgical dressing',
                'Patient Education': f'Educate on {random.choice(["diabetes management", "medication compliance", "diet"])}',
                'Discharge Planning': 'Coordinate discharge with case management',
                'IV Start': 'Start peripheral IV',
                'Catheter Care': 'Foley catheter care',
                'Wound Care': 'Wound assessment and care',
                'Patient Transport': f'Transport to {random.choice(["Radiology", "CT", "MRI", "OR"])}',
                'Consultation': f'{random.choice(["Cardiology", "Nephrology", "Surgery"])} consult',
                'Lab Order': 'Place lab orders per protocol',
                'Imaging Order': 'Order chest X-ray',
                'Patient Assessment': 'Complete nursing assessment'
            }
            
            description = descriptions.get(task_type, task_type)
            
            due_datetime = random_datetime(2024, 2025)
            priority = random.choices(priorities, weights=[20, 50, 30])[0]
            status = random.choices(statuses, weights=[30, 20, 45, 5])[0]
            
            completed_datetime = ''
            if status == 'Completed':
                completed_datetime = (due_datetime + timedelta(minutes=random.randint(-30, 60))).strftime('%Y-%m-%d %H:%M')
            
            task = {
                'task_id': task_id,
                'patient_id': patient['patient_id'],
                'task_type': task_type,
                'description': description,
                'due_datetime': due_datetime.strftime('%Y-%m-%d %H:%M'),
                'assigned_to': generate_staff_id(),
                'created_by': generate_staff_id(),
                'priority': priority,
                'status': status,
                'completed_datetime': completed_datetime
            }
            tasks.append(task)
    
    return pd.DataFrame(tasks)

def main():
    print("Generating Workflow & Admin Data...")
    
    # Load patients
    patients_df = load_patients()
    print(f"Loaded {len(patients_df)} patients\n")
    
    # Generate ADT events
    print("1. Generating ADT events...")
    adt_df = generate_adt_events(patients_df)
    output_file = '../Workflow_Admin/adt_events.csv'
    adt_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(adt_df)} ADT events → {output_file}")
    
    # Generate staff schedules
    print("\n2. Generating staff schedules...")
    schedule_df = generate_staff_schedule()
    output_file = '../Workflow_Admin/staff_schedule.csv'
    schedule_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(schedule_df)} schedule entries → {output_file}")
    
    # Generate task lists
    print("\n3. Generating task lists...")
    tasks_df = generate_task_list(patients_df)
    output_file = '../Workflow_Admin/task_list.csv'
    tasks_df.to_csv(output_file, index=False)
    print(f"   ✓ Created {len(tasks_df)} tasks → {output_file}")
    
    print("\n" + "="*60)
    print("Workflow & Admin Data Generation Complete!")
    print("="*60)
    print(f"ADT Events: {len(adt_df)} records")
    print(f"Staff Schedules: {len(schedule_df)} records")
    print(f"Tasks: {len(tasks_df)} records")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
