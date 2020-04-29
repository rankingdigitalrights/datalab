/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection

*/



function openStep(IndicatorsObj, ResearchStepsObj, CompanyVec, StepVec, EmailVec){
     // IndicatorsObj is the JSON containing all the indicator info
    // ResearchStepsObj is the JSON containing all the indicator info
    // CompanyVec is a vector of all the companies whose research steps will be opened
    // StepVec is a vector of all the steps that will be opened to all
    // Email Vec is a vector of all the emails whose permissions will be given

    // INITIAL PSEUDOCODE


    /*
    Step 0: heal the document to make sure the named ranges are correct


    Step 1: looping through the Company Vector
    for (var i = 0; i < CompanyVec.length; i++) {
       
        Step 2: looping through Step Vector
        for (var j=0; j<StepVec.length; j++){

            Step 3: recreate the named range that applies to this step
            use an already existing function????

            Step 4: loop through email vector
            for (var k=0; k<EmailVec; k++)

                Step 5: give permissions for each of the emails listed


        }
       
       
    }

    */
}

function closeStep(IndicatorsObj, ResearchStepsObj, CompanyVec, StepVec, EmailVec){
    // IndicatorsObj is the JSON containing all the indicator info
    // ResearchStepsObj is the JSON containing all the indicator info
    // CompanyVec is a vector of all the companies whose research steps will be closed
    // StepVec is a vector of all the steps that will be closed
    // Email Vec is a vector of all the emails whose permissions will be rescided

    // INITIAL PSEUDOCODE


    /*
    Step 0: heal the document to make sure the named ranges are correct


    Step 1: looping through the Company Vector
    for (var i = 0; i < CompanyVec.length; i++) {
       
        Step 2: looping through Step Vector
        for (var j=0; j<StepVec.length; j++){

            Step 3: recreate the named range that applies to this step
            use an already existing function????

            Step 4: loop through email vector
            for (var k=0; k<EmailVec; k++)

                Step 5: revoke permissions for each of the emails listed


        }
       
       
    }

    */
    
}

function closeStepAll(IndicatorsObj, ResearchStepsObj, CompanyVec, StepVec ) {
    // IndicatorsObj is the JSON containing all the indicator info
    // ResearchStepsObj is the JSON containing all the indicator info
    // CompanyVec is a vector of all the companies whose research steps will be closed
    // StepVec is a vector of all the steps that will be closed to all


    // INITIAL PSEUDOCODE


    /*
    Step 0: heal the document to make sure the named ranges are correct


    Step 1: looping through the Company Vector
    for (var i = 0; i < CompanyVec.length; i++) {
       
        Step 2: looping through Step Vector
        for (var j=0; j<StepVec.length; j++){

            Step 3: recreate the named range that applies to this step
            use an already existing function????

            Step 4: revoke permissions to that step


        }
       
       
    }

    */




}