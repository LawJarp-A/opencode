export interface Patient {
    patient_id: string;
    mrn: string;
    first_name: string;
    last_name: string;
    dob: string;
    age: string;
    gender: string;
    ethnicity: string;
    language: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    insurance_plan: string;
    insurance_id: string;
    registration_date: string;
    status: string;
}

export interface EmergencyContact {
    contact_id: string;
    patient_id: string;
    name: string;
    relationship: string;
    phone: string;
    address: string;
    is_primary: string;
}
