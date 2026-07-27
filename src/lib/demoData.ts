import { lexicalFromParagraphs } from "@/lib/richText";

export const demoTopics = [
  {
    id: "topic-work",
    name: "Work and Management",
    slug: "work-and-management",
    shortDescription:
      "How institutions organize, measure, promote, and discipline work.",
  },
  {
    id: "topic-government",
    name: "Government and Policy",
    slug: "government-and-policy",
    shortDescription:
      "What policy looks like when it reaches public counters and back offices.",
  },
  {
    id: "topic-business",
    name: "Business and Industry",
    slug: "business-and-industry",
    shortDescription:
      "Operational knowledge from inside markets, suppliers, and management systems.",
  },
  {
    id: "topic-technology",
    name: "Technology and Science",
    slug: "technology-and-science",
    shortDescription:
      "How technical systems are bought, managed, and actually used.",
  },
  {
    id: "topic-health",
    name: "Health and Society",
    slug: "health-and-society",
    shortDescription:
      "Institutional life in care systems, education, and social services.",
  },
  {
    id: "topic-economy",
    name: "Economy and Place",
    slug: "economy-and-place",
    shortDescription:
      "Local systems, budgets, infrastructure, and the work hidden inside them.",
  },
];

export const demoTags = [
  { id: "tag-metrics", name: "Metrics", slug: "metrics" },
  { id: "tag-procurement", name: "Procurement", slug: "procurement" },
  { id: "tag-verification", name: "Verification", slug: "verification" },
  { id: "tag-management", name: "Management", slug: "management" },
  { id: "tag-public-service", name: "Public service", slug: "public-service" },
  { id: "tag-operations", name: "Operations", slug: "operations" },
];

export const demoBylines = [
  {
    id: "byline-lena-ortiz",
    authorshipType: "named",
    displayName: "Lena Ortiz",
    shortBiography:
      "Lena Ortiz writes about public administration and operational design.",
  },
  {
    id: "byline-marcus-reed",
    authorshipType: "named",
    displayName: "Marcus Reed",
    shortBiography:
      "Marcus Reed is a fictional labor economist focused on institutional incentives.",
  },
  {
    id: "byline-dr-elaine-park",
    authorshipType: "named",
    displayName: "Dr. Elaine Park",
    shortBiography:
      "Elaine Park is a fictional policy researcher studying service delivery.",
  },
  {
    id: "byline-customer-support",
    authorshipType: "verified-anonymous",
    displayName: "a customer-support specialist",
    shortBiography: "The author works in a large customer-support operation.",
    verificationWording:
      "Publius verified the author's identity, employment, and direct knowledge of the support workflow described.",
  },
  {
    id: "byline-federal-contractor",
    authorshipType: "verified-anonymous",
    displayName: "a current federal contractor",
    shortBiography:
      "The author supports a fictional federal technology program.",
    verificationWording:
      "Publius verified the author's identity, contracting role, and direct access to the processes described.",
  },
  {
    id: "byline-hospital-ops",
    authorshipType: "verified-anonymous",
    displayName: "a hospital operations employee",
    shortBiography:
      "The author works in hospital operations for a fictional regional system.",
    verificationWording:
      "Publius verified the author's identity, employment, and direct knowledge of staffing dashboards.",
  },
  {
    id: "byline-warehouse-manager",
    authorshipType: "verified-anonymous",
    displayName: "a warehouse automation supervisor",
    shortBiography:
      "The author supervises teams using automated warehouse tools.",
    verificationWording:
      "Publius verified the author's identity, role, and direct operational knowledge.",
  },
  {
    id: "byline-benefits-admin",
    authorshipType: "verified-anonymous",
    displayName: "a former state benefits administrator",
    shortBiography:
      "The author previously processed benefits applications in a fictional state agency.",
    verificationWording:
      "Publius verified the author's prior employment and reviewed supporting process records.",
  },
  {
    id: "byline-promotion-engineer",
    authorshipType: "verified-anonymous",
    displayName: "an engineer at a major technology company",
    shortBiography:
      "The author works at a large fictional technology employer.",
    verificationWording:
      "Publius verified the author's identity and current role while generalizing nonmaterial details.",
  },
];

