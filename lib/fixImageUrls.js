const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


const localOptions = {
    includeScheme: false,
    includeFullDomain: false
};
const pattern = String.raw`(?:\.\.)?/wp-content/(?:images|uploads)/(?<year>\d{4})/(?<month>\d{2})`;
const localRegex = buildUrlRegex(localOptions, pattern);


// Fixes image URLs for this blog (and related blogs) for the new pattern.
// We look for both href and src because we may have a link to open an image full-size.
//   [..]/wp-content/uploads/2015/08/image-name.jpg --> /content/images/wordpress/2015/08/image-name.jpg
//   http://www.some-old-blog.com/wp-content/uploads/2015/05/other-post-image.jpg --> https://new-blog.mydomain.com/content/images/wordpress/2015/08/other-post-image.jpg
function fixImageUrls(config, ...htmls) {
    const relatedOptions = {};
    let relatedRegexInfos = [];
    for (const relatedBlog of config.relatedBlogs) {
        const { canonicalScheme, canonicalDomain } = relatedBlog;
        relatedOptions.fullDomainWhitelist = relatedBlog.aliasDomains;
        relatedRegexInfos.push({
            regex: buildUrlRegex(relatedOptions, pattern),
            replacement: `$<${attributeName}>$<${quoteName}>${canonicalScheme}${canonicalDomain}/content/images/wordpress/$<year>/$<month>$<${filePathName}>$<${quoteName}>`
        });
    }
    
    let fixedHtmls = [];
    for (const html of htmls) {
        let newHtml = html.replace(localRegex, `$<${attributeName}>$<${quoteName}>/content/images/wordpress/$<year>/$<month>$<${filePathName}>$<${quoteName}>`);
        
        for (const { regex, replacement } of relatedRegexInfos) {
            newHtml = newHtml.replace(regex, replacement);
        }

        fixedHtmls.push(newHtml);
    }

    return fixedHtmls;
}


module.exports = fixImageUrls;