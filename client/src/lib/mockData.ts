// Mock data aligned with Prisma schema
export const mockOrganization = {
  id: "org_1",
  name: "Digital Agency Pro",
  slug: "digital-agency-pro",
  subscriptionTier: "ENTERPRISE",
  brandSettings: {
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    colors: {
      primary: "#6b46c1",
      secondary: "#f43f5e"
    },
    domain: "https://dashboard.agencysocial.ai"
  }
};

export const mockUsers = [
  {
    id: "user_1",
    email: "admin@agencypro.com",
    fullName: "Sarah Johnson",
    role: "AGENCY_OWNER",
    organizationId: "org_1"
  },
  {
    id: "user_2",
    email: "manager@agencypro.com",
    fullName: "Mike Chen",
    role: "SOCIAL_MANAGER",
    organizationId: "org_1"
  }
];

export const mockClients = [
  {
    id: "client_1",
    name: "Acme Corp",
    website: "https://acme.example.com",
    timezone: "America/New_York",
    organizationId: "org_1",
    brandVoice: {
      tone: "professional",
      audience: "B2B Enterprise",
      bannedWords: ["cheap", "discount"],
      values: ["innovation", "reliability"]
    }
  },
  {
    id: "client_2",
    name: "TechStart Inc",
    website: "https://techstart.example.com",
    timezone: "America/Los_Angeles",
    organizationId: "org_1",
    brandVoice: {
      tone: "playful",
      audience: "Young developers",
      bannedWords: [],
      values: ["innovation", "community"]
    }
  },
  {
    id: "client_3",
    name: "Bloom Bakery",
    website: "https://bloombakery.example.com",
    timezone: "America/Chicago",
    organizationId: "org_1",
    brandVoice: {
      tone: "warm",
      audience: "Food lovers, families",
      bannedWords: ["artificial"],
      values: ["authenticity", "quality"]
    }
  },
  {
    id: "client_4",
    name: "Elevate Fitness",
    website: "https://elevatefitness.example.com",
    timezone: "America/Denver",
    organizationId: "org_1",
    brandVoice: {
      tone: "motivational",
      audience: "Health-conscious individuals",
      bannedWords: ["lazy"],
      values: ["strength", "wellness"]
    }
  }
];

export const mockSocialAccounts = [
  {
    id: "sa_1",
    platform: "INSTAGRAM",
    platformId: "acme_instagram_id",
    username: "acmecorp",
    clientId: "client_1",
    meta: { followers: 45000, engagement_rate: 2.3 }
  },
  {
    id: "sa_2",
    platform: "FACEBOOK",
    platformId: "acme_facebook_id",
    username: "acmecorp",
    clientId: "client_1",
    meta: { followers: 120000, engagement_rate: 1.8 }
  },
  {
    id: "sa_3",
    platform: "LINKEDIN",
    platformId: "techstart_linkedin_id",
    username: "techstart-inc",
    clientId: "client_2",
    meta: { followers: 12500, engagement_rate: 3.1 }
  },
  {
    id: "sa_4",
    platform: "INSTAGRAM",
    platformId: "bloom_instagram_id",
    username: "bloombakery",
    clientId: "client_3",
    meta: { followers: 67000, engagement_rate: 4.2 }
  },
  {
    id: "sa_5",
    platform: "YOUTUBE",
    platformId: "elevate_youtube_id",
    username: "ElevateFitness",
    clientId: "client_4",
    meta: { subscribers: 156000, engagement_rate: 5.8 }
  }
];

export const mockPostDrafts = [
  {
    id: "post_1",
    title: "Summer Collection Launch",
    caption: "Excited to announce our brand new summer collection! 🌞 Limited time offer - 20% off for early birds. Tap the link in bio to shop now! #Summer #NewArrivals",
    platform: "INSTAGRAM",
    status: "SCHEDULED",
    scheduledAt: new Date("2025-11-24T10:00:00Z"),
    clientId: "client_1",
    socialAccountId: "sa_1",
    hashtags: ["#Summer", "#NewArrivals", "#Fashion"],
    mediaType: "IMAGE"
  },
  {
    id: "post_2",
    title: "AI Breakthrough Post",
    caption: "We just launched our new AI-powered social media manager! Automate your content, save hours every week, and grow your audience faster than ever before. 🚀",
    platform: "LINKEDIN",
    status: "PENDING_APPROVAL",
    clientId: "client_2",
    socialAccountId: "sa_3",
    hashtags: ["#AI", "#SocialMedia", "#Innovation"],
    mediaType: "IMAGE"
  },
  {
    id: "post_3",
    title: "Fresh Pastries Monday",
    caption: "Monday motivation with our fresh croissants! Baked daily with the finest ingredients. Come visit us before they're gone! 🥐✨",
    platform: "INSTAGRAM",
    status: "DRAFT",
    clientId: "client_3",
    socialAccountId: "sa_4",
    hashtags: ["#BakeryLife", "#FreshBaked", "#Monday"],
    mediaType: "IMAGE"
  },
  {
    id: "post_4",
    title: "Workout Transformation",
    caption: "3-month transformation 💪 David's incredible journey with our program. \"I never thought I could do this\" - Now he's crushing his goals every single day!",
    platform: "YOUTUBE",
    status: "SCHEDULED",
    scheduledAt: new Date("2025-11-25T14:00:00Z"),
    clientId: "client_4",
    socialAccountId: "sa_5",
    hashtags: ["#FitnessTransformation", "#Motivation"],
    mediaType: "VIDEO"
  }
];

export const mockAnalytics = [
  {
    clientId: "client_1",
    platform: "INSTAGRAM",
    date: new Date("2025-11-23"),
    impressions: 12450,
    reach: 8230,
    engagement: 287,
    clicks: 156,
    likes: 198,
    comments: 45,
    shares: 44
  },
  {
    clientId: "client_2",
    platform: "LINKEDIN",
    date: new Date("2025-11-23"),
    impressions: 3420,
    reach: 2840,
    engagement: 156,
    clicks: 89,
    likes: 112,
    comments: 23,
    shares: 21
  },
  {
    clientId: "client_3",
    platform: "INSTAGRAM",
    date: new Date("2025-11-23"),
    impressions: 18930,
    reach: 14560,
    engagement: 625,
    clicks: 340,
    likes: 478,
    comments: 89,
    shares: 58
  }
];

export const mockTemplates = [
  {
    id: "template_1",
    name: "Product Launch",
    isSystem: true,
    structure: {
      blocks: [
        { type: "heading", content: "Introducing {product_name}" },
        { type: "image", placeholder: "product_image" },
        { type: "body", content: "{description}" },
        { type: "cta", text: "Shop Now", link: "{link}" }
      ]
    }
  },
  {
    id: "template_2",
    name: "Behind the Scenes",
    isSystem: true,
    structure: {
      blocks: [
        { type: "heading", content: "Behind the Scenes 👀" },
        { type: "carousel", placeholder: "media_carousel" },
        { type: "body", content: "{story}" }
      ]
    }
  }
];

export const mockAIUsage = {
  organizationId: "org_1",
  month: new Date("2025-11-01"),
  tokensUsed: 12450,
  imagesGenerated: 24,
  videoMinutes: 45,
  costEstimate: 187.50
};

export const mockApprovals = [
  {
    id: "approval_1",
    postDraftId: "post_2",
    userId: "user_1",
    action: "REQUESTED",
    comment: "Please review this LinkedIn post before publishing",
    createdAt: new Date("2025-11-23T09:30:00Z")
  }
];