const paragraphs = {
  metrics: [
    "The easiest ticket to close is often the one that should not have existed. A customer writes in after a confusing automated email, a missing status update, or a policy page written for lawyers rather than people trying to solve a problem during lunch.",
    "Inside the queue, the system treats each contact as a unit of effort. It does not ask whether the employee prevented a second contact, explained a complicated tradeoff clearly, or noticed that one broken template was creating hundreds of anxious messages.",
    "The result is an operation that can look efficient while teaching employees to avoid the complicated cases that would most improve trust.",
  ],
  benefits: [
    "Most delays in a benefits application are not dramatic. They are usually a quiet series of waits between systems that do not share responsibility for the same outcome.",
    "A five-minute review can sit untouched for weeks because the case is waiting for a queue owner, a required code, or a document label that another unit has to change before anyone is allowed to move forward.",
    "Applicants experience one agency. Employees experience several systems with different deadlines, supervisors, and definitions of completion.",
  ],
  hospital: [
    "The staffing dashboard turns the hospital into a clean grid of ratios and thresholds. On paper, a unit is either inside or outside the desired range.",
    "The work itself is less tidy. Two patients can require different amounts of attention while counting the same in a staffing cell. A discharge that looks routine in the dashboard can occupy several employees for an hour.",
    "The dashboard is useful, but it becomes dangerous when leaders confuse a measurement of coverage with a measurement of care.",
  ],
  warehouse: [
    "Senior leaders see warehouse automation as a system of machines, scans, and throughput. Supervisors see a negotiation between software assumptions and the physical reality of tired people moving through narrow spaces.",
    "When the model is wrong, employees do not stop the system. They build informal workarounds that keep the day moving and keep the dashboard green.",
    "Those workarounds are operational knowledge. Treating them as resistance means missing the only reliable evidence that the system needs redesign.",
  ],
  procurement: [
    "Agencies do not buy obsolete software because no one knows better. They often buy it because the procurement path rewards certainty, prior approval, and requirements that can be scored more easily than systems can be improved.",
    "A vendor with a familiar compliance packet can beat a better tool that asks the agency to rethink its workflow. The old tool arrives with safer paperwork.",
    "This is not only a technology problem. It is a governance problem hidden in procurement language.",
  ],
  promotion: [
    "Promotion systems often claim to reward impact. In practice, they frequently reward visibility: the meetings someone is invited to, the narrative a manager can repeat, and the projects legible to senior reviewers.",
    "Institutional knowledge is harder to package. The person who prevents a failure may leave no artifact except the absence of a crisis.",
    "Organizations that cannot see maintenance work eventually learn to call preventable failures surprising.",
  ],
  permitting: [
    "Permitting reform usually begins with a policy memo and a promise to reduce unnecessary delay. The memo is often right about the problem and wrong about where the problem lives.",
    "At the service counter, staff are reconciling local rules, legacy software, incomplete applications, and public expectations shaped by language the agency itself published.",
    "Reform fails when it treats the counter as the site of delay rather than the place where upstream ambiguity finally becomes visible.",
  ],
  ai: [
    "Artificial-intelligence pilots usually arrive with a slide deck about efficiency. Employees encounter them as another system that must be checked, corrected, explained, and defended.",
    "The tool may save time on a narrow task while creating new work around exceptions, appeals, and accountability. A pilot can look successful when the hidden work is absorbed by employees already expected to adapt.",
    "The question is not whether these tools can help. The question is whether institutions will measure the work they create as carefully as the work they promise to remove.",
  ],
  staffing: [
    "Not every institutional failure is a staffing problem. Sometimes adding people to a broken process only increases the number of employees forced to manage contradictions.",
    "Staffing matters, but it can become a universal explanation that protects leaders from examining policy design, software procurement, incentives, and authority.",
    "The stronger question is what work the institution is asking people to perform, and whether that work is coherent.",
  ],
  managerResponse: [
    "Performance metrics persist because managers need a way to see operations they cannot personally observe. The problem is not measurement itself.",
    "The problem is what happens when a measurement becomes safer to defend than the truth employees are reporting from the floor.",
    "A good metric should start a conversation. A bad one ends it.",
  ],
  anonymousSourcing: [
    "Anonymous sourcing at Publius begins with a reason. Anonymity is not a style choice or a shortcut around verification.",
    "Editors should normally know who the contributor is. The public may see an occupational byline only after editors verify identity, role, and direct knowledge while minimizing details that could identify the contributor unnecessarily.",
    "The process cannot promise absolute anonymity. It can reduce unnecessary exposure and keep source-identifying information out of public editorial systems.",
  ],
  employeeVerification: [
    "Verifying an employee's account is not the same as accepting every interpretation the employee offers.",
    "Verification asks several narrower questions: Does this person hold the role described? Did they directly observe the process? Are there records or additional sources that support the account? Are material details being generalized for safety without changing the meaning?",
    "That standard makes anonymous accounts harder to publish, not easier.",
  ],
};

