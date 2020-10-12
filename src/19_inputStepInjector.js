function mainInputStepExtender() {

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        .slice(0, 1) //   0 "Alibaba",
    // .slice(1, 2) //   1 "Amazon",
    // .slice(2, 3) //   2 "América Móvil",
    // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"
    Companies.forEach(function (Company) {
        // Company.urlCurrentDataCollectionSheet = ""
        console.log(`extending ${Company.label.current}`)
        inputStepExtender(Company)
    })


}

function inputStepExtender(Company) {

    let searchForString = "Step 4.1"
    let stepcolor = "#ffe599"
    let Sheet, substepLabel

    let SS = SpreadsheetApp.openById(Company.urlCurrentDataCollectionSheet)

    let id = Company.id

    let titleWidth = Company.services.length === 1 || Company.hasOpCom ? 3 : 4
    let indicatorLabel

    let fbStatusText

    let startRow = null
    let contentRowOffset = 1

    let rowLabel

    indicatorsVector.indicatorCategories.map(Category => {
        Category.indicators.map(Indicator => {

            indicatorLabel = Indicator.labelShort
            rowLabel = `Follow-up Feedback\n\n${indicatorLabel}`
            fbStatusText = specialRangeName(id, indicatorLabel, "CoFBextra")

            Logger.log(fbStatusText)

            let formulaContent = `CONCATENATE(ARRAYFORMULA(concat(FILTER(${fbStatusText},${fbStatusText}<>""),"\n\n")))`

            Sheet = SS.getSheetByName(indicatorLabel)

            startRow = findValueRowStart(Sheet, searchForString, 0)

            injectInputRows(Sheet, startRow - 1, 2, titleWidth, contentRowOffset, rowLabel, formulaContent, stepcolor)

        })
    })
}
