// Fixes absolute URLs for this blog so they are root-relative.
//   https://this-blog.com/some-slug --> /some-slug
function fixAbsoluteUrls(config, ...htmls) {
    const thisBlog = config.thisBlog;
    const aliasDomains = thisBlog.aliasDomains || [];
    const domains = [ thisBlog.canonicalDomain, ...aliasDomains ];
    const domainsPattern = domains.join('|');

    const regexPattern = String.raw`((?:href|src)=)(\\*["'])?https?://(?:${domainsPattern})((?:/\w[^\s"']*)*)\2`;
    const regex = new RegExp(regexPattern, 'ig');

    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, '$1$2$3$2'));
    }

    return fixedHtmls;
}


module.exports = fixAbsoluteUrls;