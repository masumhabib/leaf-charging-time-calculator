/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {Text, TextInput, View, Button, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

const LEAF_TRICLE_CHARGING_RATE = 1.4; // kW
const LEAF_BATTERY_SIZE = 62; // kWh
const LEAF_MAX_CHARGE = 80; // %

const App = () => {
  const calculateChargingTime = (batterySize:Float, chargingRate: Float, maxCharge:Float, currentCharge: Float) => {
    if (currentCharge >= maxCharge) {
      return 0; // No charging needed
    }
    const chargeNeeded = (maxCharge - currentCharge) / 100 * batterySize; // kWh
    const chargingTime = chargeNeeded / chargingRate; // hours
    return chargingTime;
  };

  const [percentCharge, setPercentCharge] = useState(0);
  const [chargingTime, setChargingTime] = useState(0);

  const handlePercentChargeChange = (value: string) => {
    const percentCharge = parseFloat(value);
    if (!isNaN(percentCharge)) {
      setPercentCharge(percentCharge);
      const chargingTime = calculateChargingTime(LEAF_BATTERY_SIZE, LEAF_TRICLE_CHARGING_RATE, LEAF_MAX_CHARGE, percentCharge);
      setChargingTime(chargingTime);
    } else {
      setPercentCharge(0); // Reset to 0 if input is invalid
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current charge (%): </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter charge percentage"
        value={percentCharge.toString()}
        onChangeText={handlePercentChargeChange}
      />
      <Text style={styles.result}>
        Charging time (for {LEAF_MAX_CHARGE}%):
      </Text>
      <Text style={styles.result}>
        {chargingTime.toFixed(1)} hr
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingBottom: '50%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '60%',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 10,
    color: 'blue',
  },
  button: {
    marginTop: 20,  
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    color: 'white',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default App;
