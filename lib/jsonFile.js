const fs = require('fs');


function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, data) {
    const json = JSON.stringify(data);
    fs.writeFileSync(filePath, json);
}


module.exports = {
    readJsonFile,
    writeJsonFile
};