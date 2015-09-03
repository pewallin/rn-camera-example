var React = require('react-native');
var {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var Camera = require('react-native-camera');

var CryptoJS = require("crypto-js");
var RNFS = require('react-native-fs');

var cameraApp = React.createClass({
  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back,
      capturedImageUri: null
    }
  },

  componentDidMount() {
    RNFS.readDir('/', RNFS.DocumentDirectory)
      .then((result) => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  },

  render() {

    return (
      <View style={styles.container}>
        <Camera
          captureTarget="disk"
          ref="cam"
          style={styles.cameraContainer}
          onBarCodeRead={this._onBarCodeRead}
          type={this.state.cameraType}
        >
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit index.ios.js{'\n'}
            Press Cmd+R to reload
          </Text>
          <TouchableHighlight onPress={this._switchCamera}>
            <Text>The old switcheroo</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._takePicture}>
            <Text>Take Picture</Text>
          </TouchableHighlight>
        </Camera>
        <View style={styles.imageContainer}>
          <Text>{this.state.capturedImageUri}</Text>
          <Image
            resizeMode='stretch'
            style={styles.image}
            source={{ isStatic:true, uri: this.state.capturedImageUri }} />
        </View>
      </View>
    );
  },
  _onBarCodeRead(e) {
    console.log(e);
  },
  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },
  _takePicture() {
    this.refs.cam.capture((err, data) => {
      console.log(data);
      this.setState({capturedImageUri: data});

      // var key = '12345';
      // var cfg = {};
      // var cipherString = CryptoJS.AES.encrypt(data, key, cfg);
      // var plainString  = CryptoJS.AES.decrypt(cipherString.toString(), key, cfg);
      // // console.log(plainString.toString(CryptoJS.enc.Utf8));
      // console.log(data);
      // this.setState({capturedImage: plainString.toString(CryptoJS.enc.Utf8)});
    });
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },

  imageContainer: {
    flex: 1,
    backgroundColor: '#cccccc',
  },
  image: {
    flex: 1,
  }
});

AppRegistry.registerComponent('cameraApp', () => cameraApp);
