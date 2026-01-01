export const mockLibraryContent = [
    {
      id: 101,
      type: 'clip',
      user: { name: 'The Homies Hub', username: 'homieshub', avatar: 'HH', verified: true },
      engagement: { likes: 12300, comments: 843, shares: 2100 },
      location: 'Exclusive Content',
      timestamp: '1 day ago',
      content: {
        text: "Behind the Scenes: Our trip to Iceland. Raw, unfiltered footage from the Ring Road adventure.",
        videoId: "101",
        duration: "08:22",
        title: "BTS: Iceland Ring Road",
      },
    },
    {
      id: 102,
      type: 'trip',
      user: { name: 'The Homies Hub', username: 'homieshub', avatar: 'HH', verified: true },
      engagement: { likes: 9800, comments: 450, shares: 1500 },
      location: 'Exclusive Content',
      timestamp: '3 days ago',
      content: {
        text: "The ultimate 1-month solo travel itinerary for Southeast Asia. Everything you need to know, from budgets to hidden gems.",
        trip: {
          title: "Ultimate SEA Backpacking Itinerary",
          duration: "30 Days",
          budget: "$2,000",
          destinations: ["Bangkok", "Chiang Mai", "Ha Long Bay", "Hoi An", "Siem Reap", "Phuket"],
        }
      }
    },
    {
      id: 103,
      type: 'thread',
      user: { name: 'The Homies Hub', username: 'homieshub', avatar: 'HH', verified: true },
      engagement: { likes: 15000, comments: 1200, shares: 3000 },
      location: 'Exclusive Content',
      timestamp: '5 days ago',
      content: {
        text: "Deep Dive: How to handle loneliness on the road as a solo traveler. Let's talk about it.",
        images: [
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500',
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500'
        ]
      }
    },
    {
        id: 104,
        type: 'clip',
        user: { name: 'The Homies Hub', username: 'homieshub', avatar: 'HH', verified: true },
        engagement: { likes: 18000, comments: 1500, shares: 4200 },
        location: 'Exclusive Content',
        timestamp: '1 week ago',
        content: {
          text: "Tutorial: How to film and edit cinematic travel videos with just your phone. Full breakdown inside.",
          videoId: "104",
          duration: "15:45",
          title: "Cinematic Phone Videography",
        },
      },
  ];