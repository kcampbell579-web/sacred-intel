// Central site configuration. Update these values as the brand evolves.
export const SITE = {
  name: 'Sacred Intel',
  tagline: 'The stories behind safety, science, engineering, and environmental health.',
  description:
    'Sacred Intel is a 20-minute podcast and content platform covering environmental health, workplace safety, engineering failures, disasters, emerging contaminants, and the science behind major headlines.',
  email: 'hello@sacredintel.org',
  // Newsletter (Mailjet). Paste the FORM ACTION URL from your Mailjet
  // subscription widget here and every newsletter form posts to it.
  // Leave action empty until then — forms show a friendly "coming soon".
  newsletter: {
    provider: 'Mailjet',
    action: '', // e.g. https://app.mailjet.com/widget/iframe/XXXX/YYYY  (form action)
    emailField: 'email', // field name Mailjet expects for the address
  },
  // Podcast subscription links — replace the "#" placeholders once your show
  // is live on each platform. The RSS feed is generated at /podcast.xml.
  subscribe: [
    { name: 'Apple Podcasts', href: '#', slug: 'apple' },
    { name: 'Spotify', href: '#', slug: 'spotify' },
    { name: 'YouTube', href: '#', slug: 'youtube' },
    { name: 'Overcast', href: '#', slug: 'overcast' },
    { name: 'RSS', href: '/podcast.xml', slug: 'rss' },
  ],
  social: [
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' },
    { name: 'X', href: '#' },
  ],
};
