function checkIndicatorSpecs(Indicator) {
    let IndicatorSpecs = {}

    // Indicator Level Evaluation & Scoring Specifics
    IndicatorSpecs.doExcludeCompanies = Indicator.doExcludeCompanies
        ? true
        : false
    IndicatorSpecs.excludeCompanies = IndicatorSpecs.doExcludeCompanies
        ? Indicator.excludeCompanies
        : []

    IndicatorSpecs.doExcludeServices = Indicator.doExcludeServices
        ? true
        : false
    IndicatorSpecs.excludeServices = IndicatorSpecs.doExcludeServices
        ? Indicator.excludeServices
        : []

    IndicatorSpecs.scoringScope = Indicator.scoringScope

    return IndicatorSpecs
}

function checkElementSpecs(Element) {
    let ElementSpecs = {}

    // Element Level Evaluation & Scoring Specifics
    ElementSpecs.doExcludeCompanies = Element.doExcludeCompanies ? true : false
    ElementSpecs.excludeCompanies = ElementSpecs.doExcludeCompanies
        ? Element.excludeCompanies
        : []

    ElementSpecs.doExcludeServices = Element.doExcludeServices ? true : false
    ElementSpecs.excludeServices = ElementSpecs.doExcludeServices
        ? Element.excludeServices
        : []

    return ElementSpecs
}

function makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs) {
    let indSpecs = false
    let elemSpecs = false

    if (IndicatorSpecs !== null) {
        indSpecs =
            (IndicatorSpecs.doExcludeCompanies &&
                IndicatorSpecs.excludeCompanies.includes(companyType)) ||
            (IndicatorSpecs.doExcludeServices &&
                IndicatorSpecs.excludeServices.includes(serviceType))
    }

    if (ElementSpecs !== null) {
        elemSpecs =
            (ElementSpecs.doExcludeCompanies &&
                ElementSpecs.excludeCompanies.includes(companyType)) ||
            (ElementSpecs.doExcludeServices &&
                ElementSpecs.excludeServices.includes(serviceType))
    }

    return indSpecs || elemSpecs ? true : false
}
