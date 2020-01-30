/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {useNetInfo} from "@react-native-community/netinfo";


const App: () => React$Node = () => {
  const netInfo = useNetInfo();
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((messages)=> [message].concat(messages));    
  }
  const networkRequest = () => {
    addMessage("fetch('https://google.com')")
    //console.log("fetch('https://google.com')")

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        addMessage('success');

        //console.log('success', request.responseText);
      } else {
        addMessage('error');
        //console.warn('error');
      }
    };

    request.open('GET', 'https://google.com');
    request.send(); 
  }

  useEffect(() => {
    const interval = setInterval(() => {
      networkRequest();
    }, 10000);
    return () => clearInterval(interval);
  }, []);



  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>NetInfo</Text>
              <Text>Type: {netInfo.type}</Text>
              <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
              <Text>Is Internet Reachable? {netInfo.isInternetReachable.toString()}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Network Request</Text>
               {messages.map((m, i)  => (
                  <Text key={i}>{messages.length-i} {m}</Text>
              ))}           
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
