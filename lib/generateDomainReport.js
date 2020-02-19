const indent = '    ';
const headerDividerChar = '=';
const detailDividerChar = '-';


function padValues(paddingLengths, ...values) {
    const paddingLengthsCount = paddingLengths.length;
    const valuesCount = values.length;
    
    let line = '';

    for (let i = 0; i < paddingLengths.length - 1; i++) {
        line += values[i].toString().padEnd(paddingLengths[i]);
    }

    const lastPaddingLength = paddingLengths[paddingLengthsCount - 1];
    if (valuesCount > paddingLengthsCount) {
        for (let j = paddingLengthsCount; j < values.length - 1; j++) {
            line += values[j].toString().padEnd(lastPaddingLength);
        }
    }

    line += values[valuesCount - 1].toString().padStart(lastPaddingLength);

    return line;
}

function generateDomainReport(infoByDomain, includeDetails = false) {
    const domainPaddingLengths = [ indent.length + 78, 5 ];
    const postPaddingLengths =   [ 7, 71, 5 ];
    const dividerLength = domainPaddingLengths.reduce((sum, val) => sum + val);
    
    let lines = [];
    lines.push(padValues(domainPaddingLengths, 'Domain', 'Total'))
    lines.push(headerDividerChar.repeat(dividerLength));

    for (const [ domain, info ] of infoByDomain) {
        lines.push(padValues(domainPaddingLengths, domain, info.totalCount));
        
        if (includeDetails) {
            for (const post of info.posts) {
                lines.push(indent + padValues(postPaddingLengths, post.id, post.slug, post.countInPost));
            }

            lines.push(detailDividerChar.repeat(dividerLength));
        }
    }
    
    return lines.join('\n');
}


module.exports = generateDomainReport;