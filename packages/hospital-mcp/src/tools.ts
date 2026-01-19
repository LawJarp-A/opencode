import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Patient, EmergencyContact } from './types.js';

// Base path to the digital twin data
const BASE_PATH = "/Users/gg/Documents/ShopOS/GG's Hospital/Mock_Hospital_Digital_Twin/Patient_Identity";
const PATIENTS_FILE = path.join(BASE_PATH, 'patients.csv');
const CONTACTS_FILE = path.join(BASE_PATH, 'emergency_contacts.csv');

/**
 * Helper to read and parse a CSV file
 */
async function readCsv<T>(filePath: string): Promise<T[]> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    } catch (error) {
        console.error(`Error reading CSV file at ${filePath}:`, error);
        throw new Error(`Failed to read data source: ${filePath}`);
    }
}

/**
 * List patients with pagination
 */
export async function listPatients(limit: number = 20, offset: number = 0) {
    const patients = await readCsv<Patient>(PATIENTS_FILE);
    const sliced = patients.slice(offset, offset + limit);

    return {
        total: patients.length,
        count: sliced.length,
        offset,
        limit,
        patients: sliced.map(p => ({
            patient_id: p.patient_id,
            name: `${p.first_name} ${p.last_name}`,
            dob: p.dob,
            status: p.status
        }))
    };
}

/**
 * Get full patient record by ID
 */
export async function readPatientRecord(patientId: string) {
    const patients = await readCsv<Patient>(PATIENTS_FILE);
    const patient = patients.find(p => p.patient_id === patientId);

    if (!patient) {
        throw new Error(`Patient not found with ID: ${patientId}`);
    }

    return patient;
}

/**
 * Get emergency contacts for a patient
 */
export async function getEmergencyContacts(patientId: string) {
    const contacts = await readCsv<EmergencyContact>(CONTACTS_FILE);
    return contacts.filter(c => c.patient_id === patientId);
}
