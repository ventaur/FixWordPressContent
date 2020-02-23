const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


// Fixes absolute URLs for this blog so they are root-relative.
//   https://this-blog.com/some-slug --> /some-slug
function fixAbsoluteUrls(config, ...htmls) {
    const thisBlog = config.thisBlog;
    const aliasDomains = thisBlog.aliasDomains || [];
    const domains = [ thisBlog.canonicalDomain, ...aliasDomains ];
    
    const options = { fullDomainWhitelist: domains };
    const regex = buildUrlRegex(options);

    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, `$<${attributeName}>$<${quoteName}>$<${filePathName}>$<${quoteName}>`));
    }

    return fixedHtmls;
}


module.exports = fixAbsoluteUrls;