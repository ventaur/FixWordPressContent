const commander = require('commander');
const program = new commander.Command();

const console = require('./lib/console');
const { readJsonFile, writeJsonFile } = require('./lib/jsonFile');
const extractDomainInfo = require('./lib/extractDomainInfo');
const generateDomainReport = require('./lib/generateDomainReport');
const fixAll = require('./lib/fixAll');


function reportDomains(exportPath, includeDetails) {
    const data = readJsonFile(exportPath);
    const infoByDomain = extractDomainInfo(data);
    const domainReport = generateDomainReport(infoByDomain, includeDetails);
    
    console.log();
    console.log(domainReport);
}

function fix(configPath, exportPath, fixedExportPath) {
    const config = readJsonFile(configPath);
    const data = readJsonFile(exportPath);
    
    const fixedData = fixAll(config, data);
    writeJsonFile(fixedExportPath, fixedData, config.jsonOutputIndentSize);
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
    .action(fix);

program.parse(process.argv);