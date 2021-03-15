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

function checkElementSpecs(Element) {
    let ElementSpecs = {}

    // Element Level Evaluation & Scoring Specifics
    ElementSpecs.doExcludeCompanies = Element.doExcludeCompanies ? true : false
    ElementSpecs.excludedCompanies = ElementSpecs.doExcludeCompanies ? Element.excludedCompanies : []

    ElementSpecs.doExcludeServices = Element.doExcludeServices ? true : false
    ElementSpecs.excludedServices = ElementSpecs.doExcludeServices ? Element.excludedServices : []

    return ElementSpecs
}

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
