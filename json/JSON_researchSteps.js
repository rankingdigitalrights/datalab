var researchStepsVector = {
  researchSteps: [{
      step: 0,
      rowLabel: "2019 Final Outcome",
      stepColor: "#faca0f",
      substeps: [{
        labelShort: "Step 0 - 2019 S7 Outcome",
        subStepID: "S00",
        subStepColor: "#faca0f",
        doCollapse: false,
        components: [{
            "type": "importPreviousResults",
            "rowLabel": "Result ",
            prevStep: "S07",
            comparisonType: "DC",
            id: "R",
          },
          {
            "type": "importPreviousComments",
            "rowLabel": "Comment ",
            prevStep: "S07",
            comparisonType: "DC",
            id: "C",
          }, {
            "type": "importPreviousSources",
            "rowLabel": "Sources (2019)",
            prevStep: "S07",
            comparisonType: "DC",
            id: "S",
          }
        ]
      }]
    },
    {
      step: 1,
      rowLabel: "Data Collection and Evaluation",
      stepColor: "#ddd9c3",
      substeps: [{
          labelShort: "Step 1.0",
          subStepID: "S010",
          subStepColor: "#ddd9c3",
          doCollapse: false,
          components: [{
              type: "stepResearcherRow",
              id: "N",
              rowLabel: "Researcher",
              variableName: "researcher",
              placeholderText: "Your Name"
            },
            {
              type: "subStepHeader",
              rowLabel: "Are the Results the same this Year?",
            },
            {
              type: "evaluation",
              id: "R",
              scoringId: "SE",
              rowLabel: "Answer ",
              variableName: "result",
              prevStep: "S07",
              evaluationStep: "S00",
              comparisonType: "DC",
              dropdown: [
                "not selected",
                "yes",
                "no"
              ]
            }

          ]
        },
        {
          labelShort: "Step 1.1",
          subStepID: "S011",
          subStepColor: "#ddd9c3",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Your Result for this Year's Index:",
            },
            {
              type: "reviewResults",
              id: "R",
              scoringId: "SE",
              rowLabel: "Result ",
              variableName: "result",
              prevIndexPrefix: "RDR19",
              prevStep: "S07",
              evaluationStep: "S010",
              comparisonType: "R",
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
              type: "reviewComments",
              id: "C",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              prevIndexPrefix: "RDR19",
              prevStep: "S07",
              evaluationStep: "S010",
              comparisonType: "R",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources",
              prevStep: "S07",
              evaluationStep: "S010",
              comparisonType: "R",
            }
          ]
        },
        {
          labelShort: "Step 1.5",
          subStepID: "S015",
          subStepColor: "#ddd9c3",
          "components": [{
              type: "subStepHeader",
              rowLabel: "If this Year's Results are different, select Reason for Change ",
            },
            // regular YonY:
            /* {
              "type": "comparisonYY",
              id: "YY",
              "rowLabel": "Answer ",
              prevStep: "S011",
              evaluationIndex: "RDR19",
              evaluationStep: "S07",
              comparisonType: "R"
            }, */
            {
              type: "YonYreview", // "evaluation"
              mode: "YonY",
              id: "YY",
              scoringId: "SE",
              rowLabel: "Reason ",
              variableName: "result",
              prevStep: "S011",
              evaluationStep: "S010", // Regular YonY: S015
              comparisonType: "R", // Regular YonY: YY
              dropdown: [
                "not selected",
                "no change",
                "improvement",
                "decline",
                "other"
              ]
            },
            {
              "type": "comments",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            }, {
              type: "sources",
              id: "S",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources",
              prevStep: "S07",
              evaluationStep: "S07",
              comparisonType: "DC",
            }
          ]
        }
      ]
    },
    {
      step: 2,
      rowLabel: "Fact Check/Review of Step 1",
      stepColor: "#c6d9f0",
      substeps: [{
        labelShort: "Step 2.0",
        subStepID: "S020",
        subStepColor: "#c6d9f0",
        doCollapse: false,
        components: [{
            type: "stepResearcherRow",
            id: "N",
            rowLabel: "Researcher",
            variableName: "researcher",
            placeholderText: "Your Name"
          },
          {
            type: "subStepHeader",
            rowLabel: "Do you agree with the Step 1 Evaluation?",
          },
          {
            type: "evaluation",
            id: "R",
            scoringId: "SE",
            rowLabel: "Answer ",
            variableName: "result",
            comparisonType: "DC",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          }
        ]
      }, {
        labelShort: "Step 2.1",
        subStepID: "S021",
        subStepColor: "#c6d9f0",
        doCollapse: false,
        components: [{
            type: "subStepHeader",
            rowLabel: "If you disagree, add suggested Result and Comment",
          },
          {
            type: "reviewResults",
            id: "R",
            scoringId: "SE",
            rowLabel: "Result ",
            variableName: "result",
            prevStep: "S011",
            evaluationStep: "S020",
            comparisonType: "R",
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
            type: "reviewComments",
            id: "C",
            rowLabel: "Comment ",
            label2: " (explain score)",
            variableName: "comment",
            prevStep: "S011",
            evaluationStep: "S020",
            comparisonType: "R",
            clipWrap: true
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources (reference, specific page, section, etc.)",
            variableName: "sources",
            prevStep: "S011",
            evaluationStep: "S020",
            comparisonType: "S",
          }
        ]
      }, {
        labelShort: "Step 2.5",
        subStepID: "S025",
        subStepColor: "#c6d9f0",
        "components": [{
            type: "subStepHeader",
            rowLabel: "Do you agree with the Year-on-Year Analysis in Step 1.5?",
          },
          //   {
          //     "type": "comparisonYY",
          //     id: "YY",
          //     "rowLabel": "Answer ",
          //     prevStep: "S021",
          //     evaluationIndex: "RDR19",
          //     evaluationStep: "S07",
          //     comparisonType: "R"
          //   },
          {
            type: "evaluation",
            id: "YY",
            mode: "YonY",
            scoringId: "SE",
            rowLabel: "Answer ",
            variableName: "result",
            comparisonType: "DC",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          },
          //   {
          //     type: "YonYreview", // "evaluation"
          //     mode: "YonY",
          //     id: "R",
          //     scoringId: "SE",
          //     rowLabel: "Reason ",
          //     variableName: "result",
          //     prevStep: "S021",
          //     evaluationStep: "S025",
          //     comparisonType: "YY",
          //     dropdown: [
          //       "not selected",
          //       "no change",
          //       "improvement",
          //       "decline",
          //       "other"
          //     ]
          //   },
          {
            "type": "extraQuestion",
            "rowLabel": "If you disagree, please explain your reasoning:"
          },
          {
            "type": "comments",
            "rowLabel": "Comment ",
            "label2": " ",
            "nameLabel": "Comments"
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources (reference, specific page, section, etc.)",
            variableName: "sources",
            prevStep: "S011",
            evaluationStep: "S020",
            comparisonType: "S",
          }
        ]
      }]
    },
    {
      step: 3,
      rowLabel: "Reconcilation and Consolidation",
      stepColor: "#d9ead3",
      substeps: [{
          labelShort: "Step 3.0",
          subStepID: "S030",
          subStepColor: "#d9ead3",
          doCollapse: false,
          components: [{
              type: "stepResearcherRow",
              id: "N",
              rowLabel: "Researcher",
              variableName: "researcher",
              placeholderText: "Your Name"
            },
            {
              type: "subStepHeader",
              rowLabel: "Is there Agreement between Step 1 and Step 2?",
            },
            {
              type: "compareTwoSteps",
              id: "R",
              "rowLabel": "Answer ",
              prevStep: "S011",
              evaluationStep: "S021",
              comparisonType: "R",
              isInternalEval: true
            }
          ]
        },
        {
          labelShort: "Step 3.1",
          subStepID: "S031",
          resultStepID: "S030",
          "subStepColor": "#d9ead3",
          "components": [{
              type: "subStepHeader",
              rowLabel: "If there is a disagreement, please suggest your Result and in the Comment field, explain your reasoning:"
            },
            {
              type: "reviewResults",
              id: "R",
              scoringId: "SE",
              rowLabel: "Result ",
              variableName: "result",
              prevStep: "S021",
              evaluationStep: "S030",
              comparisonType: "R",
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
              "type": "extraQuestion",
              "rowLabel": "If there is a disagreement, please explain your reasoning:"
            },
            {
              type: "comments",
              id: "C",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              prevStep: "S021",
              evaluationStep: "S030",
              comparisonType: "C",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources",
              prevStep: "S021",
              evaluationStep: "S030",
              comparisonType: "S",
            }
          ]
        },
        {
          labelShort: "Step 3.5",
          subStepID: "S035",
          subStepColor: "#d9ead3",
          "components": [{
              type: "subStepHeader",
              rowLabel: "Are the Year-on-Year Results the same this Year?",
            },
            // regular YonY:
            {
              "type": "compareTwoSteps",
              id: "R",
              "rowLabel": "Answer ",
              prevStep: "S031",
              prevIndexPrefix: "RDR19",
              evaluationStep: "S07",
              comparisonType: "R",
              isInternalEval: false
            },
            {
              "type": "extraQuestion",
              "rowLabel": "If this Year's Results are different, select Reason for Change:"
            },
            {
              type: "YonYreview", // "evaluation"
              mode: "YonY",
              id: "YY",
              scoringId: "SE",
              rowLabel: "Reason ",
              variableName: "result",
              prevStep: "S031",
              evaluationStep: "S035", // Regular YonY: S015
              comparisonType: "R", // Regular YonY: YY
              dropdown: [
                "not selected",
                "no change",
                "improvement",
                "decline",
                "other"
              ]
            },
            {
              "type": "comments",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            }, {
              type: "sources",
              id: "S",
              rowLabel: "Sources (reference, specific page, section, etc.)",
              variableName: "sources",
              prevStep: "S07",
              evaluationStep: "S07",
              comparisonType: "DC",
            }
          ]
        }
      ]
    },
    {
      step: 4,
      rowLabel: "Company Feedback",
      stepColor: "#d9d2e9",
      substeps: [{
          rowLabel: "Step 4: Company Notes",
          labelShort: "Step 4",
          subStepID: "S04",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [{
              type: "stepResearcherRow",
              id: "N",
              rowLabel: "Researcher",
              variableName: "researcher",
              placeholderText: "Your Name"
            },
            {
              type: "subStepHeader",
              rowLabel: "Are the Results the same this year?",
            },
            {
              type: "binaryEvaluation",
              id: "MB",
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
              id: "C",
              rowLabel: "Comment ",
              label2: " (required if 'yes', optional if 'no')",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
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
              type: "subStepHeader",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "N",
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
      rowLabel: "Consolidated Evaluation",
      stepColor: "#fff2cc",
      substeps: [{
          rowLabel: "Step 5: Score consolidation and horizontal review",
          labelShort: "Step 5",
          subStepID: "S05",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [{
              type: "stepResearcherRow",
              id: "N",
              rowLabel: "Researcher",
              variableName: "researcher",
              placeholderText: "Your Name"
            },
            {
              type: "subStepHeader",
              rowLabel: "Are the Results the same this year?",
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
              id: "C",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
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
              type: "subStepHeader",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "N",
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
      rowLabel: "Horizontal review",
      stepColor: "#ead1dc",
      substeps: [{
          rowLabel: "Step 6: Final Scores",
          labelShort: "Step 6",
          subStepID: "S06",
          subStepColor: "#ead1dc",
          doCollapse: true,
          components: [{
              type: "stepResearcherRow",
              id: "N",
              rowLabel: "Researcher",
              variableName: "researcher",
              placeholderText: "Your Name"
            },
            {
              type: "subStepHeader",
              rowLabel: "Are the Results the same this year?",
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
              id: "C",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
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
              type: "subStepHeader",
              rowLabel: "Researcher",
              value: "Researcher",
              id: "N",
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
