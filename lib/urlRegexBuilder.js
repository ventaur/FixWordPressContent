const DefaultOptions = {
    includeAttr: true,
    includeScheme: true,
    includeFullDomain: true,
    includeFilePath: true,

    attributeWhitelist: [ 'href', 'src' ],
    fullDomainWhitelist: null,

    regexOptions: 'ig'
};

const CaptureGroupInfo = {
    attributeName: 'attribute',
    quoteName: 'quote',
    schemeName: 'scheme',
    fullDomainName: 'fullDomain',
    filePathName: 'filePath'
};


function buildUrlRegex(buildOptions, customPathPattern = null) {
    buildOptions = Object.assign({}, DefaultOptions, buildOptions);
    const { includeAttr, includeScheme, includeFullDomain, includeFilePath } = buildOptions;
    let { attributeWhitelist, fullDomainWhitelist } = buildOptions;
    const { attributeName, quoteName, schemeName, fullDomainName, filePathName } = CaptureGroupInfo;

    if (!Array.isArray(attributeWhitelist) || attributeWhitelist.length === 0) {
        attributeWhitelist = DefaultOptions.attributeWhitelist;
    }

    if (includeFullDomain === true) {
        if (fullDomainWhitelist) {
            if (typeof fullDomainWhitelist === 'string') {
                fullDomainWhitelist = [ fullDomainWhitelist ];
            } else if (!Array.isArray(fullDomainWhitelist)) {
                throw new Error('You must provide a string or an array of full domains if you wish to include it in the URL regex.');
            } else if (fullDomainWhitelist.length === 0) {
                fullDomainWhitelist = null;
            } else {
                // We escape these to ensure '.' is treated literally.
                fullDomainWhitelist = fullDomainWhitelist.map(value => escapeRegExp(value));
            }
        }
    }

    if (customPathPattern) {
        if (!(customPathPattern instanceof RegExp) && typeof customPathPattern !== 'string') {
            throw new Error('If provided, customPathPattern must be either a RegExp or string.');
        }
    }


    let regexPatterns = [];

    if (includeAttr === true) {
        // Matches:
        // * an attribute name (e.g., href or src)
        // * '='
        // * an optional quote (e.g, ", '), that may or may not be escaped (e.g., \", \')
        regexPatterns.push(String.raw`(?<${attributeName}>(?:${attributeWhitelist.join('|')})=)(?<${quoteName}>\\*["'])?`);
    }

    if (includeScheme === true) {
        // Matches:
        // * optional 'http' or 'https' followed by ':' (e.g., 'http:', 'https:', or nothing)
        // * '//'
        regexPatterns.push(String.raw`(?<${schemeName}>(?:https?:)?//)`);
    }

    if (includeFullDomain === true) {
        if (fullDomainWhitelist && fullDomainWhitelist.length > 0) {
            // Matches any of the full domains in the whitelist.
            regexPatterns.push(String.raw`(?<${fullDomainName}>${fullDomainWhitelist.join('|')})`);
        } else {
            // Matches any standard full domain name.
            regexPatterns.push(String.raw`(?<${fullDomainName}>(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])`);
        }
    }

    if (customPathPattern) {
        regexPatterns.push(typeof customPathPattern === 'string'
            ? customPathPattern
            : customPathPattern.source
        );
    }

    if (includeFilePath === true) {
        // Matches:
        // * a group 0 or many times (
        //   * a single forward slash (/)
        //   * a single word character
        //   * 0 or many non space or quote characters
        // * )
        regexPatterns.push(String.raw`(?<${filePathName}>(?:\/|\/\w[^\s"']*)*)`);
    }

    if (includeAttr === true) {
        // Matches any previously matched optional quote as part of the attribute.
        regexPatterns.push(String.raw`\k<${quoteName}>`);
    }

    return new RegExp(regexPatterns.join(''), buildOptions.regexOptions);
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


module.exports = {
    buildUrlRegex,

    DefaultOptions,
    CaptureGroupInfo
};