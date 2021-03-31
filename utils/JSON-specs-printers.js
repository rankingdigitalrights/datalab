/* Indicators */
/**
 * Collection of patterns for printing JSON values
 * helpful to quickly extract i.e. all Indicator Labels
 * or Service classes and so on
 * to use, copy into json/JSON_<Object>
 * and run locally in Node (i.e. in VSCode)
 */

// let indicatorCount = indicatorsVector.indicatorCategories
//     .map(function (category) {
//         return category.indicators.length;
//     })
//     .reduce((sum, singleLength) => sum + singleLength);

// console.log(`Number of Indicators: ${indicatorCount}`);

// let elementsCounts = indicatorsVector.indicatorCategories
//   .map(category =>
//     category.indicators
//     .map(indicator =>
//       indicator.elements.length))
//   .flat()
//   .reduce((a, b) => a + b)

// console.log(`Number of Elements: ${elementsCounts}`)

// let indicatorLabels = indicatorsVector.indicatorCategories
//   .map(category =>
//     category.indicators
//     .map(indicator =>
//       //   `"${indicator.labelShort}"`)) // String Array
//       indicator.labelShort)) // Plain Vector
//   .flat()

// console.table(`${indicatorLabels}`)

// let indicatorLabels = indicatorsVector.indicatorCategories
//   .map(category =>
//     category.indicators.map(indicator =>
//       //   `"${indicator.labelShort}"`)) // String Array
//       // .map(indicator =>
//       indicator.elements.map(element =>
//         element.labelShort))) // Plain Vector
//   .flat()

// console.table(`${indicatorLabels}`)

/* Companies */

// Output helpers
// let companyValues = companiesVector.companies
//   .map(company =>
//     `"${company.urlCurrentDataStoreSheet}"`) // id; label.current
// //   .flat()

// // let companyValues = companiesVector.companies
// //   .map(company =>
// //     company.services.length) // id; label.current
// //   .flat()

// console.log(`${companyValues}`)
