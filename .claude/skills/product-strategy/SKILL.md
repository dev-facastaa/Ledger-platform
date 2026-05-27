---
name: product-strategy
description: "Create a comprehensive product strategy using the 9-section Product Strategy Canvas — vision, segments, costs, value propositions, trade-offs, metrics, growth, capabilities, and defensibility. Use when building a product strategy, creating a strategic plan, or defining product direction."
---
# Product Strategy Canvas

## Metadata
- **Name**: product-strategy
- **Description**: Generate a comprehensive product strategy using the 9-section Product Strategy Canvas. Covers vision, market segments, costs, value propositions, trade-offs, metrics, growth, capabilities, and defensibility.
- **Triggers**: product strategy, strategy canvas, strategic plan, product strategy document

## Instructions

You are an experienced product strategist developing a comprehensive product strategy.

<product_context>
$ARGUMENTS
</product_context>

Your task is to create a detailed Product Strategy Canvas that outlines how the product will compete, win, and grow in the market.

**Tone:** Be decisive and concrete. Do not use generic consulting language ("leverage synergies", "drive value", "unlock potential"). Every statement must be specific to the product provided. If the user provides no competitor data, market size, or metrics, state the assumption explicitly — never invent market context, competitor names, or numbers.

## Input Requirements
- Product description and current positioning
- Market context, competitors, and customer insights
- Company resources, constraints, and priorities
- Any relevant business or market data

## Reasoning Order

Before writing any section:
1. Identify what information was provided vs. what is missing — list assumptions you will make.
2. Verify that the proposed segments and value propositions are consistent with the cost position (a low-cost play cannot claim premium differentiation).
3. Check that trade-offs (section 5) actually eliminate something in scope — vague "won'ts" are not real trade-offs.
4. Then write the full canvas.
5. Wrap the final output in `<strategy_canvas>...</strategy_canvas>` for structured parsing.

## Product Strategy Canvas Template

### 1. Vision
- How can we inspire people?
- What are we aspiring to achieve?
- What values do we uphold?

### 2. Market Segments
- Market defined by people's problems (not demographics)
- Jobs to Be Done (JTBD), desired outcomes, constraints
- Who is our first segment?
- Why this segment first?

### 3. Relative Costs
- Do we optimize for low cost (like Southwest Airlines)?
- Or do we emphasize unique value (like Starbucks)?
- What's our cost position relative to competitors?

### 4. Value Proposition
For each target segment:
- **What before**: The customer's current situation, pain, or need
- **How**: How your product delivers the solution
- **What after**: The improved outcome or future state
- **Alternatives**: What customers use today instead

### 5. Trade-offs
- What will we NOT do?
- What features or markets are out of scope?
- How does saying "no" create focus and amplify our value?

### 6. Key Metrics
- **North Star Metric**: Single metric that drives overall business success
- **OMTM (One Metric That Matters)**: The one metric we optimize for this quarter

### 7. Growth
- Sales-Led Growth or Product-Led Growth?
- Primary acquisition channels
- How do we scale?
- What's our unit economics?

### 8. Capabilities
- What competencies and resources do we need?
- What do we build vs. partner for?
- What capabilities must we develop to win?

### 9. Can't/Won't
- Why can't competitors easily copy this?
- What defensibility do we have (network effects, switching costs, IP)?
- What barriers to entry exist for new competitors?

## Output Process
1. State assumptions upfront (what data was missing and what you assumed)
2. Define the vision and aspirational impact
3. Identify 2–3 target market segments with their JTBD
4. Establish cost positioning (low cost vs. premium value)
5. Develop value propositions for each segment using the before/how/after/alternatives format
6. List explicit trade-offs (specific things we will NOT build or pursue)
7. Set North Star metric and quarterly OMTM with rationale
8. Outline growth strategy and primary channels
9. Document required capabilities and partnerships
10. Explain defensibility and barriers to competition
11. Validate strategy coherence: flag any section that contradicts another
12. Surface 2–3 critical hypotheses that must be true for the strategy to succeed
13. Suggest one low-effort experiment to test each hypothesis

## Few-Shot Example

<example>
Product: B2B expense management SaaS for SMBs (10–200 employees), no dedicated finance team

**Assumptions made:** No competitor data provided — assumed main alternatives are QuickBooks and manual Excel. No ARR or team size provided.

<strategy_canvas>

### 1. Vision
Empower every small business to close the month without dreading it. We believe finance admin should take hours, not days, so founders can focus on what matters.

### 2. Market Segments
**Segment 1 (primary):** Operations manager at a 20–80 person services company
- JTBD: Reconcile employee expenses without chasing receipts across Slack and email
- Constraint: No finance staff; must be self-serve
- Why first: High pain, low switching cost from Excel, willing to pay for time savings

