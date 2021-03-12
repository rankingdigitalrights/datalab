// eslint-disable-next-line no-unused-vars
function convertProtectionsToWarning(SS) {
    console.log(`File: ${SS.getName()}`)

    console.log('--- starting conversion')
    const protections = SS.getProtections(SpreadsheetApp.ProtectionType.SHEET) // .RANGE if ranges

    let protection
    for (let i = 0; i < protections.length; i++) {
        protection = protections[i]
        // console.log(protection)
        // If it's protected and you can edit, remove it and add a warning.
        if (protection.canEdit()) {
            protection.remove()
            protection.getRange().protect().setWarningOnly(true)
            console.log('Warning added')
        } else {
            console.log('Not protected, no warning added')
        }
    }
    console.log('--- done converting')
}
