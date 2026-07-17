import fs from 'fs';
import path from 'path';

const appointmentsFile = path.join(process.cwd(), 'src/data/appointments.ts');
let content = fs.readFileSync(appointmentsFile, 'utf8');

const newAppointment = `  {
    "id": "appt-maria-mendoza-1",
    "patientId": "u-patient-1",
    "patientName": "María López",
    "patientAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=maria-lopez&backgroundColor=b6e3f4",
    "doctorId": "doc-001",
    "doctorName": "Dr. Carlos Mendoza",
    "doctorAvatar": "https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza",
    "doctorSpecialty": "Cardiología",
    "date": new Date(Date.now() + 86400000).toISOString(),
    "time": "10:30",
    "duration": 45,
    "status": "scheduled",
    "mode": "video",
    "reason": "Control cardiológico anual",
    "price": 150,
    "createdAt": new Date().toISOString()
  },
`;

// Insert the new appointment at the top of the array
content = content.replace('export const APPOINTMENTS = [\n', 'export const APPOINTMENTS = [\n' + newAppointment);

fs.writeFileSync(appointmentsFile, content, 'utf8');
console.log('Added new appointment for Maria with Dr. Mendoza');