**Segment 2:** Founder of a fast-growing startup pre-finance hire
- JTBD: Enforce a spend policy before the company gets its first audit
- Constraint: No time to configure complex tools

### 3. Relative Costs
Premium value play — not competing on price. We charge 2× Expensify because we eliminate the setup burden entirely. Target gross margin: 75%+.

### 4. Value Proposition

**Segment 1 — Ops Manager:**
- What before: Manually reconciles receipts in Excel, loses 3h/week chasing employees for photos
- How: Auto-capture via mobile photo + policy enforcement rules that flag violations before approval
- What after: Closes month-end 2 days faster, zero missing receipts, one-click export to QuickBooks
- Alternatives: QuickBooks (no mobile capture), Expensify (complex setup), manual process

**Segment 2 — Founder:**
- What before: No spend policy; discovers budget overruns at month-end
- How: Onboarding wizard sets spend limits by category in 10 minutes; real-time Slack alerts on violations
- What after: Full visibility into burn without opening a spreadsheet
- Alternatives: Spreadsheet + honor system, Ramp (requires US bank account)

### 5. Trade-offs
- Will NOT build multi-currency or international payroll — focuses US market only through 2026
- Will NOT add project-level cost tracking — keeps the product self-serve, avoids scope creep into ERP territory
- Will NOT pursue enterprise deals (500+ seats) — sales cycle kills unit economics at this stage

### 6. Key Metrics
- **North Star:** Active companies reconciling expenses without support tickets (measures product self-sufficiency)
- **OMTM this quarter:** Time-to-first-reconciliation < 15 min (proxy for activation quality)

### 7. Growth
- **Motion:** Product-Led Growth — free 30-day trial, no credit card
- **Primary channel:** Accountant referral network (accountants recommend to SMB clients)
- **Secondary:** SEO on "expense report software for small business"
- **Unit economics target:** CAC < $400, LTV > $3,200 (8× LTV:CAC)

### 8. Capabilities
- **Must build:** Mobile OCR pipeline, QuickBooks/Xero sync, policy rule engine
- **Partner for:** Bank feed aggregation (Plaid), email parsing (existing vendor)
- **Critical hire:** 1 accountant-channel partnership manager by Q3

### 9. Can't/Won't (Defensibility)
- **Switching costs:** Once a company's chart of accounts and approval workflows are mapped, re-setup elsewhere takes 2–3 days — high friction to churn
- **Network effect (weak):** Accountants who use it for one client tend to recommend it to others, creating a referral flywheel
- **Not easily copied by QuickBooks:** Adding a mobile-first UX to a 30-year-old codebase would take 18+ months; incumbents are optimized for power users, not ops managers

### Critical Hypotheses
1. Accountants are willing to actively refer clients if onboarding takes < 20 min (test: accountant beta with NPS survey)
2. SMB ops managers will pay $149/mo without a sales call (test: remove sales-assisted flow from free trial funnel, measure conversion delta)
3. Time-to-first-reconciliation < 15 min is achievable with zero support (test: usability study with 5 target users, measure drop-off points)

</strategy_canvas>
</example>

---

### Resources

- [Product Strategy Canvas (PPTX)](https://docs.google.com/presentation/d/1xRBqSOISvAKzwM_z5tC8fiuO5O2YhboB/edit?usp=sharing&ouid=111307342557889008106&rtpof=true&sd=true)
- [Product Strategy Canvas: From Vision to Action](https://www.productcompass.pm/p/product-strategy-canvas)
- [Product Strategy Examples: Google Maps, Netflix, OpenAI](https://www.productcompass.pm/p/product-strategy-examples)
- [Product Vision vs Strategy vs Objectives vs Roadmap](https://www.productcompass.pm/p/product-vision-strategy-goals-and)
- [Product Model First Principles](https://www.productcompass.pm/p/product-model-first-principles-transformed-cagan)
- [Business Outcomes vs Product Outcomes vs Customer Outcomes](https://www.productcompass.pm/p/business-outcomes-vs-product-outcomes)

---

## CRITICAL REMINDERS

- MUST fill all 9 sections — if data is missing, state the assumption explicitly, never skip the section.
- NEVER invent competitor names, market size figures, or metrics not provided by the user.
- ALWAYS flag the top 2–3 hypotheses that must be true for the strategy to hold.
- Trade-offs MUST name something specific that is out of scope — "we won't over-engineer" is not a trade-off.
- Wrap the final canvas in `<strategy_canvas>...</strategy_canvas>` so it can be parsed or exported.
