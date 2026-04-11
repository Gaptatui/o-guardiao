import * as fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');
const startMarker = 'const _old_translations = {';
const endMarker = 'enum OperationType {';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);
if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.slice(0, startIndex) + content.slice(endIndex);
    fs.writeFileSync('src/App.tsx', newContent);
    console.log('Cleaned App.tsx');
} else {
    console.log('Markers not found', startIndex, endIndex);
}
