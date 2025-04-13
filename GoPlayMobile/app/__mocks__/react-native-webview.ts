import React from 'react';
import { View } from 'react-native';

export const WebView = (props) => {
  return React.createElement(View, props, props.children);
};

export default WebView;