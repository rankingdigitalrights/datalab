var researchStepsVector = {
  researchSteps: [{
      step: 0,
      stepColor: "#ddd9c3",
      substeps: [{
        label: "Step 0: Dummy Import",
        labelShort: "Step 0",
        subStepID: "S00",
        subStepColor: "#ddd9c3",
        doCollapse: false,
        components: [{
            type: "header",
            id: "MI",
            label: "Dummy",
            value: "Dummy",
            placeholderText: "Step 0"
          }, {
            "type": "importPrevious",
            "label": "Element ",
            "comparisonLabelShort": "S07",
            "component": "FoE"
          },
          {
            "type": "importPrevious",
            "label": "Element ",
            "comparisonLabelShort": "S07",
            "component": "P"
          }

        ]
      }]
    },
    {
      step: 1,
      stepColor: "#ddd9c3",
      substeps: [{
        label: "Step 1: Data Collection",
        labelShort: "Step 1",
        subStepID: "S01",
        subStepColor: "#ddd9c3",
        doCollapse: false,
        components: [{
            type: "header",
            id: "MI",
            label: "Researcher",
            valueLabel: "researcher",
            placeholderText: "Your Name"
          },
          {
            type: "elementResults",
            id: "",
            scoringId: "SE",
            label: "Element ",
            valueLabel: "result",
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
            type: "elementComments",
            id: "MC",
            label: "Comments for ",
            label2: " (explain score)",
            valueLabel: "comment",
            clipWrap: true
          },
          {
            type: "sources",
            id: "MS",
            label: "Sources (reference, specific page, section, etc.)",
            valueLabel: "sources"
          }
        ]
      }, {
        "label": "Step 1.5: Year-on-year analysis",
        "labelShort": "S01.5",
        "c1": 168,
        "c2": 168,
        "c3": 50,
        "subStepColor": "#ead1dc",
        "components": [{
            type: "header",
            id: "MI",
            label: "Dummy",
            value: "Dummy",
            placeholderText: "Step 1.5"
          }, {
            "type": "header",
            "placeholderText": " "
          },
          {
            type: "binaryReview",
            id: "MR",
            label: "Redundant: Is your answer the same as the previous year?",
            dropdown: [
              "not selected",
              "yes",
              "no"
            ]
          },
          {
            "type": "comparison",
            "label": "Element ",
            "comparisonLabelShort": "S01"
          },
          {
            "type": "extraQuestion",
            "label": "If no, please select the reason why and provide comments for that element."
          },
          {
            "type": "elementResults",
            "label": "Select reason if 'no' for ",
            "dropdown": [
              "not selected",
              "I do not agree with last year's score",
              "the policy appears revised or changed"
            ]
          },
          {
            "type": "elementComments",
            "label": "Comments for ",
            "label2": " ",
            "nameLabel": "Comments"
          }
        ]
      }]
    },
    {
      step: 2,
      stepColor: "#c6d9f0",
      substeps: [{
          label: "Step 2: Secondary review",
          labelShort: "Step 2",
          subStepID: "S02",
          subStepColor: "#c6d9f0",
          doCollapse: false,
          components: [{
              type: "header",
              id: "MI",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "binaryReview",
              id: "MR",
              label: "Do you agree with the answer(s) in Step 1?",
              dropdown: [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              type: "elementResults",
              id: "MA",
              scoringId: "SE",
              label: "If 'no': suggested answer for ",
              valueLabel: "result",
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
              type: "elementComments",
              id: "MC",
              label: "Comments for ",
              label2: "\n(required if 'no', optional if 'yes')",
              valueLabel: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources"
            }
          ]
        },
        {
          label: "Step 2.5: Year-on-Year Review",
          labelShort: "Step 2.5",
          subStepID: "S02a",
          subStepColor: "#c6d9f0",
          doCollapse: false,
          components: [{
              type: "header",
              id: "MI",
              label: "Dummy",
              value: "Dummy",
              placeholderText: "Step 2.5"
            }, {
              "type": "binaryReview",
              "label": "Redundant: Do you agree with the year-on-year analysis in Step 1.5?",
              "dropdown": [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              "type": "elementResults",
              "label": "In Step 1.5 for ",
              "dropdown": [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              "type": "elementComments",
              "label": "If no, comments on ",
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
          label: "TBD: Step 3: Score Consensus",
          labelShort: "Step 3",
          subStepID: "S03",
          subStepColor: "#d9ead3",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "elementResults",
              id: "",
              scoringId: "SE",
              label: "Consolidated answer for ",
              valueLabel: "result",
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
              type: "elementComments",
              id: "MC",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources"
            }
          ]
        },
        {
          "label": "Step 3.5: Year-on-year analysis",
          "labelShort": "S03.5",
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
              "label": "Is your answer the same as the previous year?"
            },
            {
              "type": "comparison",
              "label": "Element ",
              "comparisonLabelShort": "S03"
            },
            {
              "type": "extraQuestion",
              "label": "If no, please select the reason why and provide comments for that element."
            },
            {
              "type": "elementResults",
              "label": "Select reason if 'no' for ",
              "dropdown": [
                "not selected",
                "I do not agree with last year's score",
                "the policy appears revised or changed"
              ]
            },
            {
              "type": "elementComments",
              "label": "Comments for ",
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
          label: "Step 4: Company Notes",
          labelShort: "Step 4",
          subStepID: "S04",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "binaryReview",
              id: "MR",
              label: "Does company feedback merit a change??",
              dropdown: [
                "not selected",
                "yes",
                "no"
              ]
            },
            {
              type: "elementResults",
              label: "If 'yes': suggested answer for ",
              valueLabel: "result",
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
              type: "elementComments",
              id: "MC",
              label: "Comments for ",
              label2: " (required if 'yes', optional if 'no')",
              valueLabel: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources"
            }
          ]
        },
        {
          label: "Step 4a: Notes/comments from researchers",
          labelShort: "Step 4a",
          subStepID: "S04a",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S04",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              label2: "",
              valueLabel: "notes",
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
          label: "Step 5: Score consolidation and horizontal review",
          labelShort: "Step 5",
          subStepID: "S05",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "elementResults",
              id: "",
              scoringId: "SE",
              label: "Consolidated answer for ",
              valueLabel: "result",
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
              type: "elementComments",
              id: "MC",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources"
            }
          ]
        },
        {
          label: "Step 5a: Notes/comments from researchers",
          labelShort: "Step 5a",
          subStepID: "S05a",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S05",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              label2: "",
              valueLabel: "notes",
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
          label: "Step 6: Final Scores",
          labelShort: "Step 6",
          subStepID: "S06",
          subStepColor: "#ead1dc",
          doCollapse: true,
          components: [{
              type: "header",
              id: "MI",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name"
            },
            {
              type: "elementResults",
              id: "",
              scoringId: "SE",
              label: "Element ",
              valueLabel: "result",
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
              type: "elementComments",
              id: "MC",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true
            },
            {
              type: "sources",
              id: "MS",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources"
            }
          ]
        },
        {
          label: "Step 6a: Notes/comments from researchers",
          labelShort: "Step 6a",
          subStepID: "S06a",
          doCollapse: true,
          subStepColor: "#ead1dc",
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S06",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              label2: "",
              valueLabel: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    }
  ]
}
