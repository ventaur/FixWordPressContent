const fixEncodedCharsInSlugs = require('./fixEncodedCharsInSlugs');
const fixAbsoluteUrls = require('./fixAbsoluteUrls');
const fixArchiveUrls = require('./fixArchiveUrls');
const fixYearMonthPostUrls = require('./fixYearMonthPostUrls');
const fixImageUrls = require('./fixImageUrls');
const fixRelatedBlogOtherUrls = require('./fixRelatedBlogOtherUrls');
const fixExternalImageUrls = require('./fixExternalImageUrls');
const fixMultipleShashedUrls = require('./fixMultipleSlashedUrls');

const urlFixers = [
    fixAbsoluteUrls,
    fixArchiveUrls,
    fixYearMonthPostUrls,
    fixImageUrls,
    fixRelatedBlogOtherUrls,
    fixExternalImageUrls,
    fixMultipleShashedUrls
];


function fixAll(config, data) {
    const posts = data.data.posts;
    for (const post of posts) {
        let { slug, html, mobiledoc } = post;
        slug = fixEncodedCharsInSlugs(slug);
        
        for (const fixer of urlFixers) {
            [ html, mobiledoc ] = fixer(config, html, mobiledoc);
        }

        post.slug = slug;
        post.html = html;
        post.mobiledoc = mobiledoc;
    }

    // NOTE: We're choosing to not deep clone the original data before modifying it, 
    // since it's not necessary.
    return data;
}


module.exports = fixAll;