export const demoArticles = [
  {
    id: "article-metrics",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.metrics),
    essentialReadingEligible: true,
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[3],
    publicHeadline:
      "Our Customer-Service Metrics Punish Employees for Solving Difficult Problems",
    publicationDate: "2026-07-22T14:00:00.000Z",
    slug: "customer-service-metrics-punish-solving-difficult-problems",
    subtitle:
      "A support specialist explains how efficiency dashboards can reward avoidance.",
    tags: [demoTags[0], demoTags[5]],
    verificationIndicators: [
      "identity-verified",
      "employment-verified",
      "direct-knowledge-verified",
    ],
    verificationStatement:
      "The author currently works in the operation described. Publius verified the author's identity, employment, and direct knowledge of the relevant processes. Certain nonmaterial details have been generalized to reduce the risk of identification.",
  },
  {
    id: "article-benefits",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.benefits),
    essentialReadingEligible: true,
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[1],
    publicByline: demoBylines[7],
    publicHeadline:
      "Why Benefits Applications Spend Weeks Waiting for a Five-Minute Review",
    publicationDate: "2026-07-20T14:00:00.000Z",
    slug: "benefits-applications-five-minute-review",
    subtitle:
      "The delay is often between systems, not inside the review itself.",
    tags: [demoTags[4], demoTags[5]],
    verificationIndicators: [
      "identity-verified",
      "role-verified",
      "supporting-records-reviewed",
    ],
    verificationStatement:
      "Publius verified the author's former role and reviewed generic process records that support the account.",
  },
  {
    id: "article-hospital-dashboard",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.hospital),
    essentialReadingEligible: true,
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[4],
    publicByline: demoBylines[5],
    publicHeadline:
      "The Hospital Staffing Dashboard Does Not Measure the Work Patients Actually Need",
    publicationDate: "2026-07-17T14:00:00.000Z",
    slug: "hospital-staffing-dashboard-work-patients-need",
    subtitle: "Coverage ratios can obscure the invisible labor of care.",
    tags: [demoTags[0], demoTags[5]],
    verificationIndicators: [
      "identity-verified",
      "employment-verified",
      "direct-knowledge-verified",
    ],
    verificationStatement:
      "Publius verified the author's employment and direct knowledge of staffing tools used in the fictionalized setting.",
  },
  {
    id: "article-warehouse",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.warehouse),
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[2],
    publicByline: demoBylines[6],
    publicHeadline: "What Senior Leadership Misses About Warehouse Automation",
    publicationDate: "2026-07-14T14:00:00.000Z",
    slug: "what-leadership-misses-about-warehouse-automation",
    subtitle: "The real system includes the workarounds no dashboard records.",
    tags: [demoTags[3], demoTags[5]],
    verificationIndicators: [
      "identity-verified",
      "role-verified",
      "direct-knowledge-verified",
    ],
    verificationStatement:
      "Publius verified the author's identity and supervisory role while generalizing identifying operational details.",
  },
  {
    id: "article-procurement",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.procurement),
    essentialReadingEligible: true,
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[3],
    publicByline: demoBylines[4],
    publicHeadline:
      "I Review Technology Contracts. Here Is Why Agencies Keep Buying Obsolete Software",
    publicationDate: "2026-07-10T14:00:00.000Z",
    slug: "technology-contracts-agencies-buy-obsolete-software",
    subtitle: "Procurement can favor safe paperwork over useful tools.",
    tags: [demoTags[1], demoTags[4]],
    verificationIndicators: [
      "identity-verified",
      "employment-verified",
      "supporting-records-reviewed",
    ],
    verificationStatement:
      "Publius verified the author's contracting role and reviewed generalized records consistent with the process described.",
  },
  {
    id: "article-promotion",
    _status: "published",
    authorshipType: "verified-anonymous",
    body: lexicalFromParagraphs(paragraphs.promotion),
    format: "inside-work",
    insideWorkEligible: true,
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[8],
    publicHeadline:
      "The Promotion System Rewards Visibility More Than Institutional Knowledge",
    publicationDate: "2026-07-08T14:00:00.000Z",
    slug: "promotion-system-rewards-visibility",
    subtitle:
      "Preventing failure is often less legible than narrating success.",
    tags: [demoTags[3]],
    verificationIndicators: [
      "identity-verified",
      "employment-verified",
      "direct-knowledge-verified",
    ],
    verificationStatement:
      "Publius verified the author's current employment and generalized the company context.",
  },
  {
    id: "article-permitting",
    _status: "published",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.permitting),
    essentialReadingEligible: true,
    format: "expert-analysis",
    primaryTopic: demoTopics[1],
    publicByline: demoBylines[0],
    publicHeadline:
      "Why Local Permitting Reform Fails Between the Policy Memo and the Service Counter",
    publicationDate: "2026-07-05T14:00:00.000Z",
    slug: "local-permitting-reform-service-counter",
    subtitle: "The counter is where upstream ambiguity becomes public delay.",
    tags: [demoTags[4], demoTags[5]],
  },
  {
    id: "article-ai-pilots",
    _status: "published",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.ai),
    essentialReadingEligible: true,
    format: "expert-analysis",
    primaryTopic: demoTopics[3],
    publicByline: demoBylines[2],
    publicHeadline:
      "What Artificial-Intelligence Pilots Look Like to the Employees Asked to Use Them",
    publicationDate: "2026-07-02T14:00:00.000Z",
    slug: "artificial-intelligence-pilots-employees",
    subtitle: "Automation can move labor out of sight instead of removing it.",
    tags: [demoTags[3], demoTags[5]],
  },
  {
    id: "article-staffing",
    _status: "published",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.staffing),
    format: "expert-analysis",
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[1],
    publicHeadline:
      "The Case Against Treating Every Institutional Failure as a Staffing Problem",
    publicationDate: "2026-06-30T14:00:00.000Z",
    slug: "institutional-failure-staffing-problem",
    subtitle: "More people cannot always fix incoherent work.",
    tags: [demoTags[3], demoTags[5]],
  },
  {
    id: "article-manager-response",
    _status: "published",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.managerResponse),
    employerResponseContent:
      "This fictional response is included to demonstrate employer-response placement.",
    employerResponseDate: "2026-06-29T14:00:00.000Z",
    employerResponseStatus: "received",
    format: "response",
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[1],
    publicHeadline: "A Manager Responds: Why Performance Metrics Persist",
    publicationDate: "2026-06-28T14:00:00.000Z",
    slug: "manager-responds-performance-metrics-persist",
    subtitle:
      "Measurement can be useful when it begins a conversation rather than ending one.",
    tags: [demoTags[0], demoTags[3]],
  },
  {
    id: "article-anonymous-sourcing",
    _status: "published",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.anonymousSourcing),
    correctionRecords: [
      {
        date: "2026-06-26T14:00:00.000Z",
        materialChange: false,
        text: "This demonstration correction clarifies that Publius minimizes exposure but does not promise absolute anonymity.",
        type: "clarification",
      },
    ],
    format: "explainer",
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[0],
    publicHeadline: "How Anonymous Sourcing Works at Publius",
    publicationDate: "2026-06-25T14:00:00.000Z",
    slug: "how-anonymous-sourcing-works-at-publius",
    subtitle: "Anonymous bylines require more verification, not less.",
    tags: [demoTags[2]],
  },
  {
    id: "article-verify-employee",
    _status: "draft",
    authorshipType: "named",
    body: lexicalFromParagraphs(paragraphs.employeeVerification),
    format: "expert-analysis",
    primaryTopic: demoTopics[0],
    publicByline: demoBylines[2],
    publicHeadline: "What It Means to Verify an Employee's Account",
    publicationDate: "2026-08-15T14:00:00.000Z",
    scheduledPublicationDate: "2026-08-15T14:00:00.000Z",
    slug: "what-it-means-to-verify-an-employees-account",
    subtitle: "Verification narrows claims before it amplifies them.",
    tags: [demoTags[2]],
  },
];

