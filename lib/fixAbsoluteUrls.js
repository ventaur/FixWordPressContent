const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


// Fixes absolute URLs for this blog so they are root-relative.
//   https://this-blog.com/some-slug --> /some-slug
function fixAbsoluteUrls(config, ...htmls) {
    const thisBlog = config.thisBlog;
    const aliasDomains = thisBlog.aliasDomains || [];
    const domains = [ thisBlog.canonicalDomain, ...aliasDomains ];
    
    const fullUrlOptions = { fullDomainWhitelist: domains };
    const bareUrlOptions = Object.assign({}, fullUrlOptions, {
        attributeWhitelist: [ 'href' ],
        includeFilePath: false
    });
    const regexInfos = [
        {
            regex: buildUrlRegex(bareUrlOptions),
            replacement: `$<${attributeName}>$<${quoteName}>/$<${quoteName}>`
        },
        {
            regex: buildUrlRegex(fullUrlOptions),
            replacement: `$<${attributeName}>$<${quoteName}>$<${filePathName}>$<${quoteName}>`
        }
    ];

    let fixedHtmls = [];
    for (const html of htmls) {
        let newHtml = html;
        for (const { regex, replacement } of regexInfos) {
            newHtml = newHtml.replace(regex, replacement);
        }

        fixedHtmls.push(newHtml);
    }

    return fixedHtmls;
}


module.exports = fixAbsoluteUrls;