const indicatorsVector = {
  collection: 'indicators',
  indexYear: 2021,
  indexType: 'RDR Index',
  lastRevised: '2021-03-12',
  indicatorCategories: [
    {
      labelShort: 'G',
      labelLong: 'Governance',
      description:
        'Indicators in this category seek evidence that the company has governance processes in place to ensure that it respects the human rights to freedom of expression and privacy. Both rights are part of the Universal Declaration of Human Rights and are enshrined in the International Covenant on Civil and Political Rights. They apply online as well as offline. In order for a company to perform well in this section, the company’s disclosure should at least follow, and ideally surpass, the UN Guiding Principles on Business and Human Rights and other industry-specific human rights standards focused on freedom of expression and privacy such as the Global Network Initiative.',
      researchGuidance: 'TBD',
      classColor: '#ffe599',
      indicators: [
        {
          labelShort: 'G1',
          labelLong: 'Policy commitment',
          description: 'Indicator Description: TBD',
          indicatorGuidanceText: 'Indicator Guidance Text:\n\nTBD',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91064590',
          scoringScope: 'company',
          prevOutcomeIndyStartRow: 3,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G1.1',
              description:
                'Does the company make an explicit, clearly articulated policy commitment to human rights, including to freedom of expression and information?',
            },
            {
              labelShort: 'G1.2',
              description:
                'Does the company make an explicit, clearly articulated policy commitment to human rights, including to privacy?',
            },
            {
              labelShort: 'G1.3',
              description:
                'Does the company disclose an explicit, clearly articulated policy commitment to human rights in its development and use of algorithmic systems?',
            },
          ],
        },
        {
          labelShort: 'G2',
          labelLong: 'Governance and management oversight',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91354606',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 22,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G2.1',
              description:
                'Does the company clearly disclose that the board of directors exercises formal oversight over how company practices affect freedom of expression and information?',
            },
            {
              labelShort: 'G2.2',
              description:
                'Does the company clearly disclose that the board of directors exercises formal oversight over how company practices affect privacy?',
            },
            {
              labelShort: 'G2.3',
              description:
                'Does the company clearly disclose that an executive-level committee, team, program or officer oversees how company practices affect freedom of expression and information?',
            },
            {
              labelShort: 'G2.4',
              description:
                'Does the company clearly disclose that an executive-level committee, team, program or officer oversees how company practices affect privacy?',
            },
            {
              labelShort: 'G2.5',
              description:
                'Does the company clearly disclose that a management-level committee, team, program or officer oversees how company practices affect freedom of expression and information?',
            },
            {
              labelShort: 'G2.6',
              description:
                'Does the company clearly disclose that a management-level committee, team, program or officer oversees how company practices affect privacy?',
            },
          ],
        },
        {
          labelShort: 'G3',
          labelLong: 'Internal implementation',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91354871',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 50,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G3.1',
              description:
                'Does the company clearly disclose that it provides employee training on freedom of expression and information issues?',
            },
            {
              labelShort: 'G3.2',
              description: 'Does the company clearly disclose that it provides employee training on privacy issues?',
            },
            {
              labelShort: 'G3.3',
              description:
                'Does the company clearly disclose that it maintains an employee whistleblower program through which employees can report concerns related to how the company treats its users’ freedom of expression and information rights?',
            },
            {
              labelShort: 'G3.4',
              description:
                'Does the company clearly disclose that it maintains an employee whistleblower program through which employees can report concerns related to how the company treats its users’ privacy rights?',
            },
          ],
        },
        {
          labelShort: 'G4a',
          labelLong: 'Impact assessment: Governments and regulations',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360899',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 72,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G4a.1',
              description:
                'Does the company assess how laws affect freedom of expression and information in jurisdictions where it operates?',
            },
            {
              labelShort: 'G4a.2',
              description: 'Does the company assess how laws affect privacy in jurisdictions where it operates?',
            },
            {
              labelShort: 'G4a.3',
              description:
                'Does the company assess freedom of expression and information risks associated with existing products and services in jurisdictions where it operates?',
            },
            {
              labelShort: 'G4a.4',
              description:
                'Does the company assess privacy risks associated with existing products and services in jurisdictions where it operates?',
            },
            {
              labelShort: 'G4a.5',
              description:
                'Does the company assess freedom of expression and information risks associated with a new activity, including the launch and/or acquisition of new products, services, or companies, or entry into new markets or jurisdictions?',
            },
            {
              labelShort: 'G4a.6',
              description:
                'Does the company assess privacy risks associated with a new activity, including the launch and/or acquisition of new products, services, or companies, or entry into new markets or jurisdictions?',
            },
            {
              labelShort: 'G4a.7',
              description:
                'Does the company conduct additional evaluation wherever the company’s risk assessments identify concerns?',
            },
            {
              labelShort: 'G4a.8',
              description:
                'Do senior executives and/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?',
            },
            {
              labelShort: 'G4a.9',
              description: 'Does the company conduct assessments on a regular schedule?',
            },
            {
              labelShort: 'G4a.10',
              description: 'Are the company’s assessments assured by an external third party?',
            },
            {
              labelShort: 'G4a.11',
              description:
                'Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?',
            },
          ],
        },
        {
          labelShort: 'G4b',
          labelLong: 'Impact assessment: Processes for policy enforcement',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360905',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 115,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G4b.1',
              description:
                'Does the company assess freedom of expression and information risks of enforcing its terms of service?',
            },
            {
              labelShort: 'G4b.2',
              description: 'Does the company conduct risk assessments of its enforcement of its privacy policies?',
            },
            {
              labelShort: 'G4b.3',
              description:
                'Does the company assess discrimination risks associated with its processes for enforcing its terms of service?',
            },
            {
              labelShort: 'G4b.4',
              description:
                'Does the company assess discrimination risks associated with its processes for enforcing its privacy policies?',
            },
            {
              labelShort: 'G4b.5',
              description:
                'Does the company conduct additional evaluation wherever the company’s risk assessments identify concerns?',
            },
            {
              labelShort: 'G4b.6',
              description:
                'Do senior executives and/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?',
            },
            {
              labelShort: 'G4b.7',
              description: 'Does the company conduct assessments on a regular schedule?',
            },
            {
              labelShort: 'G4b.8',
              description: 'Are the company’s assessments assured by an external third party?',
            },
            {
              labelShort: 'G4b.9',
              description:
                'Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?',
            },
          ],
        },
        {
          labelShort: 'G4c',
          labelLong: 'Impact assessment: Targeted advertising',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360907',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 152,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G4c.1',
              description:
                'Does the company assess freedom of expression and information risks associated with its targeted advertising policies and practices?',
            },
            {
              labelShort: 'G4c.2',
              description:
                'Does the company assess privacy risks associated with its targeted advertising policies and practices?',
            },
            {
              labelShort: 'G4c.3',
              description:
                'Does the company assess discrimination risks associated with its targeted advertising policies and practices?',
            },
            {
              labelShort: 'G4c.4',
              description:
                'Does the company conduct additional evaluation whenever the company’s risk assessments identify concerns?',
            },
            {
              labelShort: 'G4c.5',
              description:
                'Do senior executives and/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?',
            },
            {
              labelShort: 'G4c.6',
              description: 'Does the company conduct assessments on a regular schedule?',
            },
            {
              labelShort: 'G4c.7',
              description: 'Are the company’s assessments assured by an external third party?',
            },
            {
              labelShort: 'G4c.8',
              description:
                'Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?',
            },
          ],
        },
        {
          labelShort: 'G4d',
          labelLong: 'Impact assessment: Algorithmic systems',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360910',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 186,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G4d.1',
              description:
                'Does the company assess freedom of expression and information risks associated with its development and use of algorithmic systems?',
            },
            {
              labelShort: 'G4d.2',
              description:
                'Does the company assess privacy risks associated with its development and use of algorithmic systems?',
            },
            {
              labelShort: 'G4d.3',
              description:
                'Does the company assess discrimination risks associated with its development and use of algorithmic systems?',
            },
            {
              labelShort: 'G4d.4',
              description:
                'Does the company conduct additional evaluation wherever the company’s risk assessments identify concerns?',
            },
            {
              labelShort: 'G4d.5',
              description:
                'Do senior executives and/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?',
            },
            {
              labelShort: 'G4d.6',
              description: 'Does the company conduct assessments on a regular schedule?',
            },
            {
              labelShort: 'G4d.7',
              description: 'Are the company’s assessments assured by an external third party?',
            },
            {
              labelShort: 'G4d.8',
              description:
                'Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?',
            },
          ],
        },
        {
          labelShort: 'G4e',
          labelLong: 'Impact assessment: Zero-rating',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360913',
          scoringScope: 'full',
          prevOutcomeIndyStartRow: 220,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G4e.1',
              description:
                'Does the company assess freedom of expression and information risks associated with its zero-rating programs?',
            },
            {
              labelShort: 'G4e.2',
              description: 'Does the company assess privacy risks associated with its zero-rating programs?',
            },
            {
              labelShort: 'G4e.3',
              description: 'Does the company assess discrimination risks associated with its zero-rating programs?',
            },
            {
              labelShort: 'G4e.4',
              description:
                'Does the company conduct additional evaluation wherever the company’s risk assessments identify concerns?',
            },
            {
              labelShort: 'G4e.5',
              description:
                'Do senior executives and/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?',
            },
            {
              labelShort: 'G4e.6',
              description: 'Does the company conduct assessments on a regular schedule?',
            },
            {
              labelShort: 'G4e.7',
              description: 'Are the company’s assessments assured by an external third party?',
            },
            {
              labelShort: 'G4e.8',
              description:
                'Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?',
            },
          ],
        },
        {
          labelShort: 'G5',
          labelLong: 'Stakeholder engagement and accountability',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360916',
          scoringScope: 'company',
          prevOutcomeIndyStartRow: 254,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G5.1',
              description:
                'Is the company a member of one or more multi-stakeholder initiatives that address the full range of ways in which users’ fundamental rights to freedom of expression and information, privacy, and non-discrimination may be affected in the course of the company’s operations?',
            },
            {
              labelShort: 'G5.2',
              description:
                'If the company is not a member of one or more such multi-stakeholder initiatives, is the company a member of any organization that engages systematically and on a regular basis with non-industry and non-governmental stakeholders on freedom of expression and privacy issues?',
            },
            {
              labelShort: 'G5.3',
              description:
                'If the company is not a member of one of these organizations, does the company disclose that it initiates or participates in meetings with stakeholders that represent, advocates on behalf of, or are people whose rights to freedom of expression and information and to privacy are directly impacted by the company’s business?',
            },
          ],
        },
        {
          labelShort: 'G6a',
          labelLong: 'Remedy',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360919',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 273,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G6a.1',
              description:
                'Does the company clearly disclose it has a grievance mechanism(s) enabling users to submit complaints if they feel their freedom of expression and information rights have been adversely affected by the company’s policies or practices?',
            },
            {
              labelShort: 'G6a.2',
              description:
                'Does the company clearly disclose it has a grievance mechanism(s) enabling users to submit complaints if they feel their privacy has been adversely affected by the company’s policies or practices?',
            },
            {
              labelShort: 'G6a.3',
              description:
                'Does the company clearly disclose its procedures for providing remedy for freedom of expression and information-related grievances?',
            },
            {
              labelShort: 'G6a.4',
              description:
                'Does the company clearly disclose its procedures for providing remedy for privacy-related grievances?',
            },
            {
              labelShort: 'G6a.5',
              description: 'Does the company clearly disclose timeframes for its grievance and remedy procedures?',
            },
            {
              labelShort: 'G6a.6',
              description:
                'Does the company clearly disclose the number of complaints received related to freedom of expression?',
            },
            {
              labelShort: 'G6a.7',
              description: 'Does the company clearly disclose the number of complaints received related to privacy?',
            },
            {
              labelShort: 'G6a.8',
              description:
                'Does the company clearly disclose evidence that it is providing remedy for freedom of expression grievances?',
            },
            {
              labelShort: 'G6a.9',
              description:
                'Does the company clearly disclose evidence that it is providing remedy for privacy grievances?',
            },
          ],
        },
        {
          labelShort: 'G6b',
          labelLong: 'Process for content moderation appeals',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91360923',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['telecom'],
          doExcludeServices: true,
          excludeServices: ['opCom', 'search', 'cloud', 'eCommerce', 'email'],
          prevOutcomeIndyStartRow: 310,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'G6b.1',
              description:
                'Does the company clearly disclose that it offers affected users the ability to appeal content-moderation actions?',
            },
            {
              labelShort: 'G6b.2',
              description:
                'Does the company clearly disclose that it notifies the users who are affected by a content-moderation action?',
            },
            {
              labelShort: 'G6b.3',
              description:
                'Does the company clearly disclose a timeframe for notifying affected users when it takes a content-moderation action?',
            },
            {
              labelShort: 'G6b.4',
              description: 'Does the company clearly disclose when appeals are not permitted?',
            },
            {
              labelShort: 'G6b.5',
              description: 'Does the company clearly disclose its process for reviewing appeals?',
            },
            {
              labelShort: 'G6b.6',
              description: 'Does the company clearly disclose its timeframe for reviewing appeals?',
            },
            {
              labelShort: 'G6b.7',
              description:
                'Does the company clearly disclose that such appeals are reviewed by at least one human not involved in the original content-moderation action?',
            },
            {
              labelShort: 'G6b.8',
              description: 'Does the company clearly disclose what role automation plays in reviewing appeals?',
            },
            {
              labelShort: 'G6b.9',
              description:
                'Does the company clearly disclose that the affected users have an opportunity to present additional information that will be considered in the review?',
            },
            {
              labelShort: 'G6b.10',
              description:
                'Does the company clearly disclose that it provides the affected users with a statement outlining the reason for its decision?',
            },
            {
              labelShort: 'G6b.11',
              description:
                'Does the company clearly disclose evidence that it is addressing content moderation appeals?',
            },
          ],
        },
      ],
    },
    {
      labelShort: 'F',
      labelLong: 'Freedom of Expression',
      description:
        'Indicators in this category seek evidence that the company demonstrates it respects the right to freedom of expression, as articulated in the Universal Declaration of Human Rights, the International Covenant on Civil and Political Rights and other international human rights instruments. The company’s disclosed policies and practices demonstrate how it works to avoid contributing to actions that may interfere with this right, except where such actions are lawful, proportionate and for a justifiable purpose. Companies that perform well on this indicator demonstrate a strong public commitment to transparency not only in terms of how they respond to government and others’ demands, but also how they determine, communicate, and enforce private rules and commercial practices that affect users’ freedom of expression.',
      researchGuidance: 'TBD',
      classColor: '#a4c2f4',
      indicators: [
        {
          labelShort: 'F1a',
          labelLong: 'Access to terms of service',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91385963',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 353,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F1a.1',
              description: 'Are the company’s terms of service easy to find?',
            },
            {
              labelShort: 'F1a.2',
              description:
                'Are the terms of service available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'F1a.3',
              description: 'Are the terms of service presented in an understandable manner?',
            },
          ],
        },
        {
          labelShort: 'F1b',
          labelLong: 'Access to advertising content policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386097',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 372,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F1b.1',
              description: 'Are the company’s advertising content policies easy to find?',
            },
            {
              labelShort: 'F1b.2',
              description:
                'Are the company’s advertising content policies available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'F1b.3',
              description: 'Are the company’s advertising content policies presented in an understandable manner?',
            },
            {
              labelShort: 'F1b.4',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it requires apps made available through its app store to provide users with an advertising content policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'F1b.5',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it requires skills made available through its skill store to provide users with an advertising content policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'F1c',
          labelLong: 'Access to advertising targeting policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386142',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 397,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F1c.1',
              description: 'Are the company’s advertising targeting policies easy to find?',
            },
            {
              labelShort: 'F1c.2',
              description:
                'Are the advertising targeting policies available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'F1c.3',
              description: 'Are the advertising targeting policies presented in an understandable manner?',
            },
            {
              labelShort: 'F1c.4',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it requires apps made available through its app store to provide users with an advertising targeting policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'F1c.5',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it requires skills made available through its skill store to provide users with an advertising targeting policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'F1d',
          labelLong: 'Access to algorithmic system use policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386200',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 422,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F1d.1',
              description: 'Are the company’s algorithmic system use policies easy to find?',
            },
            {
              labelShort: 'F1d.2',
              description:
                'Are the algorithmic system use policies available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'F1d.3',
              description: 'Are the algorithmic system use policies presented in an understandable manner?',
            },
          ],
        },
        {
          labelShort: 'F2a',
          labelLong: 'Changes to terms of service',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386236',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 441,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F2a.1',
              description:
                'Does the company clearly disclose that it directly notifies users about all changes to its terms of service?',
            },
            {
              labelShort: 'F2a.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'F2a.3',
              description:
                'Does the company clearly disclose the timeframe within which it directly notifies users of changes prior to these changes coming into effect?',
            },
            {
              labelShort: 'F2a.4',
              description: 'Does the company maintain a public archive or change log?',
            },
          ],
        },
        {
          labelShort: 'F2b',
          labelLong: 'Changes to advertising content policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386255',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 463,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F2b.1',
              description:
                'Does the company clearly disclose that it directly notifies users about changes to its advertising content policies?',
            },
            {
              labelShort: 'F2b.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'F2b.3',
              description:
                'Does the company clearly disclose the timeframe within which it directly notifies users of changes prior to these changes coming into effect?',
            },
            {
              labelShort: 'F2b.4',
              description: 'Does the company maintain a public archive or change log?',
            },
            {
              labelShort: 'F2b.5',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it requires apps made available through its app store to notify users when the apps change their advertising content policies?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'F2b.6',
              description:
                '(For personal digital ecosystems): Does the company clearly disclose that it requires skills made available through its skills store to notify users when the skills change their advertising content policies?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'F2c',
          labelLong: 'Changes to advertising targeting policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386270',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 491,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F2c.1',
              description:
                'Does the company clearly disclose that it directly notifies users about changes to its advertising targeting policies?',
            },
            {
              labelShort: 'F2c.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'F2c.3',
              description:
                'Does the company clearly disclose the timeframe within which it directly notifies users of changes prior to these changes coming into effect?',
            },
            {
              labelShort: 'F2c.4',
              description: 'Does the company maintain a public archive or change log?',
            },
            {
              labelShort: 'F2c.5',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it requires apps made available through its app store to directly notify users when the apps change their advertising targeting policies?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'F2c.6',
              description:
                '(For personal digital ecosystems): Does the company clearly disclose that it requires skills made available through its skills store to notify users when the skills change their advertising targeting policies?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'mobileEcosystem',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'F2d',
          labelLong: 'Changes to algorithmic system use policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386304',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 519,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F2d.1',
              description:
                'Does the company clearly disclose that it directly notifies users about changes to its algorithmic system use policies?',
            },
            {
              labelShort: 'F2d.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'F2d.3',
              description:
                'Does the company clearly disclose the timeframe within which it directly notifies users of changes prior to these changes coming into effect?',
            },
            {
              labelShort: 'F2d.4',
              description: 'Does the company maintain a public archive or change log?',
            },
          ],
        },
        {
          labelShort: 'F3a',
          labelLong: 'Process for terms of service enforcement',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445579',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 541,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F3a.1',
              description: 'Does the company clearly disclose what types of content or activities it does not permit?',
            },
            {
              labelShort: 'F3a.2',
              description: 'Does the company clearly disclose why it may restrict a user’s account?',
              doExcludeServices: true,
              excludeServices: ['search'],
            },
            {
              labelShort: 'F3a.3',
              description:
                'Does the company clearly disclose information about the processes it uses to identify content or accounts that violate the company’s rules?',
            },
            {
              labelShort: 'F3a.4',
              description:
                'Does the company clearly disclose how algorithmic systems are used to flag content that might violate the company’s rules?',
            },
            {
              labelShort: 'F3a.5',
              description:
                'Does the company clearly disclose whether any government authorities receive priority consideration when flagging content to be restricted for violating the company’s rules?',
              doExcludeServices: true,
              excludeServices: ['mobile', 'cloud', 'eCommerce', 'email'],
            },
            {
              labelShort: 'F3a.6',
              description:
                'Does the company clearly disclose whether any private entities receive priority consideration when flagging content to be restricted for violating the company’s rules?',
              doExcludeServices: true,
              excludeServices: ['mobile', 'cloud', 'eCommerce', 'email'],
            },
            {
              labelShort: 'F3a.7',
              description:
                'Does the company clearly disclose its process for enforcing its rules once violations are detected?',
            },
          ],
        },
        {
          labelShort: 'F3b',
          labelLong: 'Advertising content rules and enforcement',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445732',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 572,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F3b.1',
              description: 'Does the company clearly disclose what types of advertising content it does not permit?',
            },
            {
              labelShort: 'F3b.2',
              description:
                'Does the company clearly disclose whether it requires all advertising content be clearly labelled as such?',
            },
            {
              labelShort: 'F3b.3',
              description:
                'Does the company clearly disclose the processes and technologies it uses to identify advertising content or accounts that violate the company’s rules?',
            },
          ],
        },
        {
          labelShort: 'F3c',
          labelLong: 'Advertising targeting rules and enforcement',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445786',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 591,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F3c.1',
              description:
                'Does the company clearly disclose whether it enables third parties to target its users with advertising content?',
            },
            {
              labelShort: 'F3c.2',
              description: 'Does the company clearly disclose what types of targeting parameters are not permitted?',
            },
            {
              labelShort: 'F3c.3',
              description:
                'Does the company clearly disclose that it does not permit advertisers to target specific individuals?',
            },
            {
              labelShort: 'F3c.4',
              description:
                'Does the company clearly disclose that algorithmically generated advertising audience categories are evaluated by human reviewers before they can be used?',
            },
            {
              labelShort: 'F3c.5',
              description:
                'Does the company clearly disclose information about the processes and technologies it uses to identify advertising content or accounts that violate the company’s rules?',
            },
          ],
        },
        {
          labelShort: 'F4a',
          labelLong: 'Data about content restrictions to enforce terms of service',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445811',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 616,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F4a.1',
              description:
                'Does the company publish data about the total number of pieces of content restricted for violating the company´s rules?',
            },
            {
              labelShort: 'F4a.2',
              description:
                'Does the company publish data on the number of pieces of content restricted based on which rule was violated?',
            },
            {
              labelShort: 'F4a.3',
              description:
                'Does the company publish data on the number of pieces of content it restricted based on the format of content? (e.g. text, image, video, live video)?',
            },
            {
              labelShort: 'F4a.4',
              description:
                'Does the company publish data on the number of pieces of content it restricted based on the method used to identify the violation?',
            },
            {
              labelShort: 'F4a.5',
              description: 'Does the company publish this data at least four times a year?',
            },
            {
              labelShort: 'F4a.6',
              description: 'Can the data be exported as a structured data file?',
            },
          ],
        },
        {
          labelShort: 'F4b',
          labelLong: 'Data about account restrictions to enforce terms of service',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445866',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['search'],
          prevOutcomeIndyStartRow: 644,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F4b.1',
              description:
                'Does the company publish data on the total number of accounts restricted for violating the company’s own rules?',
            },
            {
              labelShort: 'F4b.2',
              description:
                'Does the company publish data on the number of accounts restricted based on which rule was violated?',
            },
            {
              labelShort: 'F4b.3',
              description:
                'Does the company publish data on the number of accounts restricted based on the method used to identify the violation?',
            },
            {
              labelShort: 'F4b.4',
              description: 'Does the company publish this data at least four times a year?',
            },
            {
              labelShort: 'F4b.5',
              description: 'Can the data be exported as a structured data file?',
            },
          ],
        },
        {
          labelShort: 'F4c',
          labelLong: 'Data about advertising content and ad targeting policy enforcement',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445916',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 669,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F4c.1',
              description:
                'Does the company publish the total number of advertisements it restricted to enforce its advertising content policies?',
            },
            {
              labelShort: 'F4c.2',
              description:
                'Does the company publish the number of advertisements it restricted based on which advertising content rule was violated?',
            },
            {
              labelShort: 'F4c.3',
              description:
                'Does the company publish the total number of advertisements it restricted to enforce its advertising targeting policies?',
            },
            {
              labelShort: 'F4c.4',
              description:
                'Does the company publish the number of advertisements it restricted based on which advertising targeting rule was violated?',
            },
            {
              labelShort: 'F4c.5',
              description: 'Does the company publish this data at least once a year?',
            },
            {
              labelShort: 'F4c.6',
              description: 'Can the data be exported as a structured data file?',
            },
          ],
        },
        {
          labelShort: 'F5a',
          labelLong: 'Process for responding to government demands to restrict content or accounts',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443013',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['email'],
          prevOutcomeIndyStartRow: 697,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F5a.1',
              description:
                'Does the company clearly disclose its process for responding to non-judicial government demands?',
            },
            {
              labelShort: 'F5a.2',
              description: 'Does the company clearly disclose its process for responding to court orders?',
            },
            {
              labelShort: 'F5a.3',
              description:
                'Does the company clearly disclose its process for responding to government demands from foreign jurisdictions?',
            },
            {
              labelShort: 'F5a.4',
              description:
                'Do the company’s explanations clearly disclose the legal basis under which it may comply with government demands?',
            },
            {
              labelShort: 'F5a.5',
              description:
                'Does the company clearly disclose that it carries out due diligence on government demands  before deciding how to respond?',
            },
            {
              labelShort: 'F5a.6',
              description:
                'Does the company commit to push back on inappropriate or overbroad demands made by governments?',
            },
            {
              labelShort: 'F5a.7',
              description:
                'Does the company provide clear guidance or examples of implementation of its process of responding to government demands?',
            },
          ],
        },
        {
          labelShort: 'F5b',
          labelLong: 'Process for responding to private requests for content or account restriction',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443020',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['email'],
          prevOutcomeIndyStartRow: 728,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F5b.1',
              description:
                'Does the company clearly disclose its process for responding to requests to remove, filter, or restrict content or accounts made through private processes?',
            },
            {
              labelShort: 'F5b.2',
              description:
                'Do the company’s explanations clearly disclose the basis under which it may comply with private requests made through private processes?',
            },
            {
              labelShort: 'F5b.3',
              description:
                'Does the company clearly disclose that it carries out due diligence on requests made through private processes before deciding how to respond?',
            },
            {
              labelShort: 'F5b.4',
              description:
                'Does the company commit to push back on inappropriate or overbroad requests made through private processes?',
            },
            {
              labelShort: 'F5b.5',
              description:
                'Does the company provide clear guidance or examples of implementation of its process of responding to requests made through private processes?',
            },
          ],
        },
        {
          labelShort: 'F6',
          labelLong: 'Data about government demands to restrict content and accounts',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443024',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['email'],
          prevOutcomeIndyStartRow: 753,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F6.1',
              description: 'Does the company break out the number of demands it receives by country?',
            },
            {
              labelShort: 'F6.2',
              description: 'Does the company list the number of accounts affected?',
              doExcludeServices: true,
              excludeServices: ['search'],
            },
            {
              labelShort: 'F6.3',
              description: 'Does the company list the number of pieces of content or URLs affected?',
              doExcludeServices: true,
              excludeServices: ['messagingVoip'],
            },
            {
              labelShort: 'F6.4',
              description:
                'Does the company list the types of subject matter associated with the demands  it receives?',
            },
            {
              labelShort: 'F6.5',
              description: 'Does the company list the number of demands that come from different legal authorities?',
            },
            {
              labelShort: 'F6.6',
              description:
                'Does the company list the number of demands it knowingly receives from government officials to restrict content or accounts through unofficial processes?',
            },
            {
              labelShort: 'F6.7',
              description: 'Does the company list the number of demands with which it complied?',
            },
            {
              labelShort: 'F6.8',
              description:
                'Does the company publish the original demands or disclose that it provides copies to a public third-party archive?',
            },
            {
              labelShort: 'F6.9',
              description: 'Does the company reports this data at least once a year?',
            },
            {
              labelShort: 'F6.10',
              description: 'Can the data be exported as a structured datafile?',
            },
          ],
        },
        {
          labelShort: 'F7',
          labelLong: 'Data about private requests for content or account restriction',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443028',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['email'],
          prevOutcomeIndyStartRow: 793,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F7.1',
              description:
                'Does the company break out the number of requests to restrict content or accounts that it receives through private processes?',
            },
            {
              labelShort: 'F7.2',
              description: 'Does the company list the number of accounts affected?',
              doExcludeServices: true,
              excludeServices: ['search'],
            },
            {
              labelShort: 'F7.3',
              description: 'Does the company list the number of pieces of content or URLs affected?',
              doExcludeServices: true,
              excludeServices: ['messagingVoip'],
            },
            {
              labelShort: 'F7.4',
              description: 'Does the company list the reasons for removal associated with the requests it receives?',
            },
            {
              labelShort: 'F7.5',
              description: 'Does the company clearly disclose the private processes that made the requests?',
            },
            {
              labelShort: 'F7.6',
              description: 'Does the company list the number of requests it complied with?',
            },
            {
              labelShort: 'F7.7',
              description:
                'Does the company publish the original requests or disclose that it provides copies to a public third-party archive?',
            },
            {
              labelShort: 'F7.8',
              description: 'Does the company report this data at least once a year?',
            },
            {
              labelShort: 'F7.9',
              description: 'Can the data be exported as a structured data file?',
            },
            {
              labelShort: 'F7.10',
              description:
                'Does the company clearly disclose that its reporting covers all types of requests that it receives through private processes?',
            },
          ],
        },
        {
          labelShort: 'F8',
          labelLong: 'User notification about content and account restriction',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445927',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 833,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F8.1',
              description:
                'If the company hosts user-generated content, does the company clearly disclose that it notifies users who generated the content when it is restricted?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: ['email', 'search'],
            },
            {
              labelShort: 'F8.2',
              description:
                'Does the company clearly disclose that it notifies users who attempt to access content that has been restricted?',
              doExcludeServices: true,
              excludeServices: ['email'],
            },
            {
              labelShort: 'F8.3',
              description:
                'In its notification, does the company clearly disclose a reason for the content restriction (legal or otherwise)?',
              doExcludeServices: true,
              excludeServices: ['email'],
            },
            {
              labelShort: 'F8.4',
              description: 'Does the company clearly disclose that it notifies users when it restricts their account?',
              doExcludeServices: true,
              excludeServices: ['search'],
            },
          ],
        },
        {
          labelShort: 'F9',
          labelLong: 'Network management (telecommunications companies)',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91361019',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['internet'],
          prevOutcomeIndyStartRow: 855,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F9.1',
              description:
                'Does the company clearly disclose a policy commitment to not prioritize, block, or delay certain types of traffic, applications, protocols, or content for reasons beyond assuring quality of service and reliability of the network?',
            },
            {
              labelShort: 'F9.2',
              description:
                'Does the company engage in practices, such as offering zero-rating programs, that prioritize network traffic for reasons beyond assuring quality of service and reliability of the network?',
              isReversedScoring: true,
            },
            {
              labelShort: 'F9.3',
              description:
                'If the company does engage in network prioritization practices beyond assuring quality of service and reliability of the network, does it clearly disclose its purpose for doing so?',
            },
          ],
        },
        {
          labelShort: 'F10',
          labelLong: 'Network shutdown (telecommunications companies)',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91361023',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['internet'],
          prevOutcomeIndyStartRow: 874,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F10.1',
              description:
                'Does the company clearly disclose the reason(s) why it may shut down service to a particular area or group of users?',
            },
            {
              labelShort: 'F10.2',
              description:
                'Does the company clearly disclose why it may restrict access to specific applications or protocols (e.g., VoIP, messaging) in a particular area or to a specific group of users?',
            },
            {
              labelShort: 'F10.3',
              description:
                'Does the company clearly disclose its process for responding to government demands to shut down a network or restrict access to a service?',
            },
            {
              labelShort: 'F10.4',
              description:
                'Does the company clearly disclose a commitment to push back on government demands to shut down a network or restrict access to a service?',
            },
            {
              labelShort: 'F10.5',
              description:
                'Does the company clearly disclose that it notifies users directly when it shuts down a network or restricts access to a service?',
            },
            {
              labelShort: 'F10.6',
              description: 'Does the company clearly disclose the number of network shutdown demands it receives?',
            },
            {
              labelShort: 'F10.7',
              description: 'Does the company clearly disclose the specific legal authority that makes the demands?',
            },
            {
              labelShort: 'F10.8',
              description: 'Does the company clearly disclose the number of government demands with which it complied?',
            },
          ],
        },
        {
          labelShort: 'F11',
          labelLong: 'Identity policy',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91386349',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['search', 'broadband'],
          prevOutcomeIndyStartRow: 908,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F11.1',
              description:
                'Does the company require users to verify their identity with their government-issued identification, or with other forms of identification that could be connected to their offline identity?',
              isReversedScoring: true,
            },
          ],
        },
        {
          labelShort: 'F12',
          labelLong: 'Algorithmic content curation, recommendation, and/or ranking systems',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445943',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['telecom'],
          prevOutcomeIndyStartRow: 921,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F12.1',
              description:
                'Does the company clearly disclose whether it uses algorithmic systems to curate, recommend, and/or rank the content that users can access through its platform?',
            },
            {
              labelShort: 'F12.2',
              description:
                'Does the company clearly disclose how the algorithmic systems are deployed to curate, recommend, and/or rank content, including the variables that influence these systems?',
            },
            {
              labelShort: 'F12.3',
              description:
                'Does the company clearly disclose what options users have to control the variables that the algorithmic content curation, recommendation, and/or ranking system takes into account?',
            },
            {
              labelShort: 'F12.4',
              description:
                'Does the company clearly disclose whether algorithmic systems are used to automatically curate, recommend, and/or rank content by default?',
            },
            {
              labelShort: 'F12.5',
              description:
                'Does the company clearly disclose that users can opt in to automated content curation, recommendation, and/or ranking systems?',
            },
          ],
        },
        {
          labelShort: 'F13',
          labelLong: 'Automated software agents (“bots”)',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445954',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['telecom'],
          prevOutcomeIndyStartRow: 946,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'F13.1',
              description: 'Does the company clearly disclose rules governing the use of bots on its platform?',
            },
            {
              labelShort: 'F13.2',
              description:
                'Does the company clearly disclose that it requires users to clearly label all content and accounts that are produced, disseminated or operated with the assistance of a bot?',
            },
            {
              labelShort: 'F13.3',
              description: 'Does the company clearly disclose its process for enforcing its bot policy?',
            },
            {
              labelShort: 'F13.4',
              description:
                'Does the company clearly disclose data on the volume and nature of user content and accounts restricted for violating the company’s bot policy?',
            },
          ],
        },
      ],
    },
    {
      labelShort: 'P',
      labelLong: 'Privacy',
      description:
        'Indicators in this category seek evidence that in its disclosed policies and practices, the company demonstrates concrete ways in which it respects the right to privacy of users, as articulated in the Universal Declaration of Human Rights, the International Covenant on Civil and Political Rights and other international human rights instruments. The company’s disclosed policies and practices demonstrate how it works to avoid contributing to actions that may interfere with users’ privacy, except where such actions are lawful, proportionate and for a justifiable purpose. They will also demonstrate a strong commitment to protect and defend users’ digital security. Companies that perform well on these indicators demonstrate a strong public commitment to transparency not only in terms of how they respond to government and others’ demands, but also how they determine, communicate, and enforce private rules and commercial practices that affect users’ privacy.',
      researchGuidance: 'TBD',
      classColor: '#dd7e6b',
      indicators: [
        {
          labelShort: 'P1a',
          labelLong: 'Access to privacy policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91418361',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 968,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P1a.1',
              description: 'Are the company’s privacy policies easy to find?',
            },
            {
              labelShort: 'P1a.2',
              description:
                'Are the privacy policies available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'P1a.3',
              description: 'Are the policies presented in an understandable manner?',
            },
            {
              labelShort: 'P1a.4',
              description:
                '(For mobile ecosystems): Does the company disclose that it requires apps made available through its app store to provide users with a privacy policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P1a.5',
              description:
                '(For personal digital assistant ecosystems): Does the company disclose that it requires skills made available through its skill store to provide users with a privacy policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P1b',
          labelLong: 'Access to algorithmic system development policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91418539',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 993,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P1b.1',
              description: 'Are the company’s algorithmic system development policies easy to find?',
            },
            {
              labelShort: 'P1b.2',
              description:
                'Are the algorithmic system development policies available in the primary language(s) spoken by users in the company’s home jurisdiction?',
            },
            {
              labelShort: 'P1b.3',
              description: 'Are the algorithmic system development policies presented in an understandable manner?',
            },
          ],
        },
        {
          labelShort: 'P2a',
          labelLong: 'Changes to privacy policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91418750',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1012,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P2a.1',
              description:
                'Does the company clearly disclose  that it directly notifies users about all changes to its privacy policies?',
            },
            {
              labelShort: 'P2a.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'P2a.3',
              description:
                'Does the company clearly disclose the timeframe within which it directly notifies users of changes prior to these changes coming into effect?',
            },
            {
              labelShort: 'P2a.4',
              description: 'Does the company maintain a public archive or change log?',
            },
            {
              labelShort: 'P2a.5',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it requires apps sold through its app store to notify users when the app changes its privacy policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P2a.6',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it requires skills sold through its skill store to notify users when the skill changes its privacy policy?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P2b',
          labelLong: 'Changes to algorithmic system development policies',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91418935',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1040,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P2b.1',
              description:
                'Does the company clearly disclose that it directly notifies users about all changes to its algorithmic system development policies?',
            },
            {
              labelShort: 'P2b.2',
              description: 'Does the company clearly disclose how it will directly notify users of changes?',
            },
            {
              labelShort: 'P2b.3',
              description:
                'Does the company clearly disclose the time frame within which it directly notifies users of changes notification prior to these changes coming into effect?',
            },
            {
              labelShort: 'P2b.4',
              description: 'Does the company maintain a public archive or change log?',
            },
          ],
        },
        {
          labelShort: 'P3a',
          labelLong: 'Collection of user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443032',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1062,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P3a.1',
              description: 'Does the company clearly disclose what types of user information it collects?',
            },
            {
              labelShort: 'P3a.2',
              description:
                'For each type of user information the company collects, does the company clearly disclose how it collects that user information?',
            },
            {
              labelShort: 'P3a.3',
              description:
                'Does the company clearly disclose  that it limits collection of user information to what is directly relevant and necessary to accomplish the purpose of its service?',
            },
            {
              labelShort: 'P3a.4',
              description:
                '(For mobile ecosystems): Does the company clearly disclose  that it evaluates whether the privacy policies of third-party apps made available through its app store disclose what user information the apps collect?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P3a.5',
              description:
                '(For mobile ecosystems): Does the company clearly disclose  that it evaluates whether third-party apps made available through its app store limit collection of user information to what is directly relevant and necessary to accomplish the purpose of the app?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P3a.6',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party skills made available through its skill store disclose what user information the skills collects?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P3a.7',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether third-party skills made available through its skill store limit collection of user information to what is directly relevant and necessary to accomplish the purpose of the skill?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P3b',
          labelLong: 'Inference of user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443036',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1093,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P3b.1',
              description:
                'Does the company clearly disclose all the types of user information it infers on the basis of collected user information?',
            },
            {
              labelShort: 'P3b.2',
              description:
                'For each type of user information the company infers, does the company clearly disclose how it infers that user information?',
            },
            {
              labelShort: 'P3b.3',
              description:
                'Does the company clearly disclose that it limits inference of user information to what is directly relevant and necessary to accomplish the purpose of its service?',
            },
          ],
        },
        {
          labelShort: 'P4',
          labelLong: 'Sharing of user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443088',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1112,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P4.1',
              description:
                'For each type of user information the company collects, does the company clearly disclose whether it shares that user information?',
            },
            {
              labelShort: 'P4.2',
              description:
                'For each type of user information the company shares, does the company clearly disclose the types of third parties with which it shares that user information?',
            },
            {
              labelShort: 'P4.3',
              description:
                'Does the company clearly disclose that it may share user information with government(s) or legal authorities?',
            },
            {
              labelShort: 'P4.4',
              description:
                'For each type of user information the company shares, does the company clearly disclose the names of all third parties with which it shares user information?',
            },
            {
              labelShort: 'P4.5',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third party apps made available through its app store disclose what user information the apps share?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P4.6',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third party apps made available through its app store disclose the types of third parties with whom they share user information?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P4.7',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third party skills made available through its skill store disclose what user information the skills share?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P4.8',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third party skills made available through its skill store disclose the types of third parties with whom they share user information?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P5',
          labelLong: 'Purpose for collecting, inferring, and sharing user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443093',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1146,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P5.1',
              description:
                'For each type of user information the company collects, does the company clearly disclose its purpose for collection?',
            },
            {
              labelShort: 'P5.2',
              description:
                'For each type of user information the company infers, does the company clearly disclose its purpose for the inference?',
            },
            {
              labelShort: 'P5.3',
              description:
                'Does the company clearly disclose whether it combines user information from various company services and if so, why?',
            },
            {
              labelShort: 'P5.4',
              description:
                'For each type of user information the company shares, does the company clearly disclose its purpose for sharing?',
            },
            {
              labelShort: 'P5.5',
              description:
                'Does the company clearly disclose that it limits its use of user information to the purpose for which it was collected or inferred?',
            },
          ],
        },
        {
          labelShort: 'P6',
          labelLong: 'Retention of user informations',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443103',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1171,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P6.1',
              description:
                'For each type of user information the company collects, does the company clearly disclose how long it retains that user information?',
            },
            {
              labelShort: 'P6.2',
              description: 'Does the company clearly disclose what de-identified user information it retains?',
            },
            {
              labelShort: 'P6.3',
              description: 'Does the company clearly disclose the process for de-identifying user information?',
            },
            {
              labelShort: 'P6.4',
              description:
                'Does the company clearly disclose that it deletes all user information after users terminate their account?',
            },
            {
              labelShort: 'P6.5',
              description:
                'Does the company clearly disclose the time frame in which it will delete user information after users terminate their account?',
            },
            {
              labelShort: 'P6.6',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store disclose how long they retains user information?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P6.7',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store state that all user information is deleted when users terminate their accounts or delete the app?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P6.8',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party skills made available through its skill store disclose how long they retain user information?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P6.9',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party skills made available through its skill store state that all user information is deleted when users terminate their accounts or delete the skill?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P7',
          labelLong: 'Users’ control over their own user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443107',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1208,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P7.1',
              description:
                'For each type of user information the company collects, does the company clearly disclose whether users can control the company’s collection of this user information?',
            },
            {
              labelShort: 'P7.2',
              description:
                'For each type of user information the company collects, does the company clearly disclose whether users can delete this user information?',
            },
            {
              labelShort: 'P7.3',
              description:
                'For each type of user information the company infers on the basis of collected information, does the company clearly disclose whether users can control if the company can attempt to infer this user information?',
            },
            {
              labelShort: 'P7.4',
              description:
                'For each type of user information the company infers on the basis of collected information, does the company clearly disclose whether users can delete this user information?',
            },
            {
              labelShort: 'P7.5',
              description:
                'Does the company clearly disclose that it provides users with options to control how their user information is used for targeted advertising?',
            },
            {
              labelShort: 'P7.6',
              description: 'Does the company clearly disclose that targeted advertising is off by default?',
            },
            {
              labelShort: 'P7.7',
              description:
                'Does the company clearly disclose that it provides users with options to control how their user information is used for the development of algorithmic systems?',
            },
            {
              labelShort: 'P7.8',
              description:
                'Does the company clearly disclose whether it uses user information to develop algorithmic systems by default, or not?',
            },
            {
              labelShort: 'P7.9',
              description:
                '(For mobile ecosystems and personal digital assistant ecosystems): Does the company clearly disclose that it provides users with options to control the device’s geolocation functions?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P8',
          labelLong: 'Users’ access to their own user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443110',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1245,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P8.1',
              description: 'Does the company clearly disclose that users can obtain a copy of their user information?',
            },
            {
              labelShort: 'P8.2',
              description: 'Does the company clearly disclose what user information users can obtain?',
            },
            {
              labelShort: 'P8.3',
              description:
                'Does the company clearly disclose that users can obtain their user information in a structured data format?',
            },
            {
              labelShort: 'P8.4',
              description:
                'Does the company clearly disclose that users can obtain all public-facing and private user information a company holds about them?',
            },
            {
              labelShort: 'P8.5',
              description:
                'Does the company clearly disclose that users can access the list of advertising audience categories to which the company has assigned them?',
            },
            {
              labelShort: 'P8.6',
              description:
                'Does the company clearly disclose that users can obtain all the information that a company has inferred about them?',
            },
            {
              labelShort: 'P8.7',
              description:
                '(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store disclose that users can obtain all of the user information about them the app holds?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'pda',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P8.8',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party skills made available through its skill store disclose that users can obtain all of the user information about them the skill holds?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P9',
          labelLong: 'Collection of user information from third parties',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443111',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1279,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P9.1',
              description:
                '(For digital platforms) Does the company clearly disclose what user information it collects from third-party websites through technical means?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
            },
            {
              labelShort: 'P9.2',
              description:
                '(For digital platforms) Does the company clearly explain how it collects user information from third parties through technical means?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
            },
            {
              labelShort: 'P9.3',
              description:
                '(For digital platforms) Does the company clearly disclose its purpose for collecting user information from third parties through technical means?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
            },
            {
              labelShort: 'P9.4',
              description:
                '(For digital platforms) Does the company clearly disclose how long it retains the user information it collects from third parties through technical means?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
            },
            {
              labelShort: 'P9.5',
              description:
                '(For digital platforms) Does the company clearly disclose that it respects user-generated signals to opt-out of data collection?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
            },
            {
              labelShort: 'P9.6',
              description:
                'Does the company clearly disclose what user information it collects from third-parties through non-technical means?',
            },
            {
              labelShort: 'P9.7',
              description:
                'Does the company clearly explain how it collects user information from third parties through non-technical means?',
            },
            {
              labelShort: 'P9.8',
              description:
                'Does the company clearly disclose its purpose for collecting user information from third parties through non-technical means?',
            },
            {
              labelShort: 'P9.9',
              description:
                'Does the company clearly disclose how long it retains the user information it collects from third parties through non-technical means?',
            },
          ],
        },
        {
          labelShort: 'P10a',
          labelLong: 'Process for responding to government demands for user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443121',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1316,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P10a.1',
              description:
                'Does the company clearly disclose its process for responding to non-judicial government demands?',
            },
            {
              labelShort: 'P10a.2',
              description: 'Does the company clearly disclose its process for responding to court orders?',
            },
            {
              labelShort: 'P10a.3',
              description:
                'Does the company clearly disclose its process for responding to government demands from foreign jurisdictions?',
            },
            {
              labelShort: 'P10a.4',
              description:
                'Do the company’s explanations clearly disclose the legal basis under which it may comply with government demands?',
            },
            {
              labelShort: 'P10a.5',
              description:
                'Does the company clearly disclose that it carries out due diligence on government demands before deciding how to respond?',
            },
            {
              labelShort: 'P10a.6',
              description: 'Does the company commit to push back on inappropriate or overbroad government demands?',
            },
            {
              labelShort: 'P10a.7',
              description:
                'Does the company provide clear guidance or examples of implementation of its process for government demands?',
            },
          ],
        },
        {
          labelShort: 'P10b',
          labelLong: 'Process for responding to private requests for user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443123',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1347,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P10b.1',
              description:
                'Does the company clearly disclose its process for responding to requests made through private processes?',
            },
            {
              labelShort: 'P10b.2',
              description:
                'Do the company’s explanations clearly disclose the basis under which it may comply with requests made through private processes?',
            },
            {
              labelShort: 'P10b.3',
              description:
                'Does the company clearly disclose that it carries out due diligence on requests made through private processes before deciding how to respond?',
            },
            {
              labelShort: 'P10b.4',
              description:
                'Does the company commit to push back on inappropriate or overbroad requests made through private processes?',
            },
            {
              labelShort: 'P10b.5',
              description:
                'Does the company provide clear guidance or examples of implementation of its process of responding to requests made through private processes?',
            },
          ],
        },
        {
          labelShort: 'P11a',
          labelLong: 'Data about government requests for user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443127',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1372,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P11a.1',
              description: 'Does the company list the number of government demands it receives by country?',
            },
            {
              labelShort: 'P11a.2',
              description:
                'Does the company list the number of government demands it receives for stored user information and for real-time communications access?',
            },
            {
              labelShort: 'P11a.3',
              description: 'Does the company list the number of accounts affected?',
            },
            {
              labelShort: 'P11a.4',
              description:
                'Does the company list whether a demand sought communications content or non-content or both?',
            },
            {
              labelShort: 'P11a.5',
              description:
                'Does the company identify the specific legal authority or type of legal process through which law enforcement and national security demands are made?',
            },
            {
              labelShort: 'P11a.6',
              description: 'Does the company include government demands that come from court orders?',
            },
            {
              labelShort: 'P11a.7',
              description:
                'Does the company list the number of government demands it complied with, broken down by category of demand?',
            },
            {
              labelShort: 'P11a.8',
              description:
                'Does the company list what types of government demands it is prohibited by law from disclosing?',
            },
            {
              labelShort: 'P11a.9',
              description: 'Does the company report this data at least once per year?',
            },
            {
              labelShort: 'P11a.10',
              description: 'Can the data reported by the company be exported as a structured data file?',
            },
          ],
        },
        {
          labelShort: 'P11b',
          labelLong: 'Data about private requests for user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91443129',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1412,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P11b.1',
              description:
                'Does the company list the number of requests it receives for user information that come through private processes?',
            },
            {
              labelShort: 'P11b.2',
              description:
                'Does the company list the number of requests for user information that come through private processes with which it complied?',
            },
            {
              labelShort: 'P11b.3',
              description: 'Does the company report this data at least once per year?',
            },
            {
              labelShort: 'P11b.4',
              description: 'Can the data reported by the company be exported as a structured data file?',
            },
          ],
        },
        {
          labelShort: 'P12',
          labelLong: 'User notification about third-party requests for user information',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91493864',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1434,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P12.1',
              description:
                'Does the company clearly disclose that it notifies users when government entities (including courts or other judicial bodies) request their user information?',
            },
            {
              labelShort: 'P12.2',
              description:
                'Does the company clearly disclose that it notifies users when they receive requests their user information through private processes?',
            },
            {
              labelShort: 'P12.3',
              description:
                'Does the company clearly disclose situations when it might not notify users, including a description of the types of government requests it is prohibited by law from disclosing to users?',
            },
          ],
        },
        {
          labelShort: 'P13',
          labelLong: 'Security oversight',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445974',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1453,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P13.1',
              description:
                'Does the company clearly disclose that it has systems in place to limit and monitor employee access to user information?',
            },
            {
              labelShort: 'P13.2',
              description:
                'Does the company clearly disclose that it has a security team that conducts security audits on the company’s products and services?',
            },
            {
              labelShort: 'P13.3',
              description:
                'Does the company clearly disclose that it commissions third-party security audits on its products and services?',
            },
          ],
        },
        {
          labelShort: 'P14',
          labelLong: 'Addressing security vulnerabilities',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91445987',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1472,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P14.1',
              description:
                'Does the company clearly disclose that it has a mechanism through which security researchers can submit vulnerabilities they discover?',
            },
            {
              labelShort: 'P14.2',
              description:
                'Does the company clearly disclose the timeframe in which it will review reports of vulnerabilities?',
            },
            {
              labelShort: 'P14.3',
              description:
                'Does the company commit not to pursue legal action against researchers who report vulnerabilities within the terms of the company’s reporting mechanism?',
            },
            {
              labelShort: 'P14.4',
              description:
                '(For mobile ecosystems and personal digital assistant ecosystems) Does the company clearly disclose that software updates, security patches, add-ons, or extensions are downloaded over an encrypted channel?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.5',
              description:
                '(For mobile ecosystems and telecommunications companies) Does the company clearly disclose what, if any, modifications it has made to a mobile operating system?',
              doExcludeServices: true,
              excludeServices: [
                'broadband',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'pda',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.6',
              description:
                '(For mobile ecosystems, personal digital assistant ecosystems, and telecommunications companies) Does the company clearly disclose what, if any, effect such modifications have on the company’s ability to send security updates to users?',
              doExcludeServices: true,
              excludeServices: [
                'broadband',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.7',
              description:
                '(For mobile ecosystems and personal digital assistant ecosystems) Does the company clearly disclose the date through which it will continue to provide security updates for the device/OS?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.8',
              description:
                '(For mobile ecosystems and personal digital assistant ecosystems) Does the company commit to provide security updates for the operating system and other critical software for a minimum of five years after release?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.9',
              description:
                '(For mobile ecosystems, personal digital assistant ecosystems, and telecommunications companies) If the company uses an operating system adapted from an existing system, does the company commit to provide security patches within one month of a vulnerability being announced to the public?',
              doExcludeServices: true,
              excludeServices: [
                'broadband',
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.10',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose what, if any, modifications it has made to a personal digital assistant operating system?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
            {
              labelShort: 'P14.11',
              description:
                '(For personal digital assistant ecosystems): Does the company clearly disclose what, if any, effect such modifications have on the company’s ability to send security updates to users?',
              doExcludeCompanies: true,
              excludeCompanies: ['telecom'],
              doExcludeServices: true,
              excludeServices: [
                'search',
                'email',
                'messagingVoip',
                'cloud',
                'eCommerce',
                'socialNetworkBlogs',
                'photoVideo',
              ],
            },
          ],
        },
        {
          labelShort: 'P15',
          labelLong: 'Data breaches',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91446006',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1515,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P15.1',
              description:
                'Does the company clearly disclose that it will notify the relevant authorities without undue delay when a data breach occurs?',
            },
            {
              labelShort: 'P15.2',
              description:
                'Does the company clearly disclose its process for notifying data subjects who might be affected by a data breach?',
            },
            {
              labelShort: 'P15.3',
              description:
                'Does the company clearly disclose what kinds of steps it will take to address the impact of a data breach on its users?',
            },
          ],
        },
        {
          labelShort: 'P16',
          labelLong: 'Encryption of user communication and private content (digital platforms)',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91446018',
          scoringScope: 'services',
          doExcludeCompanies: true,
          excludeCompanies: ['telecom'],
          prevOutcomeIndyStartRow: 1534,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P16.1',
              description:
                'Does the company clearly disclose that the transmission of user communications is encrypted by default?',
            },
            {
              labelShort: 'P16.2',
              description:
                'Does the company clearly disclose that transmissions of user communications are encrypted using unique keys?',
            },
            {
              labelShort: 'P16.3',
              description:
                'Does the company clearly disclose that users can secure their private content using end-to-end encryption, or full-disk encryption (where applicable)?',
            },
            {
              labelShort: 'P16.4',
              description:
                'Does the company clearly disclose that end-to-end encryption, or full-disk encryption, is enabled by default?',
            },
          ],
        },
        {
          labelShort: 'P17',
          labelLong: 'Account Security (digital platforms)',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91446030',
          scoringScope: 'services',
          doExcludeServices: true,
          excludeServices: ['search'],
          doExcludeCompanies: true,
          excludeCompanies: ['telecom'],
          prevOutcomeIndyStartRow: 1556,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P17.1',
              description:
                'Does the company clearly disclose that it deploys advanced authentication methods to prevent fraudulent access?',
            },
            {
              labelShort: 'P17.2',
              description: 'Does the company clearly disclose that users can view their recent account activity?',
            },
            {
              labelShort: 'P17.3',
              description:
                'Does the company clearly disclose that it notifies users about unusual account activity and possible unauthorized access to their accounts?',
            },
          ],
        },
        {
          labelShort: 'P18',
          labelLong: 'Inform and educate users about potential risks',
          description: '',
          researchGuidance: 'https://basecamp.com/2161726/projects/17361333/messages/91446044',
          scoringScope: 'services',
          prevOutcomeIndyStartRow: 1575,
          isIndicatorUnchanged: true,
          elements: [
            {
              labelShort: 'P18.1',
              description:
                'Does the company publish practical materials that educate users on how to protect themselves from cybersecurity risks relevant to their products or services?',
            },
          ],
        },
      ],
    },
  ],
}
