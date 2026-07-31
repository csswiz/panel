// Orders Data Layer — seed orders pre-populate Order History

export const ORDER_STATUS_COLORS = {
  "Completed":   "emerald",
  "In Progress": "blue",
  "Processing":  "indigo",
  "Pending":     "amber",
  "Partial":     "purple",
  "Canceled":    "rose",
};

const STATUSES = ["Completed", "In Progress", "Processing", "Pending", "Partial", "Canceled"];

const CLIENT_NAMES = [
  "Alex Vance", "Sophia Chen", "Marcus Brody", "Elena Rostova", "David Miller",
  "James Wilson", "Aaliyah Khan", "Lucas Silva", "Emma Watson", "Liam O'Connor"
];

const SEED_SERVICES = [
  { name: "Instagram Real Followers [HQ • 30 Days Auto Refill]",    rate: 0.85  },
  { name: "Instagram Reels Views [Viral Algorithm Booster]",         rate: 0.02  },
  { name: "TikTok Followers [Non-Drop • Real Profiles]",             rate: 1.10  },
  { name: "TikTok Video Likes [Instant Start • High Retention]",     rate: 0.18  },
  { name: "YouTube Channel Subscribers [Monetization Safe • 30D]",  rate: 6.50  },
  { name: "YouTube High Retention Views [5-15 Min Watch]",           rate: 0.95  },
  { name: "Telegram Public Channel Members [Non-Drop]",              rate: 0.45  },
  { name: "Spotify Monthly Listeners [USA • Royalties Safe]",        rate: 1.25  },
  { name: "X / Twitter Real Followers [Active • Non Drop]",          rate: 2.10  },
  { name: "LinkedIn Professional Connections [500+ Badge]",          rate: 12.00 },
  { name: "Discord Server Members [Online Realistic Avatars]",       rate: 3.80  },
  { name: "Facebook Page Likes [Real Active]",                       rate: 0.95  },
  { name: "Pinterest Profile Followers",                             rate: 2.00  },
  { name: "Threads Profile Followers",                               rate: 1.80  },
  { name: "Snapchat Story Views",                                    rate: 0.20  },
  { name: "Reddit Post Upvotes",                                     rate: 0.80  },
  { name: "Twitch Followers [Non-Drop]",                             rate: 3.00  },
  { name: "Website Organic Traffic [Google Search Ref]",             rate: 0.30  },
  { name: "DA 80+ High Authority Contextual Backlinks",              rate: 14.50 },
  { name: "Google Business 5-Star Reviews [Custom Text]",            rate: 4.50  },
  { name: "iOS App Store Keyword Installs [ASO Boost]",              rate: 1.50  },
  { name: "YouTube 4000 Watch Hours Package",                        rate: 18.90 },
  { name: "Instagram Story Views",                                   rate: 0.05  },
  { name: "TikTok Live Stream Viewers [60 Min]",                     rate: 3.50  },
  { name: "Spotify Track Streams [Chart Booster]",                   rate: 0.65  },
];

const SAMPLE_LINKS = [
  "https://instagram.com/p/abc123xyz",
  "https://tiktok.com/@creator/video/123",
  "https://youtube.com/channel/UCxyz",
  "https://t.me/yourchannel",
  "https://open.spotify.com/track/abc",
  "https://twitter.com/user/status/123",
  "https://linkedin.com/in/username",
  "https://discord.gg/invite/abc",
  "https://facebook.com/page/about",
  "https://pinterest.com/user/board",
  "https://threads.net/@user",
  "https://snapchat.com/add/user",
  "https://reddit.com/r/sub/post/abc",
  "https://twitch.tv/streamer",
  "https://example.com",
];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(randomBetween(0, 23), randomBetween(0, 59));
  return d.toISOString();
};

export const SEED_ORDERS = Array.from({ length: 50 }, (_, i) => {
  const svc      = SEED_SERVICES[i % SEED_SERVICES.length];
  const qty      = randomBetween(500, 50000);
  const charge   = parseFloat(((qty / 1000) * svc.rate * 0.85).toFixed(3));
  const status   = STATUSES[i % STATUSES.length];
  const start    = randomBetween(0, 10000);
  const remains  = status === "Completed" ? 0
                 : status === "Canceled"  ? qty
                 : randomBetween(0, qty);
  return {
    id:            `ORD-${800000 + i * 137}`,
    userName:      CLIENT_NAMES[i % CLIENT_NAMES.length],
    serviceName:   svc.name,
    serviceId:     1000 + (i % 100),
    link:          SAMPLE_LINKS[i % SAMPLE_LINKS.length],
    quantity:      qty,
    charge,
    startCount:    start,
    remains,
    status,
    refillEligible: status === "Completed" || status === "Partial",
    createdAt:     randomDate(i * 2),
  };
});

// Legacy export kept for static references fallback
export const MOCK_ORDERS = SEED_ORDERS;
