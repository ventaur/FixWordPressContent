const commander = require('commander');
const program = new commander.Command();

const console = require('./lib/console');
const readJsonFile = require('./lib/readJsonFile');
const extractDomainInfo = require('./lib/extractDomainInfo');
const generateDomainReport = require('./lib/generateDomainReport');


function reportDomains(exportPath, includeDetails) {
    const data = readJsonFile(exportPath);
    const infoByDomain = extractDomainInfo(data);
    const domainReport = generateDomainReport(infoByDomain, includeDetails);
    
    console.log();
    console.log(domainReport);
}

function fix (config, data) {
    // TODO: Call each fixer.
}


program.version('0.0.1');
    
program
    .command('domains <exportPath>')
    .option('-d, --details', 'Include the details for each domain.')
    .description('Generate a report on the domains used in the export file.')
    .action(function (exportPath, cmd) {
        reportDomains(exportPath, cmd.details);
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
        */
    });

program.parse(process.argv);