export const demoHomepage = {
  essentialReading: demoArticles
    .filter((article) => article.essentialReadingEligible)
    .slice(0, 6),
  insideWorkOverrides: [],
  introductoryCopy:
    "Verified perspectives from inside the institutions that shape public life.",
  leadMode: "automatic",
  newsletterCopy: {
    description:
      "Receive each new article and an occasional note from the editors.",
    heading: "Read the view from inside.",
  },
  secondaryArticleOverrides: [],
  topicDisplayList: demoTopics,
};

export const demoSiteSettings = {
  contactEmail: "editors@publius.local",
  copyrightNotice: "Copyright (c) 2026 Publius.",
  description:
    "Verified perspectives from inside the institutions that shape public life.",
  footerCopy:
    "Publius publishes verified perspectives from people who understand institutions firsthand.",
  newsletterSettings: {
    consentText:
      "By subscribing, you agree to receive Publius emails. We store your email only for publication updates.",
    enabled: true,
  },
  publicationName: "PUBLIUS",
  tagline: "The view from inside.",
};

export const demoNavigation = {
  footerNavigation: [
    {
      groupLabel: "Publication",
      links: [
        { href: "/about", label: "About", order: 1, visible: true },
        {
          href: "/editorial-standards",
          label: "Editorial Standards",
          order: 2,
          visible: true,
        },
        {
          href: "/anonymous-sources",
          label: "Anonymous Sources",
          order: 3,
          visible: true,
        },
        {
          href: "/source-protection",
          label: "Source Protection",
          order: 4,
          visible: true,
        },
        { href: "/corrections", label: "Corrections", order: 5, visible: true },
      ],
    },
    {
      groupLabel: "Policies",
      links: [
        {
          href: "/conflicts",
          label: "Conflicts Policy",
          order: 1,
          visible: true,
        },
        { href: "/contact", label: "Contact", order: 2, visible: true },
        {
          href: "/submit",
          label: "Submit",
          order: 3,
          visible: true,
        },
        { href: "/privacy", label: "Privacy", order: 4, visible: true },
        { href: "/terms", label: "Terms", order: 5, visible: true },
      ],
    },
  ],
  primaryNavigation: [
    { href: "/latest", label: "Latest", order: 1, visible: true },
    { href: "/topics", label: "Topics", order: 2, visible: true },
    { href: "/inside-work", label: "Inside Work", order: 3, visible: true },
    { href: "/about", label: "About", order: 4, visible: true },
    { href: "/submit", label: "Submit", order: 5, visible: true },
  ],
};

