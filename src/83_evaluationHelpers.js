function checkIndicatorSpecs(Indicator) {

    let IndicatorSpecs = {}

    // Indicator Level Evaluation & Scoring Specifics
    IndicatorSpecs.doExcludeCompanies = Indicator.doExcludeCompanies ? true : false
    IndicatorSpecs.excludeCompanies = IndicatorSpecs.doExcludeCompanies ? Indicator.excludeCompanies : []
    IndicatorSpecs.doExcludeServices = Indicator.doExcludeServices ? true : false
    IndicatorSpecs.excludeServices = IndicatorSpecs.doExcludeServices ? Indicator.excludeServices : []

    return IndicatorSpecs
}
