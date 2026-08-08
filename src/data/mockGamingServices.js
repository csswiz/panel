// ============================================================
// Extensive Mock Dataset for SMM Panel Game Services & Top-Ups
// Mobile Game Top-Ups, PC Esports Currency, Rank Boosting, Subscriptions
// ============================================================

export const GAME_CATEGORIES = [
  "All Gaming Services",
  "Mobile Game Top-Up",
  "PC & Console Currency",
  "Esports Rank Boosting",
  "Gift Cards & Subscriptions"
];

export const MOCK_GAMING_SERVICES = [
  // MOBILE GAME TOP-UPS
  {
    id: "GAME-101",
    title: "PUBG Mobile Unknown Cash (UC)",
    category: "Mobile Game Top-Up",
    publisher: "Tencent Games",
    platform: "mobile",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    badge: "INSTANT TOP-UP",
    deliveryType: "Player ID Direct",
    ratePerUnit: 0.015, // $0.015 per UC
    packages: [
      { name: "60 UC", amount: 60, price: 0.99 },
      { name: "325 UC", amount: 325, price: 4.99 },
      { name: "660 UC", amount: 660, price: 9.99 },
      { name: "1800 UC", amount: 1800, price: 24.99 },
      { name: "3850 UC", amount: 3850, price: 49.99 },
      { name: "8100 UC", amount: 8100, price: 99.99 }
    ],
    requiredFields: ["Player ID (Numerical)", "Character Name (Optional)", "Server Region"],
    description: "Direct in-game UC top-up for PUBG Mobile. No account password required.",
    status: "Active"
  },
  {
    id: "GAME-102",
    title: "Free Fire Diamonds",
    category: "Mobile Game Top-Up",
    publisher: "Garena",
    platform: "mobile",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    badge: "AUTO TOP-UP",
    deliveryType: "Player ID Direct",
    ratePerUnit: 0.010,
    packages: [
      { name: "100 + 10 Bonus Diamonds", amount: 110, price: 0.99 },
      { name: "310 + 31 Bonus Diamonds", amount: 341, price: 2.99 },
      { name: "520 + 52 Bonus Diamonds", amount: 572, price: 4.99 },
      { name: "1060 + 106 Bonus Diamonds", amount: 1166, price: 9.99 },
      { name: "2180 + 218 Bonus Diamonds", amount: 2398, price: 19.99 },
      { name: "5600 + 560 Bonus Diamonds", amount: 6160, price: 49.99 }
    ],
    requiredFields: ["Player UID", "Server Region (Global / LATAM / Asia)"],
    description: "Garena Free Fire fast diamond reload system. Instant crediting 24/7.",
    status: "Active"
  },
  {
    id: "GAME-103",
    title: "Mobile Legends: Bang Bang Diamonds",
    category: "Mobile Game Top-Up",
    publisher: "Moonton",
    platform: "mobile",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    badge: "FAST RELOAD",
    deliveryType: "User ID + Zone ID",
    ratePerUnit: 0.012,
    packages: [
      { name: "86 Diamonds", amount: 86, price: 1.49 },
      { name: "172 Diamonds", amount: 172, price: 2.99 },
      { name: "257 Diamonds", amount: 257, price: 4.49 },
      { name: "706 Diamonds", amount: 706, price: 11.99 },
      { name: "2195 Diamonds", amount: 2195, price: 34.99 },
      { name: "3688 Diamonds", amount: 3688, price: 59.99 }
    ],
    requiredFields: ["User ID", "Zone ID (in brackets)"],
    description: "MLBB Diamonds fast server recharge. Valid for Starlight Memberships & skins.",
    status: "Active"
  },
  {
    id: "GAME-104",
    title: "Call of Duty: Mobile CP",
    category: "Mobile Game Top-Up",
    publisher: "Activision",
    platform: "mobile",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
    badge: "OFFICIAL SYNC",
    deliveryType: "Player UID",
    ratePerUnit: 0.014,
    packages: [
      { name: "80 CP", amount: 80, price: 0.99 },
      { name: "420 CP", amount: 420, price: 4.99 },
      { name: "880 CP", amount: 880, price: 9.99 },
      { name: "2400 CP", amount: 2400, price: 24.99 },
      { name: "5000 CP", amount: 5000, price: 49.99 }
    ],
    requiredFields: ["Player UID", "Activision Username"],
    description: "COD Mobile Points for Battle Pass, lucky draws, and mythic weapon skins.",
    status: "Active"
  },

  // PC & CONSOLE CURRENCY
  {
    id: "GAME-201",
    title: "Valorant Points (VP)",
    category: "PC & Console Currency",
    publisher: "Riot Games",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    badge: "RIOT DIGITAL CODE",
    deliveryType: "Digital Code / Riot ID",
    ratePerUnit: 0.010,
    packages: [
      { name: "475 VP", amount: 475, price: 4.99 },
      { name: "1000 VP", amount: 1000, price: 9.99 },
      { name: "2050 VP", amount: 2050, price: 19.99 },
      { name: "3650 VP", amount: 3650, price: 34.99 },
      { name: "5350 VP", amount: 5350, price: 49.99 },
      { name: "11000 VP", amount: 11000, price: 99.99 }
    ],
    requiredFields: ["Riot ID Tag (e.g. Player#NA1)", "Region (NA / EU / AP / BR / LATAM)"],
    description: "Official Riot Points code for Valorant weapon bundles, Battle Pass, and Radianite Points.",
    status: "Active"
  },
  {
    id: "GAME-202",
    title: "Roblox Robux",
    category: "PC & Console Currency",
    publisher: "Roblox Corporation",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop&q=80",
    badge: "GAMEPASS / CODE",
    deliveryType: "Roblox Username / Gamepass",
    ratePerUnit: 0.0125,
    packages: [
      { name: "400 Robux", amount: 400, price: 4.99 },
      { name: "800 Robux", amount: 800, price: 9.99 },
      { name: "1700 Robux", amount: 1700, price: 19.99 },
      { name: "4500 Robux", amount: 4500, price: 49.99 },
      { name: "10000 Robux", amount: 10000, price: 99.99 }
    ],
    requiredFields: ["Roblox Username", "Group / Gamepass Link"],
    description: "Fast Roblox currency delivery for avatar items, gamepasses, and developer perks.",
    status: "Active"
  },
  {
    id: "GAME-203",
    title: "Fortnite V-Bucks",
    category: "PC & Console Currency",
    publisher: "Epic Games",
    platform: "console",
    image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&auto=format&fit=crop&q=80",
    badge: "EPIC CODE",
    deliveryType: "Epic Digital Key",
    ratePerUnit: 0.009,
    packages: [
      { name: "1000 V-Bucks", amount: 1000, price: 8.99 },
      { name: "2800 V-Bucks", amount: 2800, price: 22.99 },
      { name: "5000 V-Bucks", amount: 5000, price: 36.99 },
      { name: "13500 V-Bucks", amount: 13500, price: 89.99 }
    ],
    requiredFields: ["Epic Games Account Email / Username"],
    description: "Universal Fortnite V-Bucks key redeemable on PC, PlayStation, Xbox, and Switch.",
    status: "Active"
  },

  // ESPORTS RANK BOOSTING
  {
    id: "GAME-301",
    title: "Valorant Competitive Rank Boost",
    category: "Esports Rank Boosting",
    publisher: "Radiant Boost Squad",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    badge: "PRO PLAYERS ONLY",
    deliveryType: "Duo Queue / Solo Pilot",
    ratePerUnit: 15.00,
    packages: [
      { name: "Iron to Silver (1 Rank)", amount: 1, price: 14.99 },
      { name: "Gold to Platinum (1 Rank)", amount: 1, price: 24.99 },
      { name: "Diamond to Ascendant (1 Rank)", amount: 1, price: 39.99 },
      { name: "Immortal 1 to Immortal 3", amount: 1, price: 79.99 },
      { name: "Radiant Top 500 Placement", amount: 1, price: 149.99 }
    ],
    requiredFields: ["Riot Account Credentials or Duo Queue Tag", "Current Rank & Preferred Agents"],
    description: "Safe competitive rank push by verified Radiant PRO players. VPN protected with stream option.",
    status: "Active"
  },
  {
    id: "GAME-302",
    title: "Apex Legends Predator Rank Boost",
    category: "Esports Rank Boosting",
    publisher: "Apex Master Division",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    badge: "VPN PROTECTED",
    deliveryType: "Duo Carry / Pilot",
    ratePerUnit: 20.00,
    packages: [
      { name: "Silver to Gold Tier", amount: 1, price: 19.99 },
      { name: "Gold to Platinum Tier", amount: 1, price: 34.99 },
      { name: "Platinum to Diamond Tier", amount: 1, price: 59.99 },
      { name: "Diamond to Master Rank", amount: 1, price: 99.99 },
      { name: "Apex Predator Placement (1000 RP)", amount: 1, price: 179.99 }
    ],
    requiredFields: ["EA / Steam Account / Tag", "Main Legend Pick"],
    description: "Professional Apex Legends RP push. High K/D boost and badge unlocks included.",
    status: "Active"
  },

  // GIFT CARDS & SUBSCRIPTIONS
  {
    id: "GAME-401",
    title: "Discord Nitro Subscription (Global)",
    category: "Gift Cards & Subscriptions",
    publisher: "Discord Inc.",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7edc?w=600&auto=format&fit=crop&q=80",
    badge: "INSTANT GIFT LINK",
    deliveryType: "Digital Gift Link",
    ratePerUnit: 4.50,
    packages: [
      { name: "1 Month Nitro Basic", amount: 1, price: 2.99 },
      { name: "1 Month Full Nitro + 2 Boosts", amount: 1, price: 6.99 },
      { name: "1 Year Full Nitro Subscription", amount: 1, price: 59.99 }
    ],
    requiredFields: ["Discord Username or Email"],
    description: "Official Discord Nitro gift link. HD streaming, custom emojis, 4000 char limits & server boosts.",
    status: "Active"
  },
  {
    id: "GAME-402",
    title: "Steam Wallet Digital Gift Cards",
    category: "Gift Cards & Subscriptions",
    publisher: "Valve Corporation",
    platform: "pc",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop&q=80",
    badge: "GLOBAL CODE",
    deliveryType: "Steam Key Code",
    ratePerUnit: 1.00,
    packages: [
      { name: "$10 Steam Wallet Card", amount: 10, price: 10.49 },
      { name: "$25 Steam Wallet Card", amount: 25, price: 25.99 },
      { name: "$50 Steam Wallet Card", amount: 50, price: 51.99 },
      { name: "$100 Steam Wallet Card", amount: 100, price: 102.99 }
    ],
    requiredFields: ["Email address for code receipt"],
    description: "Instant Steam Wallet digital codes to buy games, DLCs, CS2 skins, and community items.",
    status: "Active"
  }
];

export const INITIAL_GAMING_ORDERS = [
  {
    id: "G-ORD-901",
    userName: "Alex Vance",
    userEmail: "alex.vance@agencycloud.com",
    gameTitle: "PUBG Mobile Unknown Cash (UC)",
    packageTitle: "660 UC",
    playerDetails: "Player ID: 559821094 (Server: Global)",
    quantity: 660,
    charge: 9.99,
    status: "Completed",
    createdAt: "2026-08-08T10:15:00.000Z"
  },
  {
    id: "G-ORD-902",
    userName: "Account User",
    userEmail: "user@wizard-smm.io",
    gameTitle: "Valorant Points (VP)",
    packageTitle: "2050 VP",
    playerDetails: "Riot ID: Phoenix#NA1 (Region: NA)",
    quantity: 2050,
    charge: 19.99,
    status: "In Progress",
    createdAt: "2026-08-08T11:40:00.000Z"
  }
];