export const demoPages = [
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Publius publishes verified perspectives from inside institutions and welcomes named and anonymous contributors. We focus on work that helps readers understand how institutions actually operate.",
        heading: "What Publius Publishes",
      },
    ],
    intro:
      "Publius publishes verified perspectives from people who understand institutions firsthand.",
    slug: "about",
    template: "standard",
    title: "About",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Publius distinguishes analysis from reported claims, verifies material assertions, gives institutions a fair opportunity to respond where appropriate, and corrects errors transparently.",
        heading: "Standards",
      },
      {
        blockType: "textSection",
        body: "Editors reject retaliatory, purely personal, or unsupported submissions. Contributors and editors disclose relevant professional and financial conflicts.",
        heading: "Fairness and Conflicts",
      },
    ],
    intro:
      "How Publius handles accuracy, fairness, verification, conflicts, and corrections.",
    slug: "editorial-standards",
    template: "policy",
    title: "Editorial Standards",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Editors normally know the contributor's identity. Anonymity is granted for a stated reason, and occupational bylines are used instead of publishing Anonymous alone.",
        heading: "How Anonymous Bylines Work",
      },
      {
        blockType: "callout",
        label: "Practical limit",
        text: "Publius does not promise absolute anonymity. Editors work to minimize unnecessary exposure while preserving accuracy.",
      },
    ],
    intro:
      "Why Publius may grant anonymity and how anonymous accounts are verified.",
    slug: "anonymous-sources",
    template: "policy",
    title: "Anonymous Sources",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Responsible contact begins with information minimization. Do not use workplace devices or workplace email when confidentiality is important, and do not send materials you are prohibited from possessing.",
        heading: "Contact Practices",
      },
      {
        blockType: "textSection",
        body: "Source-identifying records are stored separately from public editorial content. Legal protections vary by role, location, and subject.",
        heading: "Protected Records",
      },
    ],
    intro:
      "How Publius reduces unnecessary exposure and describes practical limitations.",
    slug: "source-protection",
    template: "policy",
    title: "Source Protection",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Readers may report potential errors by contacting editors. Material corrections appear with the article and include the date, correction type, and whether the change materially affected the article.",
        heading: "Reporting Errors",
      },
    ],
    intro: "How correction notices appear and how readers can report errors.",
    slug: "corrections",
    template: "policy",
    title: "Corrections",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Contributors and editors must disclose professional and financial conflicts relevant to their work. Publius may decline or contextualize work when conflicts would mislead readers.",
        heading: "Disclosure",
      },
    ],
    intro: "Professional and financial conflicts must be disclosed.",
    slug: "conflicts",
    template: "policy",
    title: "Conflicts Policy",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "For editorial questions, corrections, or administrative matters, contact editors@publius.local in local development.",
        heading: "Contact Publius",
      },
    ],
    intro: "Reach the editors.",
    slug: "contact",
    template: "contact",
    title: "Contact",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "Publius stores only the information needed to operate the publication, review submissions, and manage subscriptions. The initial release does not include advertising trackers or session replay tools.",
        heading: "Privacy",
      },
    ],
    intro: "A local-development privacy notice for Publius.",
    slug: "privacy",
    template: "policy",
    title: "Privacy",
  },
  {
    contentBlocks: [
      {
        blockType: "textSection",
        body: "This demonstration site is provided for local evaluation. Submission through the demo does not create an attorney-client relationship or guarantee publication.",
        heading: "Terms",
      },
    ],
    intro: "Terms for the local demonstration publication.",
    slug: "terms",
    template: "policy",
    title: "Terms",
  },
];

