// Comprehensive User-Agent database for redirect testing
// Organized by category for modern UI display

export type UserAgentCategory =
  | 'desktop-browsers'
  | 'mobile-browsers'
  | 'search-bots'
  | 'social-media-bots'
  | 'gaming-platforms'
  | 'special-devices'
  | 'tools-api';

export interface UserAgentOption {
  id: string;
  label: string;
  category: UserAgentCategory;
  userAgent: string;
  icon?: string;
  popular?: boolean;
}

export const userAgentCategories = {
  'desktop-browsers': { label: 'Desktop Browsers', icon: '💻', order: 1 },
  'mobile-browsers': { label: 'Mobile Browsers', icon: '📱', order: 2 },
  'search-bots': { label: 'Search Engine Bots', icon: '🤖', order: 3 },
  'social-media-bots': { label: 'Social Media Crawlers', icon: '👥', order: 4 },
  'gaming-platforms': { label: 'Gaming Platforms', icon: '🎮', order: 5 },
  'special-devices': { label: 'Special Devices', icon: '⌚', order: 6 },
  'tools-api': { label: 'Tools & APIs', icon: '🔧', order: 7 },
};

export const userAgents: UserAgentOption[] = [
  // Desktop Browsers
  {
    id: 'chrome-latest-win',
    label: 'Chrome (Latest) - Windows',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    popular: true
  },
  {
    id: 'chrome-latest-mac',
    label: 'Chrome (Latest) - macOS',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    popular: true
  },
  {
    id: 'firefox-latest-win',
    label: 'Firefox (Latest) - Windows',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    popular: true
  },
  {
    id: 'firefox-latest-mac',
    label: 'Firefox (Latest) - macOS',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
  },
  {
    id: 'safari-latest-mac',
    label: 'Safari (Latest) - macOS',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    popular: true
  },
  {
    id: 'edge-latest-win',
    label: 'Edge (Latest) - Windows',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  },
  {
    id: 'opera-latest',
    label: 'Opera (Latest)',
    category: 'desktop-browsers',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0'
  },

  // Mobile Browsers
  {
    id: 'chrome-android',
    label: 'Chrome - Android',
    category: 'mobile-browsers',
    userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
    popular: true
  },
  {
    id: 'safari-iphone',
    label: 'Safari - iPhone',
    category: 'mobile-browsers',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    popular: true
  },
  {
    id: 'safari-ipad',
    label: 'Safari - iPad',
    category: 'mobile-browsers',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'samsung-browser',
    label: 'Samsung Internet',
    category: 'mobile-browsers',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'firefox-android',
    label: 'Firefox - Android',
    category: 'mobile-browsers',
    userAgent: 'Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
  },

  // Search Engine Bots
  {
    id: 'googlebot',
    label: 'Googlebot (Desktop)',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    popular: true
  },
  {
    id: 'googlebot-mobile',
    label: 'Googlebot (Mobile)',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    popular: true
  },
  {
    id: 'googlebot-image',
    label: 'Googlebot Image',
    category: 'search-bots',
    userAgent: 'Googlebot-Image/1.0'
  },
  {
    id: 'google-adsbot',
    label: 'Google AdsBot',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; AdsBot-Google; +http://www.google.com/adsbot.html)'
  },
  {
    id: 'bingbot',
    label: 'Bingbot',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    popular: true
  },
  {
    id: 'bingbot-mobile',
    label: 'Bingbot Mobile',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
  },
  {
    id: 'yahoobot',
    label: 'Yahoo! Slurp',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)'
  },
  {
    id: 'yandexbot',
    label: 'YandexBot',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
  },
  {
    id: 'baiduspider',
    label: 'Baidu Spider',
    category: 'search-bots',
    userAgent: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)'
  },
  {
    id: 'duckduckbot',
    label: 'DuckDuckBot',
    category: 'search-bots',
    userAgent: 'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)'
  },

  // Social Media Bots
  {
    id: 'facebookbot',
    label: 'Facebook Bot',
    category: 'social-media-bots',
    userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    popular: true
  },
  {
    id: 'twitterbot',
    label: 'Twitter Bot',
    category: 'social-media-bots',
    userAgent: 'Twitterbot/1.0',
    popular: true
  },
  {
    id: 'linkedinbot',
    label: 'LinkedIn Bot',
    category: 'social-media-bots',
    userAgent: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; +https://www.linkedin.com/)'
  },
  {
    id: 'pinterestbot',
    label: 'Pinterest Bot',
    category: 'social-media-bots',
    userAgent: 'Pinterest/0.2 (+http://www.pinterest.com/)'
  },
  {
    id: 'slackbot',
    label: 'Slack Bot',
    category: 'social-media-bots',
    userAgent: 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'social-media-bots',
    userAgent: 'WhatsApp/2.23.20.0'
  },
  {
    id: 'telegrambot',
    label: 'Telegram Bot',
    category: 'social-media-bots',
    userAgent: 'TelegramBot (like TwitterBot)'
  },

  // Gaming Platforms
  {
    id: 'ps5',
    label: 'PlayStation 5',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (PlayStation 5 7.00) AppleWebKit/605.1.15 (KHTML, like Gecko)'
  },
  {
    id: 'ps4',
    label: 'PlayStation 4',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (PlayStation 4 11.00) AppleWebKit/605.1.15 (KHTML, like Gecko)'
  },
  {
    id: 'xbox-series-x',
    label: 'Xbox Series X',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edge/44.18363.8131'
  },
  {
    id: 'xbox-one',
    label: 'Xbox One',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edge/44.18363.8131'
  },
  {
    id: 'nintendo-switch',
    label: 'Nintendo Switch',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (Nintendo Switch; WebApplet) AppleWebKit/609.4 (KHTML, like Gecko) NF/6.0.2.21.3 NintendoBrowser/5.1.0.22474'
  },
  {
    id: 'nintendo-wiiu',
    label: 'Nintendo Wii U',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US'
  },
  {
    id: 'steam-deck',
    label: 'Steam Deck',
    category: 'gaming-platforms',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Valve Steam GameOverlay/1702594613'
  },

  // Special Devices
  {
    id: 'kindle-fire',
    label: 'Kindle Fire',
    category: 'special-devices',
    userAgent: 'Mozilla/5.0 (Linux; Android 7.1.2; KFKAWI Build/NS6312) AppleWebKit/537.36 (KHTML, like Gecko) Silk/120.1 like Chrome/120.0.0.0 Safari/537.36'
  },
  {
    id: 'apple-watch',
    label: 'Apple Watch',
    category: 'special-devices',
    userAgent: 'Mozilla/5.0 (Apple Watch; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14S326 Safari/602.1'
  },
  {
    id: 'smart-tv-samsung',
    label: 'Samsung Smart TV',
    category: 'special-devices',
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/108.0.5359.146 TV Safari/537.36'
  },
  {
    id: 'smart-tv-lg',
    label: 'LG Smart TV',
    category: 'special-devices',
    userAgent: 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 DMOST/1.0.1 (; LGE; webOSTV; WEBOS4.5.0)'
  },
  {
    id: 'oculus-quest',
    label: 'Oculus Quest',
    category: 'special-devices',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/28.0.0.2.58.346721805 SamsungBrowser/4.0 Chrome/120.0.0.0 Mobile VR Safari/537.36'
  },

  // Tools & APIs
  {
    id: 'curl',
    label: 'cURL',
    category: 'tools-api',
    userAgent: 'curl/8.0.1'
  },
  {
    id: 'wget',
    label: 'Wget',
    category: 'tools-api',
    userAgent: 'Wget/1.21.3'
  },
  {
    id: 'postman',
    label: 'Postman',
    category: 'tools-api',
    userAgent: 'PostmanRuntime/7.32.3'
  },
  {
    id: 'python-requests',
    label: 'Python Requests',
    category: 'tools-api',
    userAgent: 'python-requests/2.31.0'
  },
  {
    id: 'node-fetch',
    label: 'Node.js Fetch',
    category: 'tools-api',
    userAgent: 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
  },
  {
    id: 'axios',
    label: 'Axios',
    category: 'tools-api',
    userAgent: 'axios/1.6.0'
  },
  {
    id: 'default-toolbot',
    label: 'Default (ToolBot)',
    category: 'tools-api',
    userAgent: 'Mozilla/5.0 (compatible; RedirectCheckerBot/1.0; +https://redirectchecker.org/bot)',
    popular: true
  },
];

// Helper function to get user agents by category
export function getUserAgentsByCategory(category: UserAgentCategory): UserAgentOption[] {
  return userAgents.filter(ua => ua.category === category);
}

// Helper function to get popular user agents
export function getPopularUserAgents(): UserAgentOption[] {
  return userAgents.filter(ua => ua.popular);
}

// Helper function to search user agents
export function searchUserAgents(query: string): UserAgentOption[] {
  const lowerQuery = query.toLowerCase();
  return userAgents.filter(ua =>
    ua.label.toLowerCase().includes(lowerQuery) ||
    ua.userAgent.toLowerCase().includes(lowerQuery)
  );
}

// Get user agent by ID
export function getUserAgentById(id: string): UserAgentOption | undefined {
  return userAgents.find(ua => ua.id === id);
}

// Get default user agent
export function getDefaultUserAgent(): UserAgentOption {
  return getUserAgentById('default-toolbot') || userAgents[0];
}
