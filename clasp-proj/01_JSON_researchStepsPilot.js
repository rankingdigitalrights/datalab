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
                            "type": "elementDropDown",
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
                            "type": "comments",
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
                            "type": "comments",
                            "label": "Comments for ",
                            "label2": " ",
                            "nameLabel": "Comments"
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
                        "type": "miniElementDropDown",
                        "label": "Do you agree with the answer(s) in Step 1?",
                        "dropdown": [
                            "not selected",
                            "yes",
                            "no"
                        ]
                    },
                    {
                        "type": "elementDropDown",
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
                        "type": "comments",
                        "label": "Comments for ",
                        "label2": " (required if 'no', optional if 'yes')",
                        "nameLabel": "Comments"
                    },
                    {
                        "type": "miniheader",
                        "label": "Do you agree with the year-on-year analysis in Step 1.5?"
                    },
                    {
                        "type": "elementDropDown",
                        "label": "In Step 1.5 for ",
                        "dropdown": [
                            "not selected",
                            "yes",
                            "no"
                        ]
                    },
                    {
                        "type": "comments",
                        "label": "If no, comments on ",
                        "label2": "",
                        "nameLabel": "Comments2"
                    }
                ]
            }]
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
                            "type": "elementDropDown",
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
                            "type": "comments",
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
                            "type": "comments",
                            "label": "Comments for ",
                            "label2": " ",
                            "nameLabel": "Comments"
                        }
                    ]
                }
            ]
        }
    ]
}