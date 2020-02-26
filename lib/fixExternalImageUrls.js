const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, fullDomainName, filePathName } = CaptureGroupInfo;


const options = {
    includeScheme: true,
    includeFullDomain: true,
    includeFilePath: true,
    attributeWhitelist: [ 'src' ]
};
const regex = buildUrlRegex(options);
const replacement = `$<${attributeName}>$<${quoteName}>//$<${fullDomainName}>$<${filePathName}>$<${quoteName}>`


// Fixes image URLs with the scheme so they are schemaless.
//   http://some-external-site.com/other-page/ --> //some-external-site.com/other-page/
//   https://another-site.com/some-page --> //another-site.com/some-page
function fixExternalImageUrls(_config, ...htmls) {
    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, replacement));
    }

    return fixedHtmls;
}


module.exports = fixExternalImageUrls;