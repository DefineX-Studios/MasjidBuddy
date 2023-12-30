//Import useState and useEffect react native
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import type { Track } from 'react-native-track-player';
import TrackPlayer, { TrackType } from 'react-native-track-player';

const streamDetails: Track = {
  url: 'http://localhost:3000/stream',
  title: 'Test Stream',
  artist: 'Test Artist',
  isLiveStream: true,
  type: TrackType.HLS,
};

TrackPlayer.add(streamDetails);

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      console.log('Playing');
      TrackPlayer.play();
    } else {
      console.log('Paused');
      TrackPlayer.pause();
    }
  }, [isPlaying]);

  //Make an onPress function to play and pause
  const onButtonPress = () => setIsPlaying(!isPlaying);

  return (
    //return a button with onpress
    <Button title={isPlaying ? 'Pause' : 'Play'} onPress={onButtonPress} />
  );
};
