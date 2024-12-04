import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

import {
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  endConnection,
  getSubscriptions,
  purchaseUpdatedListener,
  requestSubscription,
  getAvailablePurchases,
} from 'react-native-iap';

const isAndroid = Platform.OS === 'android';

const {width} = Dimensions.get('window');

const SubscriptionCard = ({plans}) => {
  const subscriptionIds = ['silver_monthly', 'gold_yearly', 'diamond_yearly'];
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePurchases, setAvailablePurchases] = useState([]);
  const [connection, setConnection] = useState(false);

  const handleSubmit = async item => {
    const userSelection = subscriptions.find(
      subscription => subscription?.productId === item.productId,
    );
    onSubscription(userSelection);
  };

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await initConnection().then(async value => {
          setConnection(value);
          isAndroid && (await flushFailedPurchasesCachedAsPendingAndroid());
        });
      } catch (error) {
        Alert.alert('Error', `Error initializing IAP: ${error}`);
      }
    };

    initializeIAP();

    return () => {
      endConnection();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      getSubscriptionInfo();
    }
  }, [connection]);

  const getSubscriptionInfo = async () => {
    try {
      const subscriptions = await getSubscriptions({
        skus: subscriptionIds,
      });
      setSubscriptions(subscriptions);
    } catch (error) {
      Alert.alert('Error', `Error fetching products:  ${error}`);
    }
  };

  useEffect(() => {
    const subscriptionListener = purchaseUpdatedListener(purchase => {});
    getCurrentPurchases();
    return () => {
      subscriptionListener.remove();
    };
  }, []);

  const onSubscription = async sku => {
    try {
      const offerToken = isAndroid
        ? sku?.subscriptionOfferDetails[0]?.offerToken
        : null;

      const purchaseData = await requestSubscription({
        sku: sku?.productId,
        ...(offerToken && {
          subscriptionOffers: [{sku: sku?.productId, offerToken}],
        }),
      });

      if (purchaseData) {
        Alert.alert('Success', 'Subscription activated successfully');
      }
    } catch (error) {
      Alert.alert('Error', `Error activating subscription: ${error}`);
    }
  };

  const getCurrentPurchases = async () => {
    try {
      const purchases = await getAvailablePurchases();
      setAvailablePurchases(purchases);
    } catch (error) {
      Alert.alert('Error', `Error getting purchases: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.verticalScrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={{paddingVertical: 30}}>
          <Text style={styles.heading}>Subscribtion</Text>
          <Text style={styles.mainDescription}>Choose Your Plan</Text>
        </View>

        {plans.map((item, index) => (
          <View style={styles.itemContainer}>
            <View key={index} style={styles.planBox}>
              <Text style={styles.planTitle}>{item.title}</Text>
              <View style={styles.planContent}>
                <Text style={styles.planPrice}>$ {item.price.toFixed(2)}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => handleSubmit(item)}
                  disabled={availablePurchases.some(
                    purchase => purchase.productId === item.productId,
                  )}>
                  <Text style={styles.btnText}>
                    {availablePurchases.some(
                      purchase => purchase.productId === item.productId,
                    )
                      ? 'Subscribed'
                      : 'Subscribe Now'}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={[commonStyles.btnOutlineContainer, {width: '100%'}]}>
                    <Text style={commonStyles.btnOutlineText}>
                      Restore Previous Subscription
                    </Text>
                  </TouchableOpacity> */}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000057',
  },
  verticalScrollViewContainer: {
    flexGrow: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  itemContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  planBox: {
    borderWidth: 2,
    borderColor: '#000057',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000057',
  },
  planContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnContainer: {
    backgroundColor: '#000057',
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
  },
});
