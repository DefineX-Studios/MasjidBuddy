//Import useState and useEffect react native
import React, { useState } from 'react';
import { Button } from 'react-native';
import type { Track } from 'react-native-track-player';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
//This is the link used by rocket streaming service for live streaming audio using hls. Check rocket docs for setup info.
const url = 'http://stream.example.com:8000/radio/hls.m3u8';
console.log(url);
const streamDetails: Track = {
  url: url,
  title: 'Test Stream',
  artist: 'Test Artist',
  isLiveStream: true,
  type: 'hls',
};
console.log('Setting up audio player');
TrackPlayer.setupPlayer()
  .then(() => {
    console.log('Player ready');
    TrackPlayer.add(streamDetails).then(() => {});
  })
  .catch((err) => {
    console.log('Error setting up player', err);
  });

const state = TrackPlayer.getPlaybackState();

export const MusicPlayerOld = () => {
  console.log('MusicPlayer');
  useTrackPlayerEvents([Event.PlaybackState], (data) => {
    console.log('useTrackPlayerEvents', data);
  });

  const [isPlaying, setIsPlaying] = useState(false);
  if (isPlaying) {
    console.log('Trying to play');
    TrackPlayer.play().then(() => {
      console.log('Playing');
      TrackPlayer.getPlaybackState().then((state) => {
        console.log('Playback state', state);
      });
    });
  } else {
    TrackPlayer.pause().then(() => {
      console.log('Paused');
      TrackPlayer.getPlaybackState().then((state) => {
        console.log('Playback state', state);
      });
    });
  }

  //Make an onPress function to play and pause
  const onButtonPress = () => setIsPlaying(!isPlaying);

  return (
    //return a button with onpress
    <Button
      title={isPlaying ? 'Pause' + url : 'Play'}
      onPress={onButtonPress}
    />
  );
};
