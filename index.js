#!/usr/bin/env node


const commander = require('commander');
const program = new commander.Command();

const readJsonFile = require('./lib/readJsonFile');
const reportDomains = require('./lib/reportDomains');


function fix (config, data) {
    // TODO: Call each fixer.
}


program.version('0.0.1');
    
program
    .command('domains <exportPath>')
    .description('Generate a report on the domains used in the export file.')
    .action(function (exportPath) {
        const data = readJsonFile(exportPath);
        reportDomains(data);
    });

program
    .command('* <configPath> <exportPath> <fixedExportPath>')
    .description('Fix any issues in the export file.')
    .action(function (configPath, exportPath, fixedExportPath) {
        console.log('Called based with:');
        console.log('  ' + configPath);
        console.log('  ' + exportPath);
        console.log('  ' + fixedExportPath)
        return;

        /*
        const config = readJsonFile(configPath);
        const data = readJsonFile(wordPressToGhostExportPath);
        
        const fixedData = fix(config, data);
        writeExport(fixedData, wordPressToGhostExportPath);
        *
    /    });

program.parse(process.argv);