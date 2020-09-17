function inputStepExtender() {

    let searchForString = "Step 4.1"
    let stepcolor = "#ffe599"
    let Sheet, substepLabel

    let Company = companiesVector.companies.slice(3, 4)[0]

    let SS = SpreadsheetApp.openById("1Yh3HQ_j70FGQCMpn7Z2rFsgzjWWDa7jb9ho7S2J6u6M")

    let id = Company.id

    let titleWidth = Company.services.length === 1 || Company.hasOpCom ? 3 : 4
    let indicatorLabel = indicatorsVector.labelShort

    let fbStatusText

    let startRow = null
    let contentRowOffset = 1

    let Content = {
        rangeLabel: "Follow-up Feedback"
    }

    indicatorsVector.indicatorCategories.map(Category => {
        Category.indicators.map(Indicator => {

            fbStatusText = specialRangeName("", Indicator.labelShort, "CoFBextra")

            Logger.log(fbStatusText)

            let formulaContent = `CONCATENATE(ARRAYFORMULA(concat(${fbStatusText},";\n")))`

            if (Indicator.labelShort === "G2") {

                Sheet = SS.getSheetByName(Indicator.labelShort)

                startRow = findValueRowStart(Sheet, searchForString, 0)

                console.log(startRow)

                injectInputRows(Sheet, startRow - 1, 2, titleWidth, contentRowOffset, Content, formulaContent, stepcolor)
            }

        })
    })
}
