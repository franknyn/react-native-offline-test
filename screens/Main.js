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

import NetInfo, {useNetInfo} from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart';

import { connect } from 'react-redux';
import { increaseCounter } from '../redux/actions/counterActions';

//let count = 0;
const Main = ({reduxIncreaseCounter, counter}) => {
  const netInfo = useNetInfo();
  // const netInfo = useNetInfo({
  //   reachabilityUrl: 'https://clients3.google.com/generate_204',
  //   reachabilityTest: async (response) => response.status === 204,
  //   reachabilityLongTimeout: 60 * 1000, // 60s
  //   reachabilityShortTimeout: 5 * 1000, // 5s
  // });
  const [messages, setMessages] = useState([]);
  const [networkQuality, setNetworkQuality] = useState('Unknown');

  const addMessage = (message) => {
    setMessages((messages)=> [message].concat(messages));    
  }

  const checkNetworkQuality = function () {

    var request = new XMLHttpRequest();
    //addMessage('Checking network');

    return new Promise(function (resolve, reject) {
      var timeout=setTimeout(function(){
          request.abort();
          timeout=null;
          reject('bad');
      },9000);

      request.onreadystatechange = function () {

        if (request.readyState !== 4) return;

        if(timeout){clearTimeout(timeout);timeout=null;}
        if (request.status >= 200 && request.status < 300) {
          resolve('good');
        } else {
          reject('bad');
        }

      };

      request.open('GET', 'https://google.com', true)
      request.send();

    });
  };


  const networkRequest = (id) => {
    //console.log("fetch('https://google.com')")
    addMessage("#"+id + " fetch('https://google.com?q="+id+"')")
    var request = new XMLHttpRequest();
    request.timeout = 2000;
    request.ontimeout = function() {
        console.error('#'+id+ ' timed out');
    };
    request.onprogress = function() {
      addMessage('#'+ id+ ' onprogress');
      //do something 
    };

    request.onloadstart = function() {
      addMessage('#'+ id+ ' onloadstart');
    }

    request.onerror = function() {
      //addMessage('#'+ id+ ' onerror');
    }

    request.onabort = function() {
      //addMessage('#'+ id+ ' onabort');
    }
    request.onprogress = (e) => {
        // NetInfo.fetch().then(state => {
        //   if (!netInfo.isInternetReachable) {
        //     request.abort();
        //   }
        // });
        return;
    }

    request.onreadystatechange = (e) => {
      addMessage('#'+ id+ ' readyState='+request.readyState);
      if (request.readyState !== 4) {

        NetInfo.fetch().then(state => {
          if (!state.isInternetReachable) {
            setNetworkQuality('Disconnected')
            request.abort();
            addMessage('#'+ id+ ' error due to *disconnected*');

          }else {
            checkNetworkQuality().then(()=> setNetworkQuality('Good')).catch((error)=> {
                //bad network
                setNetworkQuality('Bad')
                request.abort();
                addMessage('#'+ id+ ' error due to *'+error+'* network');
            });
          
          }
        });
        return;
      }

      if (request.status === 200) {
        addMessage('#'+ id +' success');
      } else {
        addMessage('#'+ id +' error');
      }
    };

    request.open('GET', 'https://google.com?q='+id, true);
    request.send(null);
  }

  onRestartClick = () => {
    RNRestart.Restart();
  };

  //for btn : single request
  // const singleRequest = () =>{
  //     count++;
  //     networkRequest(count);
  // }

  useEffect(()=>{
    networkRequest(counter)
  },[counter])

  useEffect(() => {
    let interval = setInterval( () => {
      reduxIncreaseCounter()
    }, 10000);

     NetInfo.addEventListener(state => {
      if (!state.isInternetReachable) { 
        //when offline abort all network requests in progress so they can reach error soner
        //OR queue them to recover later
        //addMessage('Offline');

      } else {      
        //addMessage('Online');
        //clearInterval(interval);
        //recover them here
      }
    });

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
              <Text>Current Request#: {counter} </Text>
              <Text style={styles[`network${networkQuality}`]} >Network Quality: {networkQuality}</Text>
              { networkQuality === 'Bad' && <Button title="Refresh App" onPress={onRestartClick} /> }
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
  networkGood: {
    color: 'green'
  },
  networkBad: {
    color: 'red'
  },
  networkDisconnected: {
    color: 'blue'
  },  
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
    alignItems: 'flex-start'
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

const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    counter: state.counterReducer.counter,
  };
};

const mapDispatchToProps = (dispatch) => {
  // Action
    return {
      // Increase Counter
      reduxIncreaseCounter: () => dispatch(increaseCounter()),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);