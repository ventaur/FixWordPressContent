const countBy = require('lodash.countby');


function findDomains(text) {
    const domainAttrPattern = /(href|src)=["']?(https?:)?\/\/[\da-z]+(\.\w[-\w]*)+/ig;
    const matches = text.match(domainAttrPattern);
    if (matches == null) {
        return null;
    }

    let domains = [];
    for (const match of matches) {
        domains.push(match.substring(match.indexOf('//') + 2));
    }

    return countBy(domains);
}

function sortMapByKey(map) {
    return new Map([...map.entries()].sort());
}

// Returns a Map of information by domain.
// Each key in the Map is a unique domain.
// Each value in the Map is an object of the following shape.
//   {
//       totalCount: 123,
//       posts: [
//           {
//               id: 555,
//               slug: 'some-post-slug',
//               countInPost: 42
//           },
//       ]
//   }
function extractDomainInfo(data) {
    const posts = data.data.posts;
    const infoByDomain = new Map();

    for (const post of posts) {
        const { id, slug } = post;

        const countByDomain = findDomains(post.html);
        if (countByDomain == null) {
            continue;
        }

        for (const domain in countByDomain) {
            const countInPost = countByDomain[domain];

            let info = infoByDomain.get(domain) || {};
            info.totalCount = (info.totalCount || 0) + countInPost;

            let postsWithDomain = info.posts || [];
            postsWithDomain.push({
                id,
                slug,
                countInPost
            });

            info.posts = postsWithDomain;
            infoByDomain.set(domain, info);
        }
    }

    return sortMapByKey(infoByDomain);
}


module.exports = extractDomainInfo;