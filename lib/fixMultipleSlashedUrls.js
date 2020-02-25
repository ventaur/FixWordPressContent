const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName } = CaptureGroupInfo;


const options = {
    includeScheme: false,
    includeFullDomain: false,
    includeFilePath: false,
    attributeWhitelist: [ 'href' ]
};
const pattern = String.raw`/{2,}`;
const regex = buildUrlRegex(options, pattern);
const replacement = `$<${attributeName}>$<${quoteName}>/$<${quoteName}>`


// Fixes post URLs that are only 2 or more forward slashes.
//   // --> /
//   /// --> /
function fixMultipleSlashedUrls(_config, ...htmls) {
    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, replacement));
    }

    return fixedHtmls;
}


module.exports = fixMultipleSlashedUrls;