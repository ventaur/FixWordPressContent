const program = require('commander');

const readConfig = require('./lib/readConfig');
const { readExport, writeExport } = require('./lib/exportFile');


function fixItAll (config, data) {
    // TODO: Call each fixer.
}


program
    .version('0.0.1')
    .arguments('<configPath> <wordPressToGhostExportPath>')
    .action(function (configPath, wordPressToGhostExportPath) {
        const config = readConfig(configPath);
        const data = readExport(wordPressToGhostExportPath);
        
        const fixedData = fixItAll(config, data);
        writeExport(fixedData, wordPressToGhostExportPath);
    })
    .parse(process.argv);