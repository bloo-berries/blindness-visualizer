import React from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  videoUrl: string;
  onReady: (event: { target: any }) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl, onReady }) => {
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  return (
    <YouTube
      videoId={videoId || ''}
      opts={{
        height: '360',
        width: '640',
        playerVars: {
          autoplay: 1,
          controls: 0,
        },
      }}
      onReady={onReady}
    />
  );
};

export default YouTubePlayer; 