var researchStepsVector = {
    "researchSteps": [{
            "step": 1,
            "substeps": [{
                    "label": "Step 1: Data Collection",
                    "labelShort": "S01",
                    "c1": 223,
                    "c2": 135,
                    "c3": 212,
                    "legacyColor": "#ddd9c3",
                    "components": [{
                            "type": "header",
                            "filler": "Your Name"
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
                    "c1": 168,
                    "c2": 168,
                    "c3": 50,
                    "legacyColor": "#ead1dc",
                    "components": [{
                            "type": "header",
                            "filler": " "
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
            "substeps": [{
                    "label": "Step 2: Secondary review",
                    "labelShort": "S02",
                    "c1": 186,
                    "c2": 136,
                    "c3": 177,
                    "legacyColor": "#c6d9f0",
                    "components": [{
                            "type": "header",
                            "filler": "Your Name"
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
                    "labelShort": "S01a",
                    "c1": 168,
                    "c2": 168,
                    "c3": 50,
                    "legacyColor": "#ead1dc",
                    "components": [{
                            "type": "header",
                            "filler": " "
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
            "substeps": [{
                    "label": "Step 3: Score Consensus",
                    "labelShort": "S03",
                    "c1": 50,
                    "c2": 147,
                    "c3": 168,
                    "legacyColor": "#dbe5f1",
                    "components": [{
                            "type": "header",
                            "filler": "Your Name"
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
                    "c1": 50,
                    "c2": 168,
                    "c3": 82,
                    "legacyColor": "#ead1dc",
                    "components": [{
                            "type": "header",
                            "filler": " "
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
            "substeps": [{
                    "label": "Step 4: Company Notes",
                    "labelShort": "S04",
                    "c1": "143",
                    "c2": "237",
                    "c3": "88",
                    "legacyColor": "#d9ead3",
                    "components": [{
                            "type": "header",
                            "filler": "Your Name"
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
                    "c1": 50,
                    "c2": 168,
                    "c3": 82,
                    "legacyColor": "#ead1dc",
                    "components": [{
                            "type": "header",
                            "filler": " "
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
            "substeps": [{
                "label": "Step 5: Score consolidation and horizontal review",
                "labelShort": "S05",
                "c1": 162,
                "c2": 168,
                "c3": 50,
                "legacyColor": "#d9d2e9",
                "components": [{
                        "type": "header",
                        "filler": "Your Name"
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
            }]
        },
        {
            "step": 6,
            "substeps": [{
                "label": "Step 6: Final Scores",
                "labelShort": "S06",
                "c1": 223,
                "c2": 135,
                "c3": 212,
                "legacyColor": "#ddd9c3",
                "components": [{
                        "type": "header",
                        "filler": "Your Name"
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
            }]
        }
    ] // end of main steps
}
