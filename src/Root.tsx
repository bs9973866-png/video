import React from 'react';
import {Composition} from 'remotion';
import {NoInternetVideo} from './Video';

export const Root: React.FC = () => (
  <Composition
    id="NoInternet"
    component={NoInternetVideo}
    durationInFrames={6300}
    fps={30}
    width={1920}
    height={1080}
  />
);
