const regex = /(%[0-9a-f]{2})+/ig;
const replacement = ''


// Fixes slugs with encoded characters.
//   '%e2%80%99' --> ''
function fixEncodedCharsInSlugs(slug) {
    return slug.replace(regex, replacement);
}


module.exports = fixEncodedCharsInSlugs;