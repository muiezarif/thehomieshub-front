import React from 'react';
import { Helmet } from 'react-helmet';
import VerticalVideoFeed from '@/components/VerticalVideoFeed';
import { verticalMockPosts } from '@/data/verticalMockPosts';

const MomentsPage = ({ onLoginRequest, aspectRatio }) => { // Renamed ReelsPage to MomentsPage
  const shuffledPosts = [...verticalMockPosts].sort(() => Math.random() - 0.5);

  return (
    <div className="relative h-full w-full">
      <Helmet>
        <title>Moments - Discover New Adventures - The Homies Hub</title> {/* Updated title */}
        <meta name="description" content="Discover trending and new travel Moments. Find your next adventure on The Homies Hub." /> {/* Updated meta description */}
      </Helmet>
      <VerticalVideoFeed posts={shuffledPosts} onLoginRequest={onLoginRequest} aspectRatio={aspectRatio} />
    </div>
  );
};

export default MomentsPage; // Exporting MomentsPage