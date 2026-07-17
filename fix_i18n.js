const fs = require('fs');
let content = fs.readFileSync('src/shared/i18n/index.ts', 'utf8');

// The file has two `sidebar: {` inside `es.translation`.
// We'll find the second one and remove it.
const sidebarMatches = [...content.matchAll(/sidebar:\s*\{/g)];
if (sidebarMatches.length >= 2) {
  // We'll assume the second match is the duplicate one we want to remove.
  // It starts around line 96. We'll replace it with empty string until the matching closing brace.
  const startIndex = sidebarMatches[1].index;
  let braces = 0;
  let endIndex = startIndex;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braces++;
    if (content[i] === '}') {
      braces--;
      if (braces === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  // Remove trailing comma if any
  if (content[endIndex] === ',') endIndex++;
  content = content.slice(0, startIndex) + content.slice(endIndex);
}

// Do the same for `patientDashboard:`
const pdMatches = [...content.matchAll(/patientDashboard:\s*\{/g)];
// Wait, patientDashboard exists in `es` (twice) and `en` (once).
// So there are 3 matches. We want to remove the second one in `es`.
if (pdMatches.length >= 2) {
  const startIndex = pdMatches[1].index;
  let braces = 0;
  let endIndex = startIndex;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braces++;
    if (content[i] === '}') {
      braces--;
      if (braces === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  if (content[endIndex] === ',') endIndex++;
  content = content.slice(0, startIndex) + content.slice(endIndex);
}

fs.writeFileSync('src/shared/i18n/index.ts', content);
console.log("File fixed!");
