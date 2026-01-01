export const mockCommunityPosts = [
  {
    id: 'mint-1',
    type: 'mint',
    status: 'published',
    user: {
      name: 'Alex Nomad',
      username: 'alexnomad',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
      verified: true,
    },
    timestamp: '15m',
    content: {
      text: 'Found this hidden gem in the backstreets of Tokyo. Verified moment.',
    },
    mintData: {
        title: "Hidden Tokyo Alleyway",
        description: "A rare glimpse into the quiet backstreets of Shibuya during golden hour. Captured on location.",
        creator: { name: 'Alex Nomad', username: 'alexnomad', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces' },
        timestamp: "Oct 25, 2025 • 4:32 PM",
        location: { lat: 35.6580, lng: 139.7016, name: "Shibuya, Tokyo" },
        asaId: 4829103,
        transactionId: "TX-8923-JKA-292",
        edition: 1,
        totalEditions: 1,
        isVerifiedLocation: true,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop"
    },
    engagement: {
      likes: 89,
      comments: 12,
      shares: 4,
    },
  },
  {
    id: 'comm-1',
    type: 'text',
    status: 'published',
    user: {
      name: 'Marco P.',
      username: 'marcopolo',
      avatar: 'MP',
      verified: true,
    },
    timestamp: '2h',
    location: 'Kyoto, Japan',
    content: {
      text: 'Just landed in Kyoto. The blend of ancient temples and modern life is breathtaking. Any must-see spots off the beaten path? #Japan #Kyoto #Travel',
    },
    engagement: {
      likes: 125,
      comments: 18,
      shares: 5,
    },
  },
  {
    id: 'comm-2',
    type: 'clip',
    status: 'published',
    user: {
      name: 'Drone Pilot Dave',
      username: 'dronedave',
      avatar: 'DD',
      verified: false,
    },
    timestamp: '5h',
    location: 'Interlaken, Switzerland',
    content: {
      text: 'Morning flight over Interlaken. The views are just unreal! 🏔️',
      videoId: '1',
      title: 'Swiss Alps Drone Footage',
      thumbnail: 'Drone shot of the Swiss Alps in Interlaken',
      duration: '02:15',
    },
    engagement: {
      likes: 482,
      comments: 45,
      shares: 22,
    },
  },
  {
    id: 'comm-3',
    type: 'thread',
    status: 'flagged',
    user: {
      name: 'Samwise G.',
      username: 'samtravels',
      avatar: 'SG',
      verified: true,
    },
    timestamp: '1d',
    content: {
      text: 'My camera roll from the streets of Lisbon. The colors, the tiles, the trams... pure magic. A thread 🧵',
      images: [
        { description: "A classic yellow tram on a narrow Lisbon street" },
        { description: "Colorful buildings with intricate tile patterns in Lisbon" },
      ]
    },
    // Mocking an unverified mint on a normal thread
    mintData: {
        title: "Lisbon Colors Thread",
        description: "Unverified Mint from Thread",
        creator: { name: 'Samwise G.', username: 'samtravels', avatar: 'SG' },
        timestamp: "Oct 24, 2025",
        asaId: 9928311,
        transactionId: "TX-UNV-112",
        edition: 1,
        totalEditions: 50,
        isVerifiedLocation: false,
        image: "https://images.unsplash.com/photo-1595872018818-97555653a011" // Assuming 1st image
    },
    engagement: {
      likes: 830,
      comments: 98,
      shares: 50,
    },
  },
  {
    id: 'comm-4',
    type: 'poll',
    status: 'published',
    user: {
      name: 'Backpacker Ben',
      username: 'bennyboy',
      avatar: 'BB',
      verified: false,
    },
    timestamp: '2d',
    content: {
      text: 'Planning my next big trip. Help me decide, homies!',
      poll: {
        question: 'Which continent for a 3-month backpacking trip?',
        options: [
          { text: 'South America', percentage: 45 },
          { text: 'Southeast Asia', percentage: 38 },
          { text: 'Eastern Europe', percentage: 17 },
        ],
        totalVotes: '2.1k',
        endsIn: '3d',
      },
    },
    engagement: {
      likes: 205,
      comments: 64,
      shares: 11,
    },
  },
  {
    id: 'comm-5',
    type: 'trip',
    status: 'deleted',
    user: {
      name: 'Roadtrip Ryan',
      username: 'ryan_roams',
      avatar: 'RR',
      verified: true,
    },
    timestamp: '4d',
    content: {
      text: "Just planned out my Pacific Coast Highway road trip itinerary! Can't wait to hit the road. Anyone done this drive before? Tips welcome!",
      trip: {
        title: "PCH Dream Drive: SF to LA",
        coverImageDescription: "A car driving along a coastal highway at sunset",
        duration: "7 Days",
        budget: "$1,500",
        destinations: ["San Francisco", "Big Sur", "Santa Barbara", "Los Angeles"]
      }
    },
    engagement: {
      likes: 315,
      comments: 88,
      shares: 19,
    },
  },
];