export const demoSubmissions = [
  {
    activeDisputeOrLitigation: false,
    contactPreference: "email",
    currentOrFormerEmployee: "current",
    evidenceAvailability: "describe",
    generalRole: "Frontline service worker",
    organization: "Fictional regional agency",
    personallyObserved: "A queue policy creates repeated avoidable contacts.",
    personalEmail: "source-one@example.test",
    publicInterestExplanation:
      "The pattern affects public understanding of service quality.",
    referenceNumber: "PUB-202607-0001",
    status: "new",
    submissionDate: "2026-07-21T14:00:00.000Z",
    submissionType: "pitch",
    whatReadersShouldUnderstand:
      "The published metric does not reflect whether people get answers.",
  },
  {
    activeDisputeOrLitigation: false,
    contactPreference: "secure-follow-up",
    currentOrFormerEmployee: "contractor",
    evidenceAvailability: "may-share-later",
    generalRole: "Technology program contractor",
    organization: "Fictional civic technology vendor",
    personallyObserved:
      "A pilot creates exception work not counted in savings estimates.",
    personalEmail: "source-two@example.test",
    publicInterestExplanation:
      "Public agencies are using the tool in sensitive workflows.",
    referenceNumber: "PUB-202607-0002",
    status: "under-review",
    submissionDate: "2026-07-18T14:00:00.000Z",
    submissionType: "confidential-info",
    whatReadersShouldUnderstand:
      "The automation pilot shifts work to employees.",
  },
  {
    activeDisputeOrLitigation: true,
    contactPreference: "email",
    currentOrFormerEmployee: "former",
    evidenceAvailability: "none",
    generalRole: "Former operations analyst",
    organization: "Fictional logistics company",
    personallyObserved: "A dashboard was adjusted after leadership reviews.",
    personalEmail: "source-three@example.test",
    publicInterestExplanation:
      "The allegation requires careful verification before any publication.",
    referenceNumber: "PUB-202607-0003",
    status: "screening",
    submissionDate: "2026-07-15T14:00:00.000Z",
    submissionType: "draft",
    whatReadersShouldUnderstand: "Employees believe the measure is not stable.",
  },
];

export const publishedDemoArticles = demoArticles
  .filter((article) => article._status === "published")
  .sort(
    (a, b) => Date.parse(b.publicationDate) - Date.parse(a.publicationDate),
  );
