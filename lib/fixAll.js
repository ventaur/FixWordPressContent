const fixAbsoluteUrls = require('./fixAbsoluteUrls');
const fixArchiveUrls = require('./fixArchiveUrls');
const fixYearMonthPostUrls = require('./fixYearMonthPostUrls');
const fixImageUrls = require('./fixImageUrls');
const fixRelatedBlogOtherUrls = require('./fixRelatedBlogOtherUrls');
const fixMultipleShashedUrls = require('./fixMultipleSlashedUrls');

const fixers = [
    fixAbsoluteUrls,
    fixArchiveUrls,
    fixYearMonthPostUrls,
    fixImageUrls,
    fixRelatedBlogOtherUrls,
    fixMultipleShashedUrls
];


function fixAll(config, data) {
    const posts = data.data.posts;
    for (const post of posts) {
        let { html, mobiledoc } = post;
        for (const fixer of fixers) {
            [ html, mobiledoc ] = fixer(config, html, mobiledoc);
        }

        post.html = html;
        post.mobiledoc = mobiledoc;
    }

    // NOTE: We're choosing to not deep clone the original data before modifying it, 
    // since it's not necessary.
    return data;
}


module.exports = fixAll;