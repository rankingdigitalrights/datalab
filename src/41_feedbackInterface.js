function TestCF() {
    let Company=companiesVector.companies[5]
    let SS=SpreadsheetApp.openById("1TF9OmBac2rkIjFAJVCJw7h9VXHcm70sj-6aQOoI9uYY")
    let Sheet = SS.getSheetByName("G1")
    let IndicatorsObj = subsetIndicatorsObject(indicatorsVector, "G1").indicatorCategories[0].indicators[0]
    
    //Logger.log("indicator"+IndicatorsObj)
    Logger.log("company:"+Company.id)
    
    injectFeedbackBlock(Sheet, Company, IndicatorsObj)
   }
   
   
   
   function injectFeedbackBlock(Sheet, Company, Indicator) {
   
       let activeRow = Sheet.getLastRow() + 2
       let offsetCol = 2
   
       let indyLabel = Indicator.labelShort
   
       let rangeWidth = Company.numberOfServices+1
       if(Company.hasOpCom) {rangeWidth=rangeWidth+1}
   
       activeRow = appendFBHeader(Sheet, activeRow, offsetCol, rangeWidth)
   
       activeRow = appendFBCompany(Sheet, activeRow, offsetCol, rangeWidth, Company, indyLabel)
   
       // TODO
       activeRow = appendFBRows(Sheet, Company, Indicator, activeRow)
   
   }
   
   function appendFBHeader(Sheet, activeRow, offsetCol, rangeWidth) {
       let Range = Sheet.getRange(activeRow, offsetCol, 1, rangeWidth + 1)
       Range.setValue("PRELIMINARY EVALUATION")
           .merge()
           .setHorizontalAlignment("center")
           .setBackground("#5ca5d9")
           .setFontColor("white")
           .setFontSize(14)
           .setFontWeight("bold")
           .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
       return activeRow + 2
   }
   
   function appendFBCompany(Sheet, activeRow, offsetCol, rangeWidth, Company, indyLabel) {
   
       let activeCol = offsetCol
   
       let Cell, cellValue
   
       // first cell: MainStep Label
       Sheet.getRange(activeRow, activeCol)
           .setValue(indyLabel)
   
       activeCol += 1
   
       // Company (group) column(s)
       Cell = Sheet.getRange(activeRow, activeCol)
           // .setValue("Group")
           .setValue(Company.groupLabel)
           .setBackground("#fff2cc")
   
       activeCol += 1
   
       // if no OpCom : skip
   
       if (Company.hasOpCom) {
           Cell = Sheet.getRange(activeRow, activeCol)
               .setBackground("#fff2cc")
   
           // Cell.setValue("Operating Company")
           Cell.setValue(Company.opComLabel)
   
           activeCol += 1
       }
   
       // for remaining columns (services)
       for (let i = 0; i < Company.services.length; i++) {
           Sheet.getRange(activeRow, activeCol)
               .setValue(Company.services[i].label.current)
               .setBackground("#b7e1cd")
           activeCol += 1
       }
   
       Sheet.getRange(activeRow, offsetCol, 1, rangeWidth + 1)
           .setFontWeight("bold")
           .setVerticalAlignment("middle")
           .setHorizontalAlignment("center")
           .setFontSize(12)
   
       Sheet.setRowHeight(activeRow, 30)
   
       // if (Config.freezeHead) {
       //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
       // }
   
       return activeRow + 2
   }
   
   // TODO: one generic function to rowwise import Element-level results or Element-level comments by named range from Input Sheet Step 3.2
   function appendFBRows(Sheet, Company, Indicator, activeRow) {
   
       let namedStepRange=defineNamedRange(centralConfig.indexPrefix, "DC", "S032", Indicator.labelShort, "", Company.id, "", "Step")
   
       let DCurl=Company.urlCurrentDataCollectionSheet
       let CompanySS=SpreadsheetApp.openById(DCurl)
       
       Logger.log("namedRange:"+namedStepRange)
   
       let range = CompanySS.getRange(namedStepRange)
       let rangeNotation, formula
       
       if (!Company.hasOpCom) {
         Logger.log("hasOpCom")
             rangeNotation = '"'+Indicator.labelShort+'!A'+range.getRow()+":B"+range.getLastRow()+'"'  
              Logger.log("range:"+rangeNotation)
              formula='=IMPORTRANGE("'+DCurl+'",'+rangeNotation+')'
              Logger.log("formula:"+formula)
              Sheet.getRange(activeRow,2).setFormula(formula)
              
              rangeNotation = '"'+Indicator.labelShort+'!D'+range.getRow()+":"+columnToLetter(range.getLastColumn())+range.getLastRow()+'"'
              formula='=IMPORTRANGE("'+DCurl+'",'+rangeNotation+')'
   
              Logger.log("formula:"+formula)
   
              Sheet.getRange(activeRow,4).setFormula(formula)
              return activeRow+range.getHeight()
   
       }
        
          range = CompanySS.getRange(namedStepRange)
          rangeNotation = '"'+Indicator.labelShort+'!A'+range.getRow()+":"+columnToLetter(range.getLastColumn())+range.getLastRow()+'"'
      
          Logger.log("range:"+rangeNotation)
          Logger.log("activeRow:"+activeRow)
          
          formula='=IMPORTRANGE("'+DCurl+'",'+rangeNotation+')'
      
          Logger.log("formula:"+formula)
      
          Sheet.getRange(activeRow,2).setFormula(formula)
      
          
          return activeRow+range.getHeight()
   }
   
   // TODO:
   function appendFBSources() {
   
       // use isComments to toggle between rowwise import of results vs comments
       console.log("--- Results")
   }
   
   function columnToLetter(column) {
       var temp, letter = '';
       while (column > 0) {
         temp = (column - 1) % 26;
         letter = String.fromCharCode(temp + 65) + letter;
         column = (column - temp - 1) / 26;
       }
       return letter;
     }
   