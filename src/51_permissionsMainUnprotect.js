function protectSingleCompany(Indicators, SheetEditors, SS, companyID, currentPrefix) {
    removeAllProtections(SS)
    protectSheets(Indicators, SheetEditors, SS, companyID, currentPrefix)
}
