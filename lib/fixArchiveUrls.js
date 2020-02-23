const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName, filePathName } = CaptureGroupInfo;


const localOptions = {
    includeScheme: false,
    includeFullDomain: false,
    attributeWhitelist: [ 'href' ]
};
const pattern = String.raw`/index.php/archives`;
const localRegex = buildUrlRegex(localOptions, pattern);


// Fixes post URLs with "/index.php/archives" for this blog (and related blogs) for the new pattern.
//   /index.php/archives/some-slug --> /some-slug
//   http://www.some-old-blog.com/index.php/archives/other-post/ --> https://new-blog.mydomain.com/other-post/
function fixArchiveUrls(config, ...htmls) {
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


module.exports = fixArchiveUrls;