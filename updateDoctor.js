import fs from 'fs';
import path from 'path';

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
};

const dataDir = path.join(process.cwd(), 'src/data');

const replacements = [
  { search: 'Dra. Ana Gómez González', replace: 'Dr. Carlos Mendoza' },
  { search: 'ana.gomez.gonzalez@mediconnect.com', replace: 'dr.carlos.mendoza@email.com' },
  { search: 'https://api.dicebear.com/7.x/personas/svg?seed=doc0&backgroundColor=b6e3f4,c0aede', replace: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza' },
];

replaceInFile(path.join(dataDir, 'doctors.ts'), replacements);
replaceInFile(path.join(dataDir, 'appointments.ts'), replacements);

console.log('Done!');
