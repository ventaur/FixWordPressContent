const { buildUrlRegex, CaptureGroupInfo } = require('./urlRegexBuilder');
const { attributeName, quoteName } = CaptureGroupInfo;


// Fixes year-month URLs for this blog for the new pattern.
//   /2015/11/some-slug --> /some-slug
//   ../12/other-month-slug --> /other-month-slug
function fixRelativeUrls(config, ...htmls) {
    const options = {
        attributeWhitelist: [ 'href' ]
    };
    const pattern = String.raw`(?:/\d{4}|\.\./\d{4}?)(?:/\d{2})(?<filePath>/\w[^\s"']*)*`;
    const regex = buildUrlRegex(options, pattern);

    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, `$<${attributeName}>$<${quoteName}>$<filePath>$<${quoteName}>`));
    }

    return fixedHtmls;
}


module.exports = fixRelativeUrls;