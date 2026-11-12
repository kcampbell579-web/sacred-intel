// Estimated reading time from a content entry's raw markdown body.
export function readingTime(entry) {
  const words = (entry.body || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function fmtDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
export function fmtDateLong(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
export function iso(d) {
  return new Date(d).toISOString();
}

// ----------------------------------------------------------------------------
// Title Case — capitalize the first letter of EVERY word (including short words
// like A, And, Of, The, To, In) while preserving acronyms, chemical formulas,
// mixed-case technical terms, and proper names. Used for headlines, titles,
// section headings, card titles, and nav labels so visible text, search cards,
// and <title> metadata all agree. We never use CSS text-transform for this.
// ----------------------------------------------------------------------------

// Tokens whose exact casing must be preserved. Keyed by lowercase form.
const TERMS = [
  // Agencies / regulations / standards
  'EPA', 'OSHA', 'NIOSH', 'NYSDEC', 'DEC', 'NYSDOH', 'DOH', 'NYS', 'FDA', 'CDC',
  'CPSC', 'CSB', 'USDA', 'FSIS', 'ATSDR', 'HHS', 'DOD', 'DOJ', 'SEC', 'FEMA',
  'TSCA', 'RCRA', 'SDWA', 'HON', 'UCMR', 'SPDES', 'NPDES', 'HAZWOPER', 'ASTM',
  'MCL', 'MCLs', 'PEL', 'REL', 'AQI', 'IAQ', 'GHG', 'ECHO', 'SDWIS', 'RICO',
  'CFR', 'MDL', 'HASP', 'ESA',
  // Chemistry / health
  'PFAS', 'PFOA', 'PFOS', 'PFPrA', 'AFFF', 'GAC', 'VOC', 'VOCs', 'pH', 'mRNA',
  'DNA', 'RNA', 'CO2', 'NO2', 'SO2', 'H2S', 'PM2.5', 'PM10', 'ppb', 'ppt',
  'P100', 'C8', 'WTC', 'E.', 'coli', 'IV',
  // Places / orgs / misc
  'NY', 'US', 'USA', 'UK', 'EU', 'LNG', 'BESS', 'HVAC', 'AI', 'UBS', 'LG',
  '3M', 'NextEra', 'DuPont', 'Chemours', 'Corteva', 'BASF', 'McClure',
  // Credentials
  'CSP', 'ASP', 'CHST',
];
const TERM_MAP = new Map(TERMS.map((t) => [t.toLowerCase(), t]));

// Uppercase the first alphabetic character; leave the rest of the word as-is
// (so PFAS, 3M, McClure, NextEra, DuPont keep their internal casing).
function capFirst(w) {
  return w.replace(/[A-Za-z]/, (c) => c.toUpperCase());
}

export function titleCase(str) {
  if (!str) return str;
  return str
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s*$/.test(tok)) return tok; // preserve whitespace runs
      const m = tok.match(/^([^A-Za-z0-9]*)([\s\S]*?)([^A-Za-z0-9]*)$/);
      const lead = m[1], core = m[2], trail = m[3];
      if (!core) return tok;
      const canon = TERM_MAP.get(core.toLowerCase());
      return lead + (canon || capFirst(core)) + trail;
    })
    .join('');
}
