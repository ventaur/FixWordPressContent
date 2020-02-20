// Fixes absolute URLs for this blog so they are root-relative.
//   https://this-blog.com/some-slug --> /some-slug
function fixAbsoluteUrls(config, ...htmls) {
    const thisBlog = config.thisBlog;
    const aliasDomains = thisBlog.aliasDomains || [];
    const domains = [ thisBlog.canonicalDomain, ...aliasDomains ];
    const domainsPattern = domains.join('|');

    const regexTemplate = `((?:href|src)=)(["'])?https?:\/\/((?:{domainsPattern}))(\/\w[^\s"']*)*\2?`;
    const regex = new RegExp(regexTemplate, 'ig');

    let fixedHtmls = [];
    for (const html of htmls) {
        fixedHtmls.push(html.replace(regex, '$1$2$4$2'));
    }
}


module.exports = fixAbsoluteUrls;