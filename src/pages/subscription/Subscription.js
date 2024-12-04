import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

// Import Components
import SubscriptionCard from '../../components/subscription/SubscriptionCard';

// Assets

const plans = [
  {
    type: 'monthly',
    title: 'Subscription Plan 1',
    description: 'Good for testing',
    price: 49,
    productId: 'silver_monthly',
  },
];

const Subscription = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* {isLoading && <ActivityIndicator size="large" color="#0000ff" />} */}
      <SubscriptionCard plans={plans} />
    </SafeAreaView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
