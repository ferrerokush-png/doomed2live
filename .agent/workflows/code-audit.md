---
description: This is a Code Audit Prompt
---

I am submitting my codebase for a rigorous, industry-standard code audit. My goal is absolute perfection in code quality, efficiency, architecture, and maintainability without altering the site's existing functionality or design.

Please perform a comprehensive review using the strict verification framework below.

1. Verification & Anti-Hallucination Rules (CRITICAL)
Cite Everything: Every recommendation must reference the specific File Name and Line Number(s).

Exact Snippets: Include the exact code snippet from my codebase (copy-pasted, not paraphrased) to prove you are referencing real code.

Documentation: Link to official documentation (e.g., MDN, React Docs, OWASP) or industry standards for every claim.

Confidence Levels: Rate each finding as:

HIGH: Can point to exact code, confirmed by official docs.

MEDIUM: Likely correct but may depend on runtime context.

LOW: Uncertain or requires testing (list these separately).

No Vague Claims: Do not say "might have performance issues." Only report issues you can demonstrate with evidence.

2. Audit Focus Areas
A. Code Quality & Standards
Check for adherence to modern standards (ES6+, Semantic HTML5, CSS conventions).

Identify code smells, anti-patterns, or redundancy.

Flag security vulnerabilities (XSS, injection risks) and accessibility issues (WCAG compliance).

Review naming conventions, formatting, and file structure consistency.

B. Performance & Efficiency
Identify unnecessary re-renders, unused dependencies, or bloated imports.

Suggest optimizations (lazy loading, code splitting, caching strategies).

Review asset loading and network waterfall efficiency.

Flag potential memory leaks or inefficient algorithms.

C. Architecture & Framework
Validate the implementation of the framework (React/Vue/etc.) against official patterns.

Check component structure, prop drilling, and state management flow.

Ensure proper separation of concerns (business logic vs. UI).

Verify build configuration and tooling best practices.

D. Maintainability
Review code documentation and comment clarity.

Check for DRY (Don't Repeat Yourself) violations.

Identify technical debt and refactoring opportunities.

Ensure error handling and logging are comprehensive.

3. Advanced Checks (The "Pristine" Standard)
E. Testing & Regression Prevention
For any refactoring suggestion:

Explain what tests should verify the change works.

Identify any edge cases that could break.

Specify which existing features/workflows are affected.

Ask: "Can this change be safely applied without breaking X, Y, Z?"

F. Compatibility & Environment
Specify minimum browser versions supported by the change.

Confirm Node.js version compatibility.

Flag if the change requires updating build process or deployment config.

G. Measurable Impact
Do NOT use vague terms. Provide specific metrics:

Bundle Size: Show before/after byte count (e.g., "123KB → 98KB").

Performance: Show metrics (e.g., "LCP: 2.3s → 1.8s").

Code Complexity: Show cyclomatic complexity improvement.

Maintenance: Estimate time saved per developer per month.

H. Dependency & Security Review
If suggesting package changes:

Provide package name, version, download count, last update date, and known vulnerabilities.

Confirm no other code depends on removed packages.

I. Implementation Effort & Risk
For each recommendation, provide:

Effort: TRIVIAL (< 5 min), LOW (15-30 min), MODERATE (1-2 hrs), HIGH (4+ hrs).

Risk: ZERO (cosmetic), LOW (unlikely to break), MODERATE (edge cases), HIGH (breaking change).

Path: Can it be done incrementally? Can it be rolled back?

J. Framework-Specific Validation
Cross-check against:

React: Concurrent Rendering, Strict Mode, Hooks guidelines.

Vue: Composition API patterns, Reactivity limitations.

Next.js: App/Pages Router compatibility, Server Components.

General: TypeScript strict mode, ESLint/Prettier alignment.

K. Production Readiness
Verify:

 Proper error handling?

 Edge cases covered?

 Graceful degradation?

 Monitoring/logging ready?

 Documented for future devs?

4. Constraints
NO Functional Changes: I am happy with how the site works. Do NOT suggest feature changes or UI/UX overhauls.

NO Drastic Refactors: Focus on efficient, targeted improvements.

Prioritization: Rank recommendations by impact (Critical Fixes > Performance Optimizations > Style/Cleanup).

5. Required Output Format
For each recommendation, use this exact template:

Issue: [Clear description of the problem]

Location: [File Name, Line Numbers]

Current Code:

javascript
// Paste exact snippet here
Why it's an issue: [Explanation + Link to Official Docs]

Proposed Fix:

javascript
// Paste refactored code here
Benefit: [Measurable improvement, e.g., "Reduces bundle size by 10%"]

Trade-offs: [Any complexity added or downsides]

Effort / Risk: [TRIVIAL/LOW/MODERATE/HIGH] / [ZERO/LOW/MODERATE/HIGH]

Confidence: [HIGH / MEDIUM / LOW]

6. False Positives Section
At the end of your report, include a section titled "False Positives to Ignore". List patterns in my code that might look incorrect but are actually acceptable in this specific context, explaining why they should be left alone. I am not a coder by trade, I am just a prompter so please explain in simple to understand way.