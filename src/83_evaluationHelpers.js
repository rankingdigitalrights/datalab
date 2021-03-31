// --- // Collection of Utilities for Input Sheet / Indicator Specs // --- //

/** Indicator-level: return booleans and arrays of
 * company / service class Strings
 * and the @param Indicator.scoringScope
 * */

function checkIndicatorSpecs(Indicator) {
    let IndicatorSpecs = {}

    // Indicator Level Evaluation & Scoring Specifics
    IndicatorSpecs.doExcludeCompanies = Indicator.doExcludeCompanies ? true : false
    IndicatorSpecs.excludedCompanies = IndicatorSpecs.doExcludeCompanies ? Indicator.excludedCompanies : []

    IndicatorSpecs.doExcludeServices = Indicator.doExcludeServices ? true : false
    IndicatorSpecs.excludedServices = IndicatorSpecs.doExcludeServices ? Indicator.excludedServices : []

    IndicatorSpecs.scoringScope = Indicator.scoringScope

    return IndicatorSpecs
}

/** Element-level: return booleans and arrays of
 * company / service class Strings
 * */

function checkElementSpecs(Element) {
    let ElementSpecs = {}

    // Element Level Evaluation & Scoring Specifics
    ElementSpecs.doExcludeCompanies = Element.doExcludeCompanies ? true : false
    ElementSpecs.excludedCompanies = ElementSpecs.doExcludeCompanies ? Element.excludedCompanies : []

    ElementSpecs.doExcludeServices = Element.doExcludeServices ? true : false
    ElementSpecs.excludedServices = ElementSpecs.doExcludeServices ? Element.excludedServices : []

    return ElementSpecs
}

/** evaluates on Element-level
 * if a cell should to be hard-coded as NA in
 * the calling submodule
 * TODO: GW - maybe include isNewService / isNewCompany here
 *       should only apply to year-on-year-comparing subcomponents tho
 *       so maybe pass @param isYonYEval as well?
 *       Alternative: leave/add isNew evaluation in subcomponents
 */

function makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs) {
    let indSpecs = false
    let elemSpecs = false

    if (IndicatorSpecs !== null) {
        indSpecs =
            (IndicatorSpecs.doExcludeCompanies && IndicatorSpecs.excludedCompanies.includes(companyType)) ||
            (IndicatorSpecs.doExcludeServices && IndicatorSpecs.excludedServices.includes(serviceType))
    }

    if (ElementSpecs !== null) {
        elemSpecs =
            (ElementSpecs.doExcludeCompanies && ElementSpecs.excludedCompanies.includes(companyType)) ||
            (ElementSpecs.doExcludeServices && ElementSpecs.excludedServices.includes(serviceType))
    }

    return indSpecs || elemSpecs ? true : false
}
