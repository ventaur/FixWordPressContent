const fs = require('fs');


const JsonIndentSize = 4;
const UnicodeRegex = /[\u00a0-\uffff]/gu;


function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, data) {
    const json = JSON
        .stringify(data, jsonReplacer, JsonIndentSize)
        .replace(/\\{2}u\{([0-9a-f]{4})\}/g, '\\u$1');
    fs.writeFileSync(filePath, json);
}



function charToUnicodeEscapeSequence(char) {
    const hexCode = char.charCodeAt().toString(16);
    return '\\u' + hexCode.padStart(4, '0');
}

function charToUnicodeToken(char) {
    const hexCode = char.charCodeAt().toString(16);
    return `\\u{${hexCode.padStart(4, '0')}}`;
}

// This ensures Unicode characters are escaped for JSON output.
function jsonReplacer(key, value) {
    if (key === 'mobiledoc') {
        return value.replace(UnicodeRegex, charToUnicodeEscapeSequence);
    }
    if (key === 'html') {
        return value.replace(UnicodeRegex, charToUnicodeToken);
    }

    return value;
}



module.exports = {
    readJsonFile,
    writeJsonFile
};