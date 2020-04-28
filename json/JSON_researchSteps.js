var researchStepsVector = {
  researchSteps: [{
      step: 0,
      stepColor: "#faca0f",
      substeps: [{
        rowLabel: "2019 S7 Outcome",
        labelShort: "Step 0 - 2019 S7 Outcome",
        subStepID: "S00",
        subStepColor: "#faca0f",
        doCollapse: false,
        components: [{
            type: "header",
            id: "MI",
            rowLabel: "Dummy",
            value: "Dummy",
            placeholderText: "2019 Outcome"
          }, {
            "type": "importPreviousResults",
            "rowLabel": "Element ",
            stepYonY: "S07",
            idYonY: "YY",
            id: "MR",
            "comparisonLabelShort": "S07"
          },
          {
            "type": "importPreviousComments",
            "rowLabel": "Comment ",
            stepYonY: "S07",
            idYonY: "YY",
            id: "MC",
            "comparisonLabelShort": "S07"
          }, {
            "type": "importPreviousSources",
            "rowLabel": "Sources (2019)",
            stepYonY: "S07",
            idYonY: "YY",
            id: "MS",
            "comparisonLabelShort": "S07"
          }, {
            type: "binaryReview",
            stepYonY: "S07",
            idYonY: "YY",
            id: "MY",
            rowLabel: "Are the results the same as the previous year?",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          }

        ]
      }]
    },
    {
      step: 1,
      stepColor: "#ddd9c3",
      substeps: [{
        rowLabel: "Step 1: Data Collection",
        labelShort: "Step 1",
        subStepID: "S01",
        subStepColor: "#ddd9c3",
        doCollapse: false,
        components: [{
            type: "header",
            id: "MI",
            rowLabel: "Researcher",
            variableName: "researcher",
            placeholderText: "Your Name"
          },
          {
            type: "review",
            id: "",
            scoringId: "SE",
            rowLabel: "Element ",
            variableName: "result",
            stepYonY: "S07",
            idYonY: "YY",
            idYonYType: "MR",
            dropdown: [
              "not selected",
              "yes",
              "partial",
              "no",
              "no disclosure found",
              "N/A"
            ]
          },
          {
            type: "comments",
            id: "MC",
            rowLabel: "Comment ",
            label2: " (explain score)",
            variableName: "comment",
            clipWrap: true
          },
          {
            type: "sources",
            id: "MS",
            rowLabel: "Sources (reference, specific page, section, etc.)",
            variableName: "sources"
          }
        ]
      }]
    },
    {
      step: 2,
      stepColor: "#c6d9f0",
      substeps: [{
          rowLabel: "Step 2: Secondary review",
          labelShort: "Step 2",
          subStepID: "S02",
          subStepColor: "#c6d9f0",
          doCollapse: false,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "binaryEvaluation",
              id: "MY",
              rowLabel: "Do you agree with the answer(s) in Step 1?",
              dropdown: [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              type: "evaluation",
              id: "MA",
              scoringId: "SE",
              rowLabel: "If 'no': suggested answer ",
              variableName: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A"
              ]
            },
            {
              type: "comments",
              id: "MC",
              rowLabel: "Comment ",
              label2: "\n(required if 'no', optional if 'yes')",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources"
            }
          ]
        },
        {
          rowLabel: "Step 2.5: Year-on-Year Review",
          labelShort: "Step 2.5",
          subStepID: "S025",
          subStepColor: "#c6d9f0",
          doCollapse: false,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Dummy",
              value: "Dummy",
              placeholderText: "Step 2.5"
            }, {
              "type": "binaryEvaluation",
              "rowLabel": "Do you agree with the year-on-year analysis in Step 1.5?",
              "dropdown": [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              "type": "evaluation",
              "rowLabel": "In Step 1.5 for ",
              "dropdown": [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              "type": "comments",
              "rowLabel": "If no, comments on ",
              "nameLabel": "Comments2"
            }
          ]
        }
      ]
    },
    {
      step: 3,
      stepColor: "#d9ead3",
      substeps: [{
          rowLabel: "TBD: Step 3: Score Consensus",
          labelShort: "Step 3",
          subStepID: "S03",
          subStepColor: "#d9ead3",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "evaluation",
              id: "",
              scoringId: "SE",
              rowLabel: "Consolidated answer ",
              variableName: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A"
              ]
            },
            {
              type: "comments",
              id: "MC",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources"
            }
          ]
        },
        {
          "rowLabel": "Step 3.5: Year-on-year analysis",
          "labelShort": "S03.5",
          subStepID: "S035",
          "c1": 50,
          "c2": 168,
          "c3": 82,
          "subStepColor": "#dbe5f1",
          "components": [{
              "type": "header",
              "placeholderText": " "
            },
            {
              "type": "extraQuestion",
              "rowLabel": "Is your answer the same as the previous year?"
            },
            {
              "type": "comparisonYY",
              "rowLabel": "Element ",
              "comparisonLabelShort": "S03"
            },
            {
              "type": "extraQuestion",
              "rowLabel": "If no, please select the reason why and provide comments for that element."
            },
            {
              "type": "evaluation",
              "rowLabel": "Select reason if 'no' for ",
              "dropdown": [
                "not selected",
                "I do not agree with last year's score",
                "the policy appears revised or changed"
              ]
            },
            {
              "type": "comments",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            }
          ]
        }
      ]
    },
    {
      step: 4,
      stepColor: "#d9d2e9",
      substeps: [{
          rowLabel: "Step 4: Company Notes",
          labelShort: "Step 4",
          subStepID: "S04",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "binaryEvaluation",
              id: "MY",
              rowLabel: "Does company feedback merit a change??",
              dropdown: [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              type: "evaluation",
              rowLabel: "If 'yes': suggested answer for ",
              variableName: "result",
              scoringId: "SE",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted"
              ]
            },
            {
              type: "comments",
              id: "MC",
              rowLabel: "Comment ",
              label2: " (required if 'yes', optional if 'no')",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources"
            }
          ]
        },
        {
          rowLabel: "Step 4a: Notes/comments from researchers",
          labelShort: "Step 4a",
          subStepID: "S045",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [{
              type: "header",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S04",
              placeholderText: ""
            },
            {
              type: "comments",
              id: "MN",
              rowLabel: "Notes ",
              label2: "",
              variableName: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    },
    {
      step: 5,
      stepColor: "#fff2cc",
      substeps: [{
          rowLabel: "Step 5: Score consolidation and horizontal review",
          labelShort: "Step 5",
          subStepID: "S05",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "evaluation",
              id: "",
              scoringId: "SE",
              rowLabel: "Consolidated answer ",
              variableName: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted"
              ]
            },
            {
              type: "comments",
              id: "MC",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources"
            }
          ]
        },
        {
          rowLabel: "Step 5a: Notes/comments from researchers",
          labelShort: "Step 5a",
          subStepID: "S05a",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [{
              type: "header",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S05",
              placeholderText: ""
            },
            {
              type: "comments",
              id: "MN",
              rowLabel: "Notes ",
              label2: "",
              variableName: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    },
    {
      step: 6,
      stepColor: "#ead1dc",
      substeps: [{
          rowLabel: "Step 6: Final Scores",
          labelShort: "Step 6",
          subStepID: "S06",
          subStepColor: "#ead1dc",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              rowLabel: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "evaluation",
              id: "",
              scoringId: "SE",
              rowLabel: "Element ",
              variableName: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted"
              ]
            },
            {
              type: "comments",
              id: "MC",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources"
            }
          ]
        },
        {
          rowLabel: "Step 6a: Notes/comments from researchers",
          labelShort: "Step 6a",
          subStepID: "S06a",
          doCollapse: true,
          subStepColor: "#ead1dc",
          components: [{
              type: "header",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S06",
              placeholderText: ""
            },
            {
              type: "comments",
              id: "MN",
              rowLabel: "Notes ",
              label2: "",
              variableName: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    }
  ]
}
