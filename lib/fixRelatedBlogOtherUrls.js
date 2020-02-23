const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


// Fixes other URLs for related blogs.
//   /2015/11/some-slug --> /some-slug
//   ../12/other-month-slug --> /other-month-slug
function fixRelatedBlogOtherUrls(config, ...htmls) {
    const relatedOptions = {};
    let relatedRegexInfos = [];
    for (const relatedBlog of config.relatedBlogs) {
        const { canonicalScheme, canonicalDomain } = relatedBlog;
        relatedOptions.fullDomainWhitelist = relatedBlog.aliasDomains;
        relatedRegexInfos.push({
            regex: buildUrlRegex(relatedOptions),
            replacement: `$<${attributeName}>$<${quoteName}>${canonicalScheme}${canonicalDomain}$<${filePathName}>$<${quoteName}>`
        });
    }
    
    let fixedHtmls = [];
    for (const html of htmls) {
        let newHtml = html;
        for (const { regex, replacement } of relatedRegexInfos) {
            newHtml = newHtml.replace(regex, replacement);
        }

        fixedHtmls.push(newHtml);
    }

    return fixedHtmls;
}


module.exports = fixRelatedBlogOtherUrls;