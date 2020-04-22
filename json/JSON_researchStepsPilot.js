var researchStepsVector = {
  researchSteps: [{
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
              "label2": " (explain score)",
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
          label: "Step 1a: Notes/comments from researchers",
          labelShort: "Step 1a",
          subStepID: "S01a",
          subStepColor: "#ddd9c3",
          doCollapse: false,
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S01",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              "label2": "",
              valueLabel: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    },
    {
      step: 2,
      stepColor: "#c6d9f0",
      substeps: [{
          label: "Step 2: Secondary review",
          labelShort: "Step 2",
          subStepID: "S02",
          subStepColor: "#c6d9f0",
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
              "label2": "\n(required if 'no', optional if 'yes')",
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
          label: "Step 2a: Notes/comments from researchers",
          labelShort: "Step 2a",
          subStepID: "S02a",
          subStepColor: "#c6d9f0",
          doCollapse: true,
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S02",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              "label2": "",
              valueLabel: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    },
    {
      step: 3,
      stepColor: "#d9ead3",
      substeps: [{
          label: "Step 3: Score Consensus",
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
              "label2": " (explain score)",
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
          label: "Step 3a: Notes/comments from researchers",
          labelShort: "Step 3a",
          subStepID: "S03a",
          subStepColor: "#d9ead3",
          doCollapse: true,
          components: [{
              type: "header",
              label: "Researcher",
              value: "Researcher",
              id: "MI",
              importNameFrom: "S03",
              placeholderText: ""
            },
            {
              type: "elementComments",
              id: "MN",
              label: "Notes for ",
              "label2": "",
              valueLabel: "notes",
              clipWrap: true
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
              "label2": " (required if 'yes', optional if 'no')",
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
              "label2": "",
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
              "label2": " (explain score)",
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
              "label2": "",
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
              "label2": " (explain score)",
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
              "label2": "",
              valueLabel: "notes",
              clipWrap: true
            }
          ]
        }
      ]
    }
  ]
}
