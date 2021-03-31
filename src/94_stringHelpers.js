/** finds position of a an array of
 * @param {String} terms in a Text @param Container
 * used for Company Feedback Indicator Front Matter
 * namely: adding rich text formatting or
 * for adding hyperlinks
 */

// term.length is known so we don't need to search
// for end position of term
function locateString(Container, terms) {
    let positions = []
    let start, end

    if (terms.length > 0 && terms !== null) {
        terms.map((term) => {
            start = Container.indexOf(term)
            end = start > 0 ? start + term.length : null
            positions.push([start, end])
        })
    }

    return positions
}

// Local Tests
// let Container = "Does the company make an explicit, clearly articulated policy commitment to human rights, including freedom of expression and privacy?"
// let terms = ["explicit", "policy commitment"]
// let results = locateString(Container, terms)
// console.log(results)
