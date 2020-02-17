import { readFileSync } from 'fs';


function readJsonFile(filePath) {
    return JSON.parse(readFileSync(filePath, 'utf8'));
}


export default readJsonFile;