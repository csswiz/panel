// ============================================================
// Extensive Mock Dataset for SMM Panel Services (5200+ services)
// Covers 18 platforms, 50+ categories, multi-tier quality system
// ============================================================

export const PLATFORMS = [
  { id: "all",       name: "All Services",      icon: "Sparkles",      color: "indigo"  },
  { id: "instagram", name: "Instagram",          icon: "Instagram",     color: "pink"    },
  { id: "tiktok",   name: "TikTok",             icon: "Video",         color: "cyan"    },
  { id: "youtube",  name: "YouTube",             icon: "Youtube",       color: "red"     },
  { id: "telegram", name: "Telegram",            icon: "Send",          color: "sky"     },
  { id: "spotify",  name: "Spotify",             icon: "Music",         color: "emerald" },
  { id: "twitter",  name: "X / Twitter",         icon: "Twitter",       color: "slate"   },
  { id: "linkedin", name: "LinkedIn",            icon: "Linkedin",      color: "blue"    },
  { id: "discord",  name: "Discord",             icon: "MessageSquare", color: "violet"  },
  { id: "facebook", name: "Facebook",            icon: "Facebook",      color: "blue"    },
  { id: "pinterest",name: "Pinterest",           icon: "Pin",           color: "rose"    },
  { id: "threads",  name: "Threads",             icon: "AtSign",        color: "slate"   },
  { id: "snapchat", name: "Snapchat",            icon: "Ghost",         color: "yellow"  },
  { id: "reddit",   name: "Reddit",              icon: "Flame",         color: "orange"  },
  { id: "twitch",   name: "Twitch",              icon: "Tv",            color: "purple"  },
  { id: "traffic",  name: "Website Traffic",     icon: "Globe",         color: "teal"    },
  { id: "seo",      name: "SEO & Backlinks",     icon: "Search",        color: "indigo"  },
  { id: "reviews",  name: "Google Reviews",      icon: "Star",          color: "amber"   },
  { id: "apps",     name: "App Downloads",       icon: "Smartphone",    color: "green"   },
];

export const CATEGORIES = [
  "Instagram Followers - High Quality",
  "Instagram Followers - Ultra Real",
  "Instagram Followers - Geo Targeted",
  "Instagram Likes - Instant & Auto",
  "Instagram Likes - Organic Growth",
  "Instagram Reels Views & Engagement",
  "Instagram Story Views & Poll Votes",
  "Instagram Comments & Custom Emoji",
  "Instagram Saves & Profile Visits",
  "Instagram Impressions & Reach",
  "TikTok Followers - Real Accounts",
  "TikTok Followers - High Quality",
  "TikTok Likes & Video Shares",
  "TikTok Views - High Retention",
  "TikTok Comments & Custom Text",
  "TikTok Live Stream Viewers",
  "TikTok Saves & Bookmarks",
  "YouTube Subscribers - Non-Drop 30D Refill",
  "YouTube Watch Time Hours (Monetization)",
  "YouTube Views - Targeted & Geo Speed",
  "YouTube Likes & High Retention",
  "YouTube Comments & Custom Text",
  "YouTube Shorts Views & Engagement",
  "YouTube Members & Super Thanks",
  "Telegram Channel Members & Broadcasts",
  "Telegram Post Views & Auto Reaction",
  "Telegram Group Members & Boosts",
  "Telegram Emoji Reactions",
  "Spotify Monthly Listeners & Streams",
  "Spotify Playlist Followers",
  "Spotify Track Saves & Likes",
  "Spotify Artist Followers",
  "X / Twitter Followers & Premium Blue",
  "X / Twitter Retweets, Likes & Quotes",
  "X / Twitter Impressions & Profile Visits",
  "X / Twitter Space Listeners",
  "LinkedIn Connections & Post Likes",
  "LinkedIn Page Followers & Impressions",
  "LinkedIn Comments & Shares",
  "Discord Guild Members & Server Boosts (Level 3)",
  "Discord Reactions & Voice Members",
  "Facebook Page Likes & Profile Followers",
  "Facebook Post Likes & Shares",
  "Facebook Group Members & Comments",
  "Facebook Video Views & Watch Time",
  "Pinterest Followers & Board Followers",
  "Pinterest Saves & Impressions",
  "Threads Followers & Likes",
  "Threads Reposts & Comments",
  "Snapchat Followers & Story Views",
  "Snapchat Score Boosts",
  "Reddit Upvotes & Awards",
  "Reddit Karma & Subreddit Members",
  "Twitch Followers & Channel Views",
  "Twitch Live Viewers & Clips",
  "Website Traffic - Geo Targeted High Session",
  "Website Traffic - Social Referral",
  "SEO High DA Backlinks & Guest Posts",
  "SEO Niche Edits & Anchor Text",
  "Google Reviews 5-Star - Organic Drip",
  "Trustpilot & Yelp Reviews",
  "App Store & Play Store Reviews & Installs",
  "iOS Keyword Installs & Ratings",
];

const generateServices = () => {
  const services = [];
  let id = 1000;
  let counter = 0;

  const qualityTiers = [
    { label: "Economy",       multiplier: 0.60 },
    { label: "Standard",      multiplier: 1.00 },
    { label: "Premium",       multiplier: 1.50 },
    { label: "Ultra Premium", multiplier: 2.20 },
    { label: "VIP Exclusive", multiplier: 3.50 },
  ];

  const speedTiers = [
    { label: "Instant",      eta: "Instant"      },
    { label: "Super Fast",   eta: "0 - 15 mins"  },
    { label: "High Speed",   eta: "15 - 60 mins" },
    { label: "Drip Feed",    eta: "Drip Feed"    },
    { label: "Organic Slow", eta: "6 - 72 hours" },
  ];

  const refillOptions = ["30 Days Refill", "60 Days Refill", "Lifetime Guarantee", "Auto Refill", "No Refill"];
  const geoTargets    = ["Global Mix","USA","UK","EU Mix","India","Brazil","Germany","France","Canada","Australia","UAE","Saudi Arabia","Japan","South Korea","Mexico","Indonesia","Pakistan","Nigeria","Turkey","Russia","Thailand","Philippines","Vietnam","Egypt"];
  const serverNums    = Array.from({ length: 20 }, (_, i) => i + 1);

  const templates = [
    // INSTAGRAM
    { platform:"instagram", category:"Instagram Followers - High Quality",   name:"Instagram Real Followers",                        min:50,   max:500000,   baseRate:0.85  },
    { platform:"instagram", category:"Instagram Followers - Ultra Real",      name:"Instagram Ultra-Real Active Followers",           min:50,   max:200000,   baseRate:1.60  },
    { platform:"instagram", category:"Instagram Followers - Geo Targeted",    name:"Instagram Geo-Targeted Followers",                min:100,  max:50000,    baseRate:2.40  },
    { platform:"instagram", category:"Instagram Followers - High Quality",   name:"Instagram Organic Drip-Feed Followers",           min:500,  max:100000,   baseRate:1.20  },
    { platform:"instagram", category:"Instagram Likes - Instant & Auto",     name:"Instagram Photo / Video Likes",                   min:20,   max:100000,   baseRate:0.12  },
    { platform:"instagram", category:"Instagram Likes - Instant & Auto",     name:"Instagram Auto-Monthly Subscription Likes",       min:100,  max:50000,    baseRate:0.35  },
    { platform:"instagram", category:"Instagram Likes - Organic Growth",     name:"Instagram Organic Slow Likes",                    min:50,   max:30000,    baseRate:0.50  },
    { platform:"instagram", category:"Instagram Reels Views & Engagement",   name:"Instagram Reels Views",                           min:100,  max:10000000, baseRate:0.02  },
    { platform:"instagram", category:"Instagram Reels Views & Engagement",   name:"Instagram Reels Shares & Saves",                  min:50,   max:500000,   baseRate:0.10  },
    { platform:"instagram", category:"Instagram Story Views & Poll Votes",   name:"Instagram Story Views",                           min:100,  max:500000,   baseRate:0.05  },
    { platform:"instagram", category:"Instagram Story Views & Poll Votes",   name:"Instagram Story Poll Votes",                      min:100,  max:50000,    baseRate:0.40  },
    { platform:"instagram", category:"Instagram Comments & Custom Emoji",    name:"Instagram Random Positive Comments",              min:5,    max:500,      baseRate:4.00  },
    { platform:"instagram", category:"Instagram Comments & Custom Emoji",    name:"Instagram Custom Text Comments",                  min:5,    max:200,      baseRate:12.00 },
    { platform:"instagram", category:"Instagram Comments & Custom Emoji",    name:"Instagram Verified Blue-Check Comments",          min:5,    max:100,      baseRate:18.00 },
    { platform:"instagram", category:"Instagram Saves & Profile Visits",     name:"Instagram Post Saves",                            min:50,   max:100000,   baseRate:0.20  },
    { platform:"instagram", category:"Instagram Saves & Profile Visits",     name:"Instagram Profile Visits",                        min:1000, max:1000000,  baseRate:0.08  },
    { platform:"instagram", category:"Instagram Impressions & Reach",        name:"Instagram Impressions Boost",                     min:1000, max:5000000,  baseRate:0.03  },
    // TIKTOK
    { platform:"tiktok", category:"TikTok Followers - Real Accounts",   name:"TikTok Followers [Non-Drop]",               min:100,  max:200000,  baseRate:1.10 },
    { platform:"tiktok", category:"TikTok Followers - High Quality",    name:"TikTok HQ Followers",                       min:50,   max:100000,  baseRate:1.80 },
    { platform:"tiktok", category:"TikTok Likes & Video Shares",        name:"TikTok Video Likes",                        min:50,   max:100000,  baseRate:0.18 },
    { platform:"tiktok", category:"TikTok Likes & Video Shares",        name:"TikTok Video Shares & Favorites",           min:100,  max:500000,  baseRate:0.08 },
    { platform:"tiktok", category:"TikTok Views - High Retention",      name:"TikTok Video Views",                        min:500,  max:5000000, baseRate:0.03 },
    { platform:"tiktok", category:"TikTok Views - High Retention",      name:"TikTok High Retention Views [60% Watch]",   min:500,  max:2000000, baseRate:0.09 },
    { platform:"tiktok", category:"TikTok Comments & Custom Text",      name:"TikTok Random Comments",                    min:10,   max:500,     baseRate:3.50 },
    { platform:"tiktok", category:"TikTok Comments & Custom Text",      name:"TikTok Custom Text Comments",               min:5,    max:200,     baseRate:10.00},
    { platform:"tiktok", category:"TikTok Live Stream Viewers",         name:"TikTok Live Stream Viewers [60 Min]",       min:50,   max:10000,   baseRate:3.50 },
    { platform:"tiktok", category:"TikTok Live Stream Viewers",         name:"TikTok Live Stream Viewers [120 Min]",      min:50,   max:5000,    baseRate:6.00 },
    { platform:"tiktok", category:"TikTok Saves & Bookmarks",           name:"TikTok Video Saves",                        min:100,  max:200000,  baseRate:0.15 },
    // YOUTUBE
    { platform:"youtube", category:"YouTube Subscribers - Non-Drop 30D Refill", name:"YouTube Channel Subscribers [Monetization Safe]", min:100,  max:50000,   baseRate:6.50  },
    { platform:"youtube", category:"YouTube Watch Time Hours (Monetization)",   name:"YouTube 4000 Watch Hours Package",               min:1000, max:4000,    baseRate:18.90 },
    { platform:"youtube", category:"YouTube Watch Time Hours (Monetization)",   name:"YouTube Watch Time [High Retention]",             min:500,  max:10000,   baseRate:14.00 },
    { platform:"youtube", category:"YouTube Views - Targeted & Geo Speed",     name:"YouTube High Retention Views",                   min:500,  max:5000000, baseRate:0.95  },
    { platform:"youtube", category:"YouTube Views - Targeted & Geo Speed",     name:"YouTube Geo-Targeted Views",                     min:500,  max:1000000, baseRate:1.50  },
    { platform:"youtube", category:"YouTube Likes & High Retention",           name:"YouTube Likes [Real Accounts]",                  min:50,   max:100000,  baseRate:0.80  },
    { platform:"youtube", category:"YouTube Comments & Custom Text",           name:"YouTube Random Comments",                        min:5,    max:500,     baseRate:5.00  },
    { platform:"youtube", category:"YouTube Comments & Custom Text",           name:"YouTube Custom Text Comments",                   min:5,    max:200,     baseRate:14.00 },
    { platform:"youtube", category:"YouTube Shorts Views & Engagement",        name:"YouTube Shorts Views",                           min:500,  max:5000000, baseRate:0.04  },
    { platform:"youtube", category:"YouTube Shorts Views & Engagement",        name:"YouTube Shorts Likes & Comments",                min:50,   max:10000,   baseRate:0.90  },
    { platform:"youtube", category:"YouTube Members & Super Thanks",           name:"YouTube Channel Members",                        min:10,   max:1000,    baseRate:22.00 },
    // TELEGRAM
    { platform:"telegram", category:"Telegram Channel Members & Broadcasts", name:"Telegram Public Channel Members [Non-Drop]", min:100,  max:500000, baseRate:0.45 },
    { platform:"telegram", category:"Telegram Channel Members & Broadcasts", name:"Telegram Private Channel Members",           min:100,  max:100000, baseRate:1.20 },
    { platform:"telegram", category:"Telegram Post Views & Auto Reaction",   name:"Telegram Last 10 Posts Automatic Views",     min:100,  max:100000, baseRate:0.05 },
    { platform:"telegram", category:"Telegram Post Views & Auto Reaction",   name:"Telegram Post Views",                        min:100,  max:500000, baseRate:0.03 },
    { platform:"telegram", category:"Telegram Emoji Reactions",              name:"Telegram Custom Emoji Reactions",            min:100,  max:50000,  baseRate:0.15 },
    { platform:"telegram", category:"Telegram Group Members & Boosts",       name:"Telegram Group Members [Real]",              min:100,  max:200000, baseRate:0.60 },
    { platform:"telegram", category:"Telegram Group Members & Boosts",       name:"Telegram Channel Boosts",                   min:10,   max:10000,  baseRate:2.50 },
    // SPOTIFY
    { platform:"spotify", category:"Spotify Monthly Listeners & Streams", name:"Spotify Monthly Listeners [Royalty Safe]", min:1000,  max:1000000, baseRate:1.25 },
    { platform:"spotify", category:"Spotify Monthly Listeners & Streams", name:"Spotify Track Streams [Chart Booster]",     min:1000,  max:5000000, baseRate:0.65 },
    { platform:"spotify", category:"Spotify Playlist Followers",          name:"Spotify Playlist Followers",               min:100,   max:100000,  baseRate:0.90 },
    { platform:"spotify", category:"Spotify Track Saves & Likes",         name:"Spotify Track Saves / Likes",              min:500,   max:500000,  baseRate:0.50 },
    { platform:"spotify", category:"Spotify Artist Followers",            name:"Spotify Artist Followers",                 min:500,   max:200000,  baseRate:1.10 },
    // X / TWITTER
    { platform:"twitter", category:"X / Twitter Followers & Premium Blue",     name:"X / Twitter Real Followers [Non-Drop]",    min:100,  max:100000,  baseRate:2.10 },
    { platform:"twitter", category:"X / Twitter Followers & Premium Blue",     name:"X / Twitter Premium Blue Followers",       min:50,   max:20000,   baseRate:4.50 },
    { platform:"twitter", category:"X / Twitter Retweets, Likes & Quotes",    name:"X / Twitter Retweets & Favorites Bundle",  min:50,   max:50000,   baseRate:0.70 },
    { platform:"twitter", category:"X / Twitter Retweets, Likes & Quotes",    name:"X / Twitter Quote Tweets",                 min:10,   max:10000,   baseRate:1.80 },
    { platform:"twitter", category:"X / Twitter Impressions & Profile Visits", name:"X / Twitter Tweet Impressions",            min:1000, max:5000000, baseRate:0.08 },
    { platform:"twitter", category:"X / Twitter Space Listeners",             name:"X / Twitter Space Live Listeners",         min:50,   max:10000,   baseRate:5.00 },
    // LINKEDIN
    { platform:"linkedin", category:"LinkedIn Connections & Post Likes",     name:"LinkedIn Professional Connections [500+ Badge]", min:50,  max:5000,  baseRate:12.00 },
    { platform:"linkedin", category:"LinkedIn Connections & Post Likes",     name:"LinkedIn Post Likes & Reactions",               min:25,  max:2000,  baseRate:4.50  },
    { platform:"linkedin", category:"LinkedIn Page Followers & Impressions", name:"LinkedIn Company Page Followers",               min:50,  max:10000, baseRate:8.00  },
    { platform:"linkedin", category:"LinkedIn Comments & Shares",            name:"LinkedIn Post Comments",                        min:5,   max:500,   baseRate:18.00 },
    // DISCORD
    { platform:"discord", category:"Discord Guild Members & Server Boosts (Level 3)", name:"Discord Server Members [Online Avatars]",    min:100, max:20000, baseRate:3.80  },
    { platform:"discord", category:"Discord Guild Members & Server Boosts (Level 3)", name:"Discord 14x Server Boosts [Level 3 Unlock]", min:14,  max:56,    baseRate:28.00 },
    { platform:"discord", category:"Discord Reactions & Voice Members",               name:"Discord Message Reactions",                  min:50,  max:10000, baseRate:1.50  },
    { platform:"discord", category:"Discord Reactions & Voice Members",               name:"Discord Voice Channel Members [30 Min]",     min:10,  max:500,   baseRate:8.00  },
    // FACEBOOK
    { platform:"facebook", category:"Facebook Page Likes & Profile Followers", name:"Facebook Page Likes [Real Active]",    min:100,  max:100000,  baseRate:0.95 },
    { platform:"facebook", category:"Facebook Page Likes & Profile Followers", name:"Facebook Profile Followers",           min:100,  max:50000,   baseRate:1.10 },
    { platform:"facebook", category:"Facebook Post Likes & Shares",            name:"Facebook Post Likes",                  min:50,   max:50000,   baseRate:0.60 },
    { platform:"facebook", category:"Facebook Post Likes & Shares",            name:"Facebook Post Shares",                 min:50,   max:20000,   baseRate:1.20 },
    { platform:"facebook", category:"Facebook Group Members & Comments",       name:"Facebook Group Members",               min:100,  max:100000,  baseRate:0.80 },
    { platform:"facebook", category:"Facebook Video Views & Watch Time",       name:"Facebook Video Views",                 min:500,  max:1000000, baseRate:0.15 },
    { platform:"facebook", category:"Facebook Video Views & Watch Time",       name:"Facebook Live Stream Views [30 Min]",  min:50,   max:5000,    baseRate:4.00 },
    // PINTEREST
    { platform:"pinterest", category:"Pinterest Followers & Board Followers", name:"Pinterest Profile Followers", min:100,  max:50000,  baseRate:2.00 },
    { platform:"pinterest", category:"Pinterest Followers & Board Followers", name:"Pinterest Board Followers",   min:100,  max:50000,  baseRate:1.50 },
    { platform:"pinterest", category:"Pinterest Saves & Impressions",         name:"Pinterest Pin Saves / Repins",min:100,  max:100000, baseRate:0.45 },
    { platform:"pinterest", category:"Pinterest Saves & Impressions",         name:"Pinterest Impressions",       min:1000, max:500000, baseRate:0.12 },
    // THREADS
    { platform:"threads", category:"Threads Followers & Likes",  name:"Threads Profile Followers", min:100, max:100000, baseRate:1.80 },
    { platform:"threads", category:"Threads Followers & Likes",  name:"Threads Post Likes",        min:50,  max:50000,  baseRate:0.30 },
    { platform:"threads", category:"Threads Reposts & Comments", name:"Threads Reposts",           min:50,  max:20000,  baseRate:0.90 },
    { platform:"threads", category:"Threads Reposts & Comments", name:"Threads Comments [Random]", min:5,   max:500,    baseRate:4.00 },
    // SNAPCHAT
    { platform:"snapchat", category:"Snapchat Followers & Story Views", name:"Snapchat Followers",   min:100,  max:50000,  baseRate:2.50 },
    { platform:"snapchat", category:"Snapchat Followers & Story Views", name:"Snapchat Story Views", min:500,  max:500000, baseRate:0.20 },
    { platform:"snapchat", category:"Snapchat Score Boosts",            name:"Snapchat Score Boost", min:1000, max:500000, baseRate:0.35 },
    // REDDIT
    { platform:"reddit", category:"Reddit Upvotes & Awards",          name:"Reddit Post Upvotes",      min:50,  max:50000,  baseRate:0.80 },
    { platform:"reddit", category:"Reddit Upvotes & Awards",          name:"Reddit Comment Upvotes",   min:50,  max:20000,  baseRate:0.90 },
    { platform:"reddit", category:"Reddit Karma & Subreddit Members", name:"Reddit Karma Boost",       min:100, max:100000, baseRate:0.60 },
    { platform:"reddit", category:"Reddit Karma & Subreddit Members", name:"Reddit Subreddit Members", min:100, max:50000,  baseRate:1.20 },
    // TWITCH
    { platform:"twitch", category:"Twitch Followers & Channel Views", name:"Twitch Followers [Non-Drop]",         min:100,  max:50000,   baseRate:3.00 },
    { platform:"twitch", category:"Twitch Followers & Channel Views", name:"Twitch Channel Views",               min:1000, max:1000000, baseRate:0.40 },
    { platform:"twitch", category:"Twitch Live Viewers & Clips",      name:"Twitch Live Concurrent Viewers [60 Min]", min:50, max:5000,  baseRate:6.00 },
    { platform:"twitch", category:"Twitch Live Viewers & Clips",      name:"Twitch Clip Views",                  min:500,  max:500000,  baseRate:0.25 },
    // WEBSITE TRAFFIC
    { platform:"traffic", category:"Website Traffic - Geo Targeted High Session", name:"Organic Website Traffic [Google Search Ref]", min:1000, max:1000000, baseRate:0.30 },
    { platform:"traffic", category:"Website Traffic - Geo Targeted High Session", name:"Direct Website Traffic",                     min:1000, max:500000,  baseRate:0.20 },
    { platform:"traffic", category:"Website Traffic - Social Referral",           name:"Social Referral Traffic",                    min:1000, max:500000,  baseRate:0.25 },
    { platform:"traffic", category:"Website Traffic - Geo Targeted High Session", name:"Bing / Yahoo Search Traffic",                min:1000, max:300000,  baseRate:0.22 },
    // SEO
    { platform:"seo", category:"SEO High DA Backlinks & Guest Posts", name:"DA 80+ High Authority Contextual Backlinks", min:10, max:500, baseRate:14.50 },
    { platform:"seo", category:"SEO High DA Backlinks & Guest Posts", name:"Guest Post on DA 50+ Blog",                 min:5,  max:100, baseRate:28.00 },
    { platform:"seo", category:"SEO Niche Edits & Anchor Text",       name:"Niche Edits [Anchor Text Links]",           min:5,  max:200, baseRate:22.00 },
    { platform:"seo", category:"SEO Niche Edits & Anchor Text",       name:"PBN Backlinks [DA 30-60]",                  min:10, max:500, baseRate:6.50  },
    // REVIEWS
    { platform:"reviews", category:"Google Reviews 5-Star - Organic Drip", name:"Google Business 5-Star Reviews [Custom Text]", min:1, max:100, baseRate:4.50 },
    { platform:"reviews", category:"Google Reviews 5-Star - Organic Drip", name:"Google Maps Reviews [Local IP]",               min:1, max:50,  baseRate:6.00 },
    { platform:"reviews", category:"Trustpilot & Yelp Reviews",            name:"Trustpilot 5-Star Reviews [Verified]",          min:1, max:50,  baseRate:9.00 },
    { platform:"reviews", category:"Trustpilot & Yelp Reviews",            name:"Yelp Reviews [Local IP Rotate]",                min:1, max:30,  baseRate:8.00 },
    // APPS
    { platform:"apps", category:"App Store & Play Store Reviews & Installs", name:"Google Play Store Installs [Real Users]",    min:50, max:50000, baseRate:0.70 },
    { platform:"apps", category:"App Store & Play Store Reviews & Installs", name:"iOS App Store Installs [Real Users]",        min:50, max:20000, baseRate:0.90 },
    { platform:"apps", category:"iOS Keyword Installs & Ratings",            name:"iOS Keyword Installs [ASO Boost]",           min:50, max:10000, baseRate:1.50 },
    { platform:"apps", category:"App Store & Play Store Reviews & Installs", name:"Google Play Store Ratings [5-Star]",         min:10, max:5000,  baseRate:1.20 },
    { platform:"apps", category:"iOS Keyword Installs & Ratings",            name:"iOS App Store Ratings [5-Star]",             min:10, max:5000,  baseRate:1.40 },
  ];

  const descFor = (platform, geo) =>
    `Premium ${platform.toUpperCase()} optimization${geo ? ` targeting ${geo}` : ""}.` +
    " Guaranteed delivery within 15 minutes. High retention rate and 24/7 automated refill monitoring. API compatible for bulk orders.";

  // Phase 1 - quality x speed matrix (2500 services for 100 templates)
  for (const tmpl of templates) {
    for (const qt of qualityTiers) {
      for (const sp of speedTiers) {
        const geo    = geoTargets[counter % geoTargets.length];
        const server = serverNums[counter % serverNums.length];
        const refill = refillOptions[counter % refillOptions.length];
        const isBase = qt.label === "Standard" && sp.label === "Instant";
        const suffix = isBase ? "" : ` [${qt.label} • ${sp.label} • ${geo} • S${server}]`;
        const rate   = parseFloat((tmpl.baseRate * qt.multiplier).toFixed(3));
        const maxVal = Math.max(tmpl.min, Math.round(tmpl.max * (qt.multiplier > 1 ? qt.multiplier : 1)));

        services.push({
          id:          ++id,
          platform:    tmpl.platform,
          category:    tmpl.category,
          name:        tmpl.name + suffix,
          min:         tmpl.min,
          max:         maxVal,
          rate,
          eta:         sp.eta,
          badge:       isBase ? "Standard" : (qt.label === "VIP Exclusive" ? "VIP" : refill),
          description: descFor(tmpl.platform, isBase ? null : geo),
          status:      "Active",
          popular:     counter % 9 === 0,
          favorite:    counter % 7 === 0,
        });
        counter++;
      }
    }
  }

  // Phase 2 - geo x refill named variants (2700 services for 100 templates)
  const extraGeo    = ["USA","UK","India","Brazil","Germany","France","Canada","Australia","UAE"];
  const extraRefill = ["Lifetime Guarantee","60 Days Refill","Auto Refill"];

  for (const tmpl of templates) {
    for (const geo of extraGeo) {
      for (const refill of extraRefill) {
        const rate = parseFloat((tmpl.baseRate * 1.30).toFixed(3));
        services.push({
          id:          ++id,
          platform:    tmpl.platform,
          category:    tmpl.category,
          name:        `${tmpl.name} [${geo} • ${refill}]`,
          min:         tmpl.min,
          max:         tmpl.max,
          rate,
          eta:         "1 - 6 hours",
          badge:       `${geo}`,
          description: descFor(tmpl.platform, geo),
          status:      "Active",
          popular:     counter % 11 === 0,
          favorite:    counter % 8 === 0,
        });
        counter++;
      }
    }
  }

  return services;
};

export const MOCK_SERVICES = generateServices();
