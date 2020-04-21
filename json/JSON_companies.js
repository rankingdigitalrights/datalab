// please refer to naming conventions
// https://github.com/rankingdigitalrights/datalab/blob/pilot-fork/clasp-proj/docs/dictionary.MD

var companiesVector = {
    "collection": "companies",
    "indexYear": 2019,
    "indexType": "RDR Pilot",
    "companies": [{
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
            "urlCurrentDataCollectionSheet": "1lCU-jarAjYnoNA8ftmTiP-l2c54pDNN-mh8mVEFRxyA",
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
                }
            ]
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
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "AppleOutcome",
            "urlCurrentDataCollectionSheet": "1eRzRqGy_baoheL8uxuh2fsMNuXicXAqOzvoLDlS6-Ak",
            "urlCurrentCompanyScoringSheet": "1OmNEYyGX1FmmhpqvkWORa-_HNTnL1fO-PrhvNfuR9ak",
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
            "hasOpCom": true,
            "opComLabel": "DT Germany",
            "isPrevScored": true,
            "firstIndex": 2019,
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "DeutscheTelekomOutcome",
            "urlCurrentDataCollectionSheet": "1oyYmRm2yTuZC9m1x5duA4H-bK4DpQTB_IXug9U-D-7U",
            "urlCurrentCompanyScoringSheet": "1PPjaNgxVoKSdHgsml6C3oIRjcYftPp3E8zgWCudMYJI",
            "numberOfServices": 1,
            "services": [{
                "id": "mbDT2",
                "type": "mobile",
                "subtype": "postpaid",
                "label": {
                    "current": "DT (post paid mobile)",
                    "legacy": ["Postpaid mobile"]
                }
            }]
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
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "FacebookOutcome",
            "urlCurrentDataCollectionSheet": "1lFlbvFdEY-020fNGk5xWq76ArdV2ueczslTsrvrFzqM",
            "urlCurrentCompanyScoringSheet": "12XP5-z35N8Dnm6B8hGAjfzVWu7MVS396gwj4XBuwQ-M",
            "numberOfServices": 1,
            "services": [{
                "id": "snFB1",
                "type": "socialNetworkBlogs",
                "label": {
                    "current": "Facebook (SNS)",
                    "legacy": ["Facebook"]
                }
            }]
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
            "urlCurrentDataCollectionSheet": "1ohGXAj0-oDJdJQch-Ql6bgT8GgzfAaB01RKIHcyHSxg",
            "urlCurrentCompanyScoringSheet": "1fNtENyttP5frGgaqV0a5lQWwIsMkONChvbrEgmLeYoA",
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
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "MicrosoftOutcome",
            "urlCurrentDataCollectionSheet": "1EXgZ4PKkRwo02BNPzjN42B0ddIJJUQ1iUevJTWyafgo",
            "urlCurrentCompanyScoringSheet": "1BCU-YbsmAvdp_puHKNCid5DAttNTy90UP6y7Q0KStOA",
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
            "id": "tTF1",
            "label": {
                "current": "Telefónica",
                "altFilename": "Telefonica",
                "legacy": [null]
            },
            "type": "telecom",
            "groupLabel": "Telefónica",
            "hasOpCom": true,
            "opComLabel": "Telefónica Spain",
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "TelefonicaOutcome",
            "urlCurrentDataCollectionSheet": "1VoY1z3iwGlcjLkXL1eFHcTprLdpMNhgnk2yrD4KLp_g",
            "urlCurrentCompanyScoringSheet": "19NKVpi1NaLGhUcoGeUtbMZKsJYd_PpYyficew7lCv94",
            "numberOfServices": 1,
            "services": [{
                "id": "mbTF2",
                "type": "mobile",
                "subtype": "postpaid",
                "label": {
                    "current": "Telefónica (post paid mobile)",
                    "legacy": ["Postpaid mobile"]
                }
            }]
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
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "TwitterOutcome",
            "urlCurrentDataCollectionSheet": "128V3QkxP783D4GvqNVL0XX47O4LwwQSjntSp2gvgPO8",
            "urlCurrentCompanyScoringSheet": "1FROnxD145-hxtLlVHqXA6d5TVPq6aMTpYH5utfMDFY4",
            "numberOfServices": 1,
            "services": [{
                "id": "snTW1",
                "type": "socialNetworkBlogs",
                "label": {
                    "current": "Twitter (SNS)",
                    "legacy": ["Twitter"]
                }
            }]
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
            "hasOpCom": true,
            "opComLabel": "Vodafone UK",
            "isPrevScored": true,
            "firstIndex": 2015,
            "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
            "tabPrevYearsOutcome": "VodafoneOutcome",
            "urlCurrentDataCollectionSheet": "1ro9p1zAENpexqOhgRon8zMMceb2p5nTat4MKzEGrd5o",
            "urlCurrentCompanyScoringSheet": "1r-BgzKcINPnjoPFHI_cWdHfKzHjpIalwTN64juXe7Rg",
            "numberOfServices": 1,
            "services": [{
                "id": "mbVF2",
                "type": "mobile",
                "subtype": "postpaid",
                "label": {
                    "current": "Vodafone (post paid mobile)",
                    "legacy": ["Postpaid mobile"]
                }
            }]
        }

    ]
}