import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Subscription from './src/pages/subscription/Subscription';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#000057" barStyle="light-content" />
      <Subscription />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
