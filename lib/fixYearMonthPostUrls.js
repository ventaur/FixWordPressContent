const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


const localOptions = {
    includeScheme: false,
    includeFullDomain: false,
    attributeWhitelist: [ 'href' ]
};
const pattern = String.raw`(?:/\d{4}|\.\./\d{4}?)(?:/\d{2})`;
const localRegex = buildUrlRegex(localOptions, pattern);


// Fixes year-month post URLs for this blog (and related blogs) for the new pattern.
//   /2015/11/some-slug --> /some-slug
//   ../12/other-month-slug --> /other-month-slug
//   http://www.some-old-blog.com/2015/05/other-post/ --> https://new-blog.mydomain.com/other-post/
function fixYearMonthPostUrls(config, ...htmls) {
    const relatedOptions = {
        attributeWhitelist: [ 'href' ]
    };
    let relatedRegexInfos = [];
    for (const relatedBlog of config.relatedBlogs) {
        const { canonicalScheme, canonicalDomain } = relatedBlog;
        relatedOptions.fullDomainWhitelist = relatedBlog.aliasDomains;
        relatedRegexInfos.push({
            regex: buildUrlRegex(relatedOptions, pattern),
            replacement: `$<${attributeName}>$<${quoteName}>${canonicalScheme}${canonicalDomain}$<${filePathName}>$<${quoteName}>`
        });
    }
    
    let fixedHtmls = [];
    for (const html of htmls) {
        let newHtml = html.replace(localRegex, `$<${attributeName}>$<${quoteName}>$<${filePathName}>$<${quoteName}>`);
        
        for (const { regex, replacement } of relatedRegexInfos) {
            newHtml = newHtml.replace(regex, replacement);
        }

        fixedHtmls.push(newHtml);
    }

    return fixedHtmls;
}


module.exports = fixYearMonthPostUrls;