// News sections (subject areas) — the top-level way a reader navigates the
// publication, separate from an article's "category" (News/Brief/Explainer…
// which describes the format).
export const SECTIONS = [
  { slug: 'safety', name: 'Safety', blurb: 'Workplace and product safety — recalls, occupational hazards, and the failures behind preventable harm.' },
  { slug: 'environment', name: 'Environment', blurb: 'Contamination, pollution, and the regulatory fights over air, water, and land.' },
  { slug: 'health', name: 'Health', blurb: 'Exposure science, outbreaks, and the research linking the environment to human health.' },
  { slug: 'infrastructure', name: 'Infrastructure', blurb: 'Energy, water systems, data centers, and the built environment under strain.' },
];

export const sectionBySlug = Object.fromEntries(SECTIONS.map((s) => [s.slug, s]));
export const nameToSlug = Object.fromEntries(SECTIONS.map((s) => [s.name, s.slug]));

// Explicit subject assignment per article slug.
const MAP = {
  // Safety
  'pfas-turnout-gear-rico-28-departments': 'safety',
  'nyc-911-air-quality-records-harding-memo': 'safety',
  'csb-h2s-deaths-catalyst-refiners-decommissioning': 'safety',
  'cpsc-ten-recalls-one-day': 'safety',
  'pesticide-poisonings-400-million': 'safety',
  'niosh-counterfeit-p100-filters': 'safety',
  'mistolin-lestoil-pseudomonas-recall': 'safety',
  'epa-12-dichloropropane-tsca-draft': 'safety',
  'cpsc-childrens-recalls-dressers-water-beads': 'safety',
  'lontcs-busy-board-lead-zipper-recall': 'safety',
  // Environment
  'roundup-7-25-billion-settlement-fairness': 'environment',
  'epa-repeals-power-plant-ghg-limits-pm25': 'environment',
  'embassy-air-monitors-switched-off-pollution-rose': 'environment',
  'east-hampton-pfpra-scwa-lawsuit-gac': 'environment',
  'chemours-590m-multi-pathway': 'environment',
  'fifth-circuit-no-right-to-clean-water': 'environment',
  'epa-hon-rule-fenceline-monitoring-rollback': 'environment',
  'california-pfas-pesticide-ban-blocked': 'environment',
  'pesticide-drift-governors': 'environment',
  'pentagon-pfas-cleanup-delay-243-sites': 'environment',
  'ny-landfill-leachate-pfas-rule': 'environment',
  'newtown-creek-reclassification': 'environment',
  'new-york-plastic-waste-guardian': 'environment',
  'bald-eagle-nestlings-pfas-fingerprints': 'environment',
  'lead-service-line-inventories-unknown-pipes': 'environment',
  'wotus-reopened-supplemental-notice': 'environment',
  // Health
  'mount-sinai-wtc-responders-neighborhood': 'health',
  'centric-compounding-iv-endotoxin-recall': 'health',
  'bronx-legionnaires-nine-cases-yankee-stadium-pcr': 'health',
  'air-noise-light-pollution-mental-health-review': 'health',
  '911-cohort-chronic-multi-organ-disease-jama': 'health',
  'spot-urine-pesticide-study-methodology': 'health',
  'pesticides-gestational-diabetes': 'health',
  'nyc-legionnaires-cooling-towers-81-percent': 'health',
  'food-contact-chemicals-4222-priority': 'health',
  'broccoli-sprouts-salmonella-no-public-recall': 'health',
  // Infrastructure
  'freeport-lng-self-reported-emission-events': 'infrastructure',
  'data-center-wastewater-backlash': 'infrastructure',
  'ai-data-centers-pfas-production-wave': 'infrastructure',
};

// Fallback: guess a section from topics/category if a slug isn't mapped.
function guess(entry) {
  const t = (entry.data.topics || []).join(' ').toLowerCase();
  if (/(recall|occupational|workplace|respirator|safety)/.test(t)) return 'safety';
  if (/(health|legionnaires|diabetes|endotoxin|salmonella|disease)/.test(t)) return 'health';
  if (/(infrastructure|energy|data center|lng)/.test(t)) return 'infrastructure';
  return 'environment';
}

export function sectionOf(entry) {
  return MAP[entry.slug] || guess(entry);
}

// "Investigations" = the longer analytical formats.
const INVESTIGATION_CATS = new Set(['Deep Dive', 'Explainer', 'Field Guide']);
export function isInvestigation(entry) {
  return INVESTIGATION_CATS.has(entry.data.category);
}
