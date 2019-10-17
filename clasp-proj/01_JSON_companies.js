// please refer to naming conventions
// https://github.com/rankingdigitalrights/datalab/blob/pilot-fork/clasp-proj/docs/dictionary.MD

var companiesVector = {
    "collection": "companies",
    "indexYear": 2019,
    "indexType": "RDR Pilot",
    "companies": [
        {
            "id": "iAZ1",
            "label": {
                "current": "Amazon",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Amazon",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": false,
            "firstIndex": null,
            "urlPreviousYearResults": null,
            "tabPrevYearsOutcome": null,
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 2,
            "services": [{
                    "id": "ecAZ1",
                    "type": "eCommerce",
                    "label": {
                        "current": "Amazon e-commerce",
                        "legacy": [null]
                    }
                },
                {
                    "id": "ebAZ1",
                    "type": "pda",
                    "label": {
                        "current": "Amazon PDA",
                        "legacy": [null]
                    }
                }]
        },
        {
            "id": "iAP1",
            "label": {
                "current": "Apple",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Apple",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/1-bab3MPzTjqt-x3ss6Ol-ihQnLw8CIa9mrn7LsiuVEU",
            "tabPrevYearsOutcome": "AppleOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [{
                    "id": "meAP1",
                    "type": "mobileEcosystem",
                    "label": {
                        "current": "iOS (mobile ecosystem)",
                        "legacy": ["iOS mobile ecosystem"]
                    }
                }]
        },
        {
            "id": "tDT1",
            "label": {
                "current": "Deutsche Telekom",
                "altFilename": "DeutscheTelekom",
                "legacy": [null]
            },
            "type": "telecom",
            "groupLabel": "DT",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2019,
            "urlPreviousYearResults": null,
            "tabPrevYearsOutcome": null,
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [
                {
                    "id": "mbDT2",
                    "type": "mobile",
                    "subtype": "postpaid",
                    "label": {
                        "current": "DT (post paid mobile)",
                        "legacy": ["Postpaid mobile"]
                    }
                }
            ]
        },
        {
            "id": "iFB1",
            "label": {
                "current": "Facebook",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Facebook",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/19wY05eGXMiOti59c7ZOmsILMDw-4gLWN4qGUtQtD7_U",
            "tabPrevYearsOutcome": "FacebookOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [{
                    "id": "snFB1",
                    "type": "socialNetworkBlogs",
                    "label": {
                        "current": "Facebook (SNS)",
                        "legacy": ["Facebook"]
                    }
                }
            ]
        },
        {
            "id": "tGO1",
            "label": {
                "current": "Google",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Google",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/1mOB5yheHPKrPAb_HTpJA27IxligiggJHM4MCv1JGh9Y",
            "tabPrevYearsOutcome": "GoogleOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 3,
            "services": [{
                    "id": "seGO1",
                    "type": "search",
                    "label": {
                        "current": "Google (search)",
                        "legacy": ["Search"]
                    }
                },
                {
                    "id": "pvGO1",
                    "type": "photoVideo",
                    "label": {
                        "current": "YouTube",
                        "legacy": [null]
                    }
                },
                {
                    "id": "meGO1",
                    "type": "mobileEcosystem",
                    "label": {
                        "current": "Android",
                        "legacy": ["Android mobile ecosystem"]
                    }
                }
            ]
        },
        {
            "id": "iMS1",
            "label": {
                "current": "Microsoft",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Microsoft",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "19wY05eGXMiOti59c7ZOmsILMDw-4gLWN4qGUtQtD7_U",
            "tabPrevYearsOutcome": "MicrosoftOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 2,
            "services": [{
                    "id": "seMS1",
                    "type": "search",
                    "label": {
                        "current": "Bing (search)",
                        "legacy": ["Bing"]
                    }
                },
                {
                    "id": "clMS1",
                    "type": "cloud",
                    "label": {
                        "current": "OneDrive",
                        "legacy": [null]
                    }
                }
            ]
        },
        {
            "id": "iTW1",
            "label": {
                "current": "Twitter",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "internet",
            "groupLabel": "Twitter",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/19wY05eGXMiOti59c7ZOmsILMDw-4gLWN4qGUtQtD7_U",
            "tabPrevYearsOutcome": "TwitterOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [{
                    "id": "snTW1",
                    "type": "socialNetworkBlogs",
                    "label": {
                        "current": "Twitter (SNS)",
                        "legacy": ["Twitter"]
                    }
                }
            ]
        },
        {
            "id": "tVF1",
            "label": {
                "current": "Vodafone",
                "altFilename": null,
                "legacy": [null]
            },
            "type": "telecom",
            "groupLabel": "Vodafone",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/19wY05eGXMiOti59c7ZOmsILMDw-4gLWN4qGUtQtD7_U",
            "tabPrevYearsOutcome": "VodafoneOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [
                {
                    "id": "mbVF2",
                    "type": "mobile",
                    "subtype": "postpaid",
                    "label": {
                        "current": "Vodafone (post paid mobile)",
                        "legacy": ["Postpaid mobile"]
                    }
                }
            ]
        },
        {
            "id": "tTF1",
            "label": {
                "current": "Telefónica",
                "altFilename": "Telefonica",
                "legacy": [null]
            },
            "type": "telecom",
            "groupLabel": "Telefónica",
            "hasOpCom": false,
            "opComLabel": null,
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "https://docs.google.com/spreadsheets/d/19wY05eGXMiOti59c7ZOmsILMDw-4gLWN4qGUtQtD7_U",
            "tabPrevYearsOutcome": "TelefónicaOutcome",
            "urlCurrentDataCollectionSheet": null,
            "urlCurrentCompanyScoringSheet": null,
            "numberOfServices": 1,
            "services": [
                {
                    "id": "mbTF2",
                    "type": "mobile",
                    "subtype": "postpaid",
                    "label": {
                        "current": "Telefónica (post paid mobile)",
                        "legacy": ["Postpaid mobile"]
                    }
                }
            ]
        }

    ]
}
