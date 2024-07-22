// global defineNamedRange, indexPrefix, columnToLetter,

function getHorizontalIndicatorElements(indicators, companies, config, step, yoy = false) {

    let type = yoy ? 'YoY': 'Base'

    let spreadsheetName = spreadSheetFileName(
        config.filenamePrefix,
        step,
        'Horizontal View - ' + type,
        config.filenameSuffixProd
    )
    let ss = createSpreadsheet(spreadsheetName, true)

    let elements = []
    for (let cat of indicators.indicatorCategories) {
        for (let ind of cat.indicators) {
            for (let ele of ind.elements) {
                elements.push([ind.labelShort, ele.labelShort, ele.description])
            }
        }
    }

    let services = []
    for (let com of companies.companies) {
        let cnm = com.label.current
        let cid = com.id
        let csh = com.urlCurrentInputSheet
        services.push({
            companyName: cnm,
            companyId: cid,
            inputSheet: csh,
            id: 'group',
            name: com.groupLabel
        })
        if (com.hasOpCom) {
            services.push({
                companyName: cnm,
                companyId: cid,
                inputSheet: csh,
                id: 'opCom',
                name: com.opComLabel
            })
        }
        services = services.concat(com.services.map(s => {
            return {
                companyName: cnm,
                companyId: cid,
                inputSheet: csh,
                id: s.id,
                name: s.label.current
            }
        }))
    }

    resultsSheet = insertSheetIfNotExist(ss, 'Results', true)
    createBaseTab(resultsSheet, elements, services)
    fillResultsTab(resultsSheet, elements, services, config.indexPrefix, step, yoy)

    commentsSheet = insertSheetIfNotExist(ss, 'Comments', true)
    createBaseTab(commentsSheet, elements, services)
    fillCommentsTab(commentsSheet, elements, services, config.indexPrefix, step, yoy)
}

function getHorizontalHeaders(services) {
    return [
        services.map( s => s.companyName ),
        services.map( s => s.name )
    ]
}

function getHorizontalData(elements, services, prefix, sufix) {
    return elements.map(e => {
        return services.map(s => {
            return `=IMPORTRANGE("${s.inputSheet}", "${prefix}${e[1]}${s.companyId}${s.id}${sufix}")`
        })
    })
}

function createBaseTab(tab, elements, services) {
    tab.getRange(2, 1, 1, 3)
        .setValues([['Indicator', 'Elem', 'Element Description']])
        .setFontFamily("Roboto Condensed")
        .setFontSize(11)
        .setFontWeight("bold");
        
    tab.getRange(3, 1, elements.length, 3)
        .setValues(elements);
    tab.getRange(3, 1, elements.length, 1)
        .setFontFamily("Roboto")
        .setFontSize(10)
        .setFontWeight("bold");
    tab.getRange(3, 2, elements.length, 1)
        .setFontFamily("Roboto")
        .setFontSize(10);
    tab.getRange(3, 3, elements.length, 1)
        .setFontFamily("Roboto Condensed")
        .setFontSize(8);

    tab.getRange(1, 4, 2, services.length)
        .setValues(getHorizontalHeaders(services))
        .setFontFamily("Roboto")
        .setFontSize(11)
        .setFontWeight("bold");

    tab.setColumnWidth(1, 68);
    tab.setColumnWidth(2, 52);
    tab.setColumnWidth(3, 460);
    tab.setFrozenColumns(3);
    tab.setFrozenRows(2);
}

function fillResultsTab(tab, elements, services, indPfx, step, yoy = false) {
    let substep = yoy ? '5' : '1';
    let type = yoy ? 'YY' : 'R';
    let dataRange = tab.getRange(3, 4, elements.length, services.length);
    dataRange.setFormulas(getHorizontalData(elements, services, indPfx + 'DC' + step + substep, type))
        .setFontFamily("Roboto Condensed")
        .setFontSize(9);
    let conditionals;
    if (yoy) {
        conditionals = [
            {val: "improvement", bg: "#b6d7a8"},
            {val: "decline", bg: "#f4cccc"},
            {val: "other", bg: "#ffe599"}
        ];
    } else {
        conditionals = [
            {val: "no disclosure found", bg: "#f4cccc"},
            {val: "no", bg: "#f4cccc"},
            {val: "yes", bg: "#b6d7a8"},
            {val: "partial", bg: "#c9daf8"}
        ];
    }
    applyConditionals(tab, [dataRange], conditionals, true)
}

function fillCommentsTab(tab, elements, services, indPfx, step, yoy = false) {
    let substep = yoy ? '5' : '1';
    let dataRange = tab.getRange(3, 4, elements.length, services.length);
    dataRange.setFormulas(getHorizontalData(elements, services, indPfx + 'DC' + step + substep, 'C'))
        .setFontFamily("Roboto Condensed")
        .setFontSize(9);
    let conditionals;
    if (yoy) {
        conditionals = [
            {val: "improvement", bg: "#b6d7a8"},
            {val: "decline", bg: "#f4cccc"}
        ];
    } else {
        conditionals = [
            {val: "No disclosure found.", bg: "#f4cccc"},
            {val: "No.", bg: "#f4cccc"},
            {val: "Yes.", bg: "#b6d7a8"},
            {val: "Partial.", bg: "#c9daf8"}
        ];
    }
    applyConditionals(tab, [dataRange], conditionals, false)
}

function applyConditionals(tab, ranges, conditionals, exact = true) {
    let rules = tab.getConditionalFormatRules()
    for (let r of conditionals) {
        let condRule = SpreadsheetApp.newConditionalFormatRule()
            .setBackground(r.bg)
            .setRanges(ranges)
        if (exact) {
            condRule.whenTextEqualTo(r.val)
        } else {
            condRule.whenTextContains(r.val)
        }
        condRule.build()
        rules.push(condRule)
    }
    tab.setConditionalFormatRules(rules)
}