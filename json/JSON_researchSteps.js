var researchStepsVector = {
  methodology: "RDR20",
  regularIndex: true,
  researchSteps: [{
      step: 0,
      altScoringSubstepNr: 0,
      altIndexID: "RDR19",
      altYear: "2019",
      stepID: "S00",
      rowLabel: "2019 Final Outcome",
      stepColor: "#faca0f",
      doCollapse: false,
      substeps: [{
        labelShort: "Step 0 - 2019 S7 Outcome",
        subStepID: "S00",
        importStepID: "S07",
        subStepColor: "#faca0f",
        doCollapse: false,
        components: [{
            "type": "importPreviousResults",
            "rowLabel": "Result ",
            importStepID: "S07",
            comparisonType: "DC",
            id: "R",
          },
          {
            "type": "importPreviousComments",
            "rowLabel": "Comment ",
            importStepID: "S07",
            comparisonType: "DC",
            id: "C",
          }, {
            "type": "importPreviousSources",
            "rowLabel": "Sources (2019)",
            importStepID: "S07",
            comparisonType: "DC",
            id: "S",
          }
        ]
      }]
    },
    {
      step: 1,
      stepID: "S01",
      rowLabel: "Data Collection and Evaluation",
      stepColor: "#ddd9c3",
      doCollapse: false,
      scoringSubStep: "S011",
      substeps: [{
          labelShort: "Step 1.0",
          subStepID: "S010",
          subStepColor: "#ddd9c3",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Are the Results the same this Year?",
            },
            {
              type: "evaluation",
              id: "R",
              scoringId: "SE",
              rowLabel: "Answer ",
              variableName: "result",
              importStepID: "S07",
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
              importStepID: "S07",
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
              importStepID: "S07",
              evaluationStep: "S010",
              comparisonType: "R",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
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
              importStepID: "S011",
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
              importStepID: "S011",
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
              id: "C",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
            }
          ]
        }
      ]
    },
    {
      step: 2,
      stepID: "S02",
      rowLabel: "Fact Check/Review of Step 1",
      stepColor: "#c6d9f0",
      doCollapse: false,
      scoringSubStep: "S021",
      substeps: [{
        labelShort: "Step 2.0",
        subStepID: "S020",
        subStepColor: "#c6d9f0",
        doCollapse: false,
        components: [{
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
            importStepID: "S011",
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
            importStepID: "S011",
            evaluationStep: "S020",
            comparisonType: "R",
            clipWrap: true
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
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
          {
            "type": "extraQuestion",
            "rowLabel": "If you disagree, please explain your reasoning:"
          },
          {
            "type": "comments",
            id: "C",
            "rowLabel": "Comment ",
            "label2": " ",
            "nameLabel": "Comments"
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
          }
        ]
      }]
    },
    {
      step: 3,
      altScoringSubstepNr: 2,
      stepID: "S03",
      rowLabel: "Reconciliation and Consolidation",
      stepColor: "#d9ead3",
      doCollapse: false,
      scoringSubStep: "S032",
      substeps: [{
          labelShort: "Step 3.0",
          subStepID: "S030",
          subStepColor: "#d9ead3",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Is there Agreement between Step 1 and Step 2?",
            },
            {
              type: "compareTwoSteps",
              id: "R",
              "rowLabel": "Answer ",
              importStepID: "S011",
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
              importStepID: "S021",
              evaluationStep: "S030",
              comparisonType: "R",
              showOnlyRelevant: true,
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
              importStepID: "S021",
              evaluationStep: "S030",
              comparisonType: "R",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
            }
          ]
        },
        {
          labelShort: "Step 3.2",
          subStepID: "S032",
          resultStepID: "S030",
          "subStepColor": "#d9ead3",
          "components": [{
              type: "subStepHeader",
              rowLabel: "Consolidated Results"
            },
            {
              type: "reviewResults",
              id: "R",
              scoringId: "SE",
              rowLabel: "Result ",
              variableName: "result",
              importStepID: "S021",
              evaluationStep: "S030",
              comparisonType: "R",
              dropdown: [
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
              importStepID: "S021",
              evaluationStep: "S030",
              comparisonType: "R",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
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
              importStepID: "S032",
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
              importStepID: "S031",
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
              id: "C",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            }, {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
            }
          ]
        }
      ]
    },
    {
      step: 4,
      stepID: "S04",
      rowLabel: "Company Feedback",
      stepColor: "#ffe599",
      doCollapse: false,
      omitResearcher: true,
      substeps: [{
          labelShort: "Step 4.0",
          subStepID: "S040",
          subStepColor: "#ffe599",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Did the Company provide Feedback for this Indicator?",
            },
            {
              type: "binaryFeedbackCheck",
              id: "MB",
              rowLabel: "Status"
            },
            {
              type: "extraQuestion",
              rowLabel: "Company Feedback for this Indicator"
            },
            {
              type: "importFeedbackText",
              id: "FBS",
              rowLabel: "Feedback"
            }
          ]
        },
        {
          rowLabel: "Research Team Notes",
          labelShort: "Step 4.1",
          subStepID: "S042",
          subStepColor: "#ffe599",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Research Team Notes"
            },
            {
              type: "researcherFBNotes",
              id: "FBN",
              rowLabel: "Notes"
            }
          ]
        }
        // {
        //   labelShort: "Step 4.2 (Option A)",
        //   subStepID: "S047a",
        //   subStepColor: "#f1c232",
        //   "components": [{
        //       type: "subStepHeader",
        //       rowLabel: "Does company feedback merit a change?",
        //     },
        //     {
        //       type: "binaryReview",
        //       id: "MB",
        //       rowLabel: "Answer",
        //       dropdown: [
        //         "not selected",
        //         "yes",
        //         "no"
        //       ]
        //     }
        //   ]
        // }
      ]
    },
    {
      step: 5,
      stepID: "S05",
      rowLabel: "Company Feedback Evaluation",
      stepColor: "#f1c232",
      doCollapse: false,
      substeps: [{
          labelShort: "Step 5.0",
          subStepID: "S050",
          subStepColor: "#f1c232",
          doCollapse: false,
          components: [{
              type: "subStepHeader",
              rowLabel: "Does company feedback merit a change?",
            },
            {
              type: "feedbackEvaluation",
              id: "FB",
              scoringId: "SE",
              rowLabel: "Answer ",
              variableName: "result",
              evaluationStep: "S050",
              comparisonType: "R",
              dropdown: [
                "not selected",
                "yes",
                "no",
              ]
            },
          ]
        },
        {
          labelShort: "Step 5.1",
          subStepID: "S051",
          resultStepID: "S032",
          "subStepColor": "#f1c232",
          "components": [{
              type: "subStepHeader",
              rowLabel: "If yes, enter the company's consolidated evaluation following company feedback:"
            },
            {
              type: "reviewResults",
              id: "R",
              scoringId: "SE",
              rowLabel: "Result ",
              variableName: "result",
              importStepID: "S032",
              evaluationStep: "S050",
              comparisonType: "FB",
              reverseConditional: true,
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
              id: "C",
              rowLabel: "Comment ",
              label2: " (explain score)",
              variableName: "comment",
              importStepID: "S032",
              evaluationStep: "S050",
              comparisonType: "R",
              clipWrap: true
            },
            {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
            }
          ]
        },
        {
          labelShort: "Step 5.5",
          subStepID: "S055",
          subStepColor: "#f1c232",
          "components": [{
              type: "subStepHeader",
              rowLabel: "Are the Year-on-Year Results the same this Year?",
            },
            // regular YonY:
            {
              "type": "compareTwoSteps",
              id: "R",
              "rowLabel": "Answer ",
              importStepID: "S051",
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
              evaluationStep: "S055", // Regular YonY: S015
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
              id: "C",
              "rowLabel": "Comment ",
              "label2": " ",
              "nameLabel": "Comments"
            }, {
              type: "sources",
              id: "S",
              rowLabel: "Sources",
              variableName: "sources"
            }
          ]
        }
      ]
    },
    {
      step: 6,
      stepID: "S06",
      rowLabel: "Horizontal Review",
      stepColor: "#6aa84f",
      doCollapse: false,
      substeps: [{
        labelShort: "Step 6.0",
        subStepID: "S060",
        subStepColor: "#6aa84f",
        doCollapse: false,
        components: [{
            type: "subStepHeader",
            rowLabel: "Do you agree with the Step 5 Evaluation?",
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
        labelShort: "Step 6.1",
        subStepID: "S061",
        subStepColor: "#6aa84f",
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
            importStepID: "S051",
            evaluationStep: "S060",
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
            importStepID: "S051",
            evaluationStep: "S060",
            comparisonType: "R",
            clipWrap: true
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
          }
        ]
      }, {
        labelShort: "Step 6.5",
        subStepID: "S065",
        subStepColor: "#6aa84f",
        "components": [{
            type: "subStepHeader",
            rowLabel: "If this Year's Results are different, select Reason for Change",
          },
          {
            type: "evaluation",
            id: "YY",
            mode: "YonY",
            scoringId: "SE",
            rowLabel: "Reason ",
            variableName: "result",
            comparisonType: "DC",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          },
          {
            "type": "extraQuestion",
            "rowLabel": "If you disagree, please explain your reasoning:"
          },
          {
            "type": "comments",
            id: "C",
            "rowLabel": "Comment ",
            "label2": " ",
            "nameLabel": "Comments"
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
          }
        ]
      }]
    }, {
      step: 7,
      stepID: "S07",
      rowLabel: "Final Results",
      stepColor: "#a4c2f4",
      doCollapse: false,
      substeps: [{
        labelShort: "Step 7.0",
        subStepID: "S070",
        subStepColor: "#a4c2f4",
        doCollapse: false,
        components: [{
            type: "subStepHeader",
            rowLabel: "Do you agree with the Step 6 Evaluation?",
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
        labelShort: "Step 7.1",
        subStepID: "S071",
        subStepColor: "#a4c2f4",
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
            importStepID: "S051",
            evaluationStep: "S070",
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
            importStepID: "S051",
            evaluationStep: "S070",
            comparisonType: "R",
            clipWrap: true
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
          }
        ]
      }, {
        labelShort: "Step 7.5",
        subStepID: "S075",
        subStepColor: "#a4c2f4",
        "components": [{
            type: "subStepHeader",
            rowLabel: "If this Year's Results are different, select Reason for Change",
          },
          {
            type: "evaluation",
            id: "YY",
            mode: "YonY",
            scoringId: "SE",
            rowLabel: "Reason ",
            variableName: "result",
            comparisonType: "DC",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          },
          {
            "type": "extraQuestion",
            "rowLabel": "If you disagree, please explain your reasoning:"
          },
          {
            "type": "comments",
            id: "C",
            "rowLabel": "Comment ",
            "label2": " ",
            "nameLabel": "Comments"
          },
          {
            type: "sources",
            id: "S",
            rowLabel: "Sources",
            variableName: "sources"
          }
        ]
      }]
    }
  ]
}
