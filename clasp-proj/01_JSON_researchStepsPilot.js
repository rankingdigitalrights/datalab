var researchStepsVector = {
    "researchSteps": [{
            "step": 1,
            "stepColor": "#ddd9c3",
            "substeps": [
                {
                    "label": "Step 1: Data Collection",
                    "labelShort": "S01",
                    "subStepColor": "#ddd9c3",
                    "doCollapse": false,
                    "components": [{
                            "type": "header",
                            "placeholderText": "Your Name"
                        },
                        {
                            "type": "elementResults",
                            "id": "",
                            "label": "Element ",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "partial",
                                "no",
                                "no disclosure found",
                                "N/A"
                            ]
                        },
                        {
                            "type": "elementComments",
                            "id": "MC",
                            "label": "Comments for ",
                            "label2": " (explain score)"
                        },
                        {
                            "type": "sources",
                            "id": "MS",
                            "label": "Sources (reference, specific page, section, etc.)"
                        }
                    ]
                },
                {
                    "label": "Step 1a: Notes/comments from researchers",
                    "labelShort": "S01a",
                    "subStepColor": "#ead1dc",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": " "
                        },
                        {
                            "type": "elementComments",
                            "id": "MN",
                            "label": "Notes for ",
                            "label2": " "
                        }
                    ]
                }
            ]
        },
        {
            "step": 2,
            "stepColor": "#c6d9f0",
            "substeps": [{
                    "label": "Step 2: Secondary review",
                    "labelShort": "S02",
                    "subStepColor": "#c6d9f0",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": "Your Name"
                        },
                        {
                            "type": "binaryReview",
                            "id": "MR",
                            "label": "Do you agree with the answer(s) in Step 1?",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "no"
                            ]
                        },
                        {
                            "type": "elementResults",
                            "id": "MA",
                            "label": "If 'no': suggested answer for ",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "partial",
                                "no",
                                "no disclosure found",
                                "N/A"
                            ]
                        },
                        {
                            "type": "elementComments",
                            "id": "MC",
                            "label": "Comments for ",
                            "label2": "\n(required if 'no', optional if 'yes')"
                        },
                        {
                            "type": "sources",
                            "id": "MS",
                            "label": "Sources (reference, specific page, section, etc.)"
                        }
                    ]
                },
                {
                    "label": "Step 2a: Notes/comments from researchers",
                    "labelShort": "S02a",
                    "subStepColor": "#ead1dc",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": " "
                        },
                        {
                            "type": "elementComments",
                            "id": "MN",
                            "label": "Notes for ",
                            "label2": " "
                        }
                    ]
                }
            ]
        },
        {
            "step": 3,
            "stepColor": "#dbe5f1",
            "substeps": [{
                    "label": "Step 3: Score Consensus",
                    "labelShort": "S03",
                    "subStepColor": "#dbe5f1",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": "Your Name"
                        },
                        {
                            "type": "elementResults",
                            "id": "",
                            "label": "Consolidated answer for ",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "partial",
                                "no",
                                "no disclosure found",
                                "N/A"
                            ]
                        },
                        {
                            "type": "elementComments",
                            "id": "MC",
                            "label": "Comments for ",
                            "label2": " (explain score)"
                        },
                        {
                            "type": "sources",
                            "id": "MS",
                            "label": "Sources (reference, specific page, section, etc.)"
                        }
                    ]
                },
                {
                    "label": "Step 3a: Notes/comments from researchers",
                    "labelShort": "S03a",
                    "subStepColor": "#ead1dc",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": " "
                        },
                        {
                            "type": "elementComments",
                            "id": "MN",
                            "label": "Notes for ",
                            "label2": " "
                        }
                    ]
                }
            ]
        },
        {
            "step": 4,
            "stepColor": "#d9ead3",
            "substeps": [{
                    "label": "Step 4: Company Notes",
                    "labelShort": "S04",
                    "subStepColor": "#d9ead3",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": "Your Name"
                        },
                        {
                            "type": "binaryReview",
                            "id": "MR",
                            "label": "Does company feedback merit a change??",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "no"
                            ]
                        },
                        {
                            "type": "elementResults",
                            "label": "If 'yes': suggested answer for ",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "partial",
                                "no",
                                "no disclosure found",
                                "N/A"
                            ]
                        },
                        {
                            "type": "elementComments",
                            "id": "MC",
                            "label": "Comments for ",
                            "label2": " (required if 'yes', optional if 'no')"
                        },
                        {
                            "type": "sources",
                            "id": "MS",
                            "label": "Sources (reference, specific page, section, etc.)"
                        }
                    ]
                },
                {
                    "label": "Step 4a: Notes/comments from researchers",
                    "labelShort": "S04a",
                    "subStepColor": "#ead1dc",
                    "doCollapse": true,
                    "components": [{
                            "type": "header",
                            "placeholderText": " "
                        },
                        {
                            "type": "elementComments",
                            "id": "MN",
                            "label": "Notes for ",
                            "label2": " "
                        }
                    ]
                }
            ]
        },
        {
            "step": 5,
            "stepColor": "#d9d2e9",
            "substeps": [{
                "label": "Step 5: Score consolidation and horizontal review",
                "labelShort": "S05",
                "subStepColor": "#d9d2e9",
                "doCollapse": true,
                "components": [{
                        "type": "header",
                        "placeholderText": "Your Name"
                    },
                    {
                        "type": "elementResults",
                        "id": "",
                        "label": "Consolidated answer for ",
                        "dropdown": [
                            "not selected",
                            "yes",
                            "partial",
                            "no",
                            "no disclosure found",
                            "N/A"
                        ]
                    },
                    {
                        "type": "elementComments",
                        "id": "MC",
                        "label": "Comments for ",
                        "label2": " (explain score)"
                    },
                    {
                        "type": "sources",
                        "id": "MS",
                        "label": "Sources (reference, specific page, section, etc.)"
                    }
                ]
            },
            {
                "label": "Step 5a: Notes/comments from researchers",
                "labelShort": "S05a",
                "subStepColor": "#ead1dc",
                "doCollapse": true,
                "components": [{
                        "type": "header",
                        "placeholderText": " "
                    },
                    {
                        "type": "elementComments",
                        "id": "MN",
                        "label": "Notes for ",
                        "label2": " "
                    }
                ]
            }]
        },
        {
            "step": 6,
            "stepColor": "#ddd9c3",
            "substeps": [{
                "label": "Step 6: Final Scores",
                "labelShort": "S06",
                "subStepColor": "#ddd9c3",
                "doCollapse": true,
                "components": [{
                        "type": "header",
                        "placeholderText": "Your Name"
                    },
                    {
                        "type": "elementResults",
                        "id": "",
                        "label": "Element ",
                        "dropdown": [
                            "not selected",
                            "yes",
                            "partial",
                            "no",
                            "no disclosure found",
                            "N/A"
                        ]
                    },
                    {
                        "type": "elementComments",
                        "id": "MC",
                        "label": "Comments for ",
                        "label2": " (explain score)"
                    },
                    {
                        "type": "sources",
                        "id": "MS",
                        "label": "Sources (reference, specific page, section, etc.)"
                    }
                ]
            },
            {
                "label": "Step 6a: Notes/comments from researchers",
                "labelShort": "S06a",
                "doCollapse": true,
                "subStepColor": "#ead1dc",
                "components": [{
                        "type": "header",
                        "placeholderText": " "
                    },
                    {
                        "type": "elementComments",
                        "id": "MN",
                        "label": "Notes for ",
                        "label2": " "
                    }
                ]
            }]
        }
    ] // end of main steps
}
