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
                            "label": "Comments for ",
                            "label2": " (explain score)",
                            "nameLabel": "Comments"
                        },
                        {
                            "type": "sources",
                            "label": "Sources (reference, specific page, section, etc.)",
                            "nameLabel": "Sources"
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
                            "label": "Notes for ",
                            "label2": " ",
                            "nameLabel": "Notes"
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
                            "label": "Do you agree with the answer(s) in Step 1?",
                            "dropdown": [
                                "not selected",
                                "yes",
                                "no"
                            ]
                        },
                        {
                            "type": "elementResults",
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
                            "label": "Comments for ",
                            "label2": " (required if 'no', optional if 'yes')",
                            "nameLabel": "Comments"
                        },
                        {
                            "type": "sources",
                            "label": "Sources (reference, specific page, section, etc.)",
                            "nameLabel": "Sources"
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
                            "label": "Notes for ",
                            "label2": " ",
                            "nameLabel": "Notes"
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
                            "label": "Comments for ",
                            "label2": " (explain score)",
                            "nameLabel": "Comments"
                        },
                        {
                            "type": "sources",
                            "label": "Sources (reference, specific page, section, etc.)",
                            "nameLabel": "Sources"
                        }
                    ]
                },
                {
                    "label": "Step 3a: Notes/comments from researchers",
                    "labelShort": "S03a",
                    "c1": 50,
                    "c2": 168,
                    "c3": 82,
                    "legacyColor": "#dbe5f1",
                    "components": [{
                            "type": "header",
                            "filler": " "
                        },
                        {
                            "type": "elementComments",
                            "label": "Notes for ",
                            "label2": " ",
                            "nameLabel": "Notes"
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
                            "label": "Comments for ",
                            "label2": " (required if 'yes', optional if 'no')",
                            "nameLabel": "Comments"
                        },
                        {
                            "type": "sources",
                            "label": "Sources (reference, specific page, section, etc.)",
                            "nameLabel": "Sources"
                        }
                    ]
                },
                {
                    "label": "Step 4a: Notes/comments from researchers",
                    "labelShort": "S04a",
                    "c1": 50,
                    "c2": 168,
                    "c3": 82,
                    "legacyColor": "#dbe5f1",
                    "components": [{
                            "type": "header",
                            "filler": " "
                        },
                        {
                            "type": "elementComments",
                            "label": "Notes for ",
                            "label2": " ",
                            "nameLabel": "Notes"
                        }
                    ]
                }
            ]
        },
        {
            "step": 5,
            "substeps": [{
                "label": "Step 5: Post-company review scores",
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
                        "label": "Comments for ",
                        "label2": " (explain score)",
                        "nameLabel": "Comments"
                    },
                    {
                        "type": "sources",
                        "label": "Sources (reference, specific page, section, etc.)",
                        "nameLabel": "Sources"
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
                        "label": "Comments for ",
                        "label2": " (explain score)",
                        "nameLabel": "Comments"
                    },
                    {
                        "type": "sources",
                        "label": "Sources (reference, specific page, section, etc.)",
                        "nameLabel": "Sources"
                    }
                ]
            }]
        }
    ] // end of main steps
}