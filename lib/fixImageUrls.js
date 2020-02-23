const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName } = CaptureGroupInfo;


// Fixes image URLs for this blog for the new pattern.
// We look for both href and src because we may have a link to open an image full-size.
//   [..]/wp-content/images/2015/08/image-name.jpg --> /content/images/wordpress/2015/08/image-name.jpg
function fixImageUrls(config, ...htmls) {
    const pattern = String.raw`(?:\.\.)?/wp-content/(?:images|uploads)/(?<year>\d{4})/(?<month>\d{2})(?<filePath>/\w[^\s"']*)*`;
    const regex = buildUrlRegex(null, pattern);

    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, `$<${attributeName}>$<${quoteName}>/content/images/wordpress/$<year>/$<month>$<filePath>$<${quoteName}>`));
    }

    return fixedHtmls;
}


module.exports = fixImageUrls;