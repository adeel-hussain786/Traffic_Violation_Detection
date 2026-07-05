import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  AppState,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import React, {useState, useRef, useEffect} from 'react';

const BASE_URL = 'https://traffic-backend-312270831796.asia-south1.run.app';

export default function HomeScreen() {
  const [mediaUri, setMediaUri] = useState(null);
  const [detections, setDetections] = useState([]);
  const [uniqueViolations, setUniqueViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // for remounting video

  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const screenW = Dimensions.get('window').width;
  const displayW = screenW - 40;
  const displayH = 250;

  const extractUniqueViolations = det => {
    const uniq = [...new Set(det.map(d => d.label))];
    setUniqueViolations(uniq);
  };

  // ======= AppState listener to fix black screen =======
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App comes to foreground
        setPaused(false);
        setVideoKey(k => k + 1); // remount video to avoid black screen
      } else if (nextAppState.match(/inactive|background/)) {
        // App goes to background
        setPaused(true);
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const pickImage = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (!res.assets?.[0]) return;

    const file = res.assets[0];
    setMediaUri(file.uri);
    setIsVideo(false);
    setPaused(false);
    setDetections([]);
    setUniqueViolations([]);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', {uri: file.uri, type: file.type, name: file.fileName});

    try {
      const resp = await fetch(`${BASE_URL}/detect-image`, {method: 'POST', body: formData});
      const data = await resp.json();
      setDetections(data.detections);
      extractUniqueViolations(data.detections);
    } catch (err) {
      console.log('Image detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const pickVideo = async () => {
    const res = await launchImageLibrary({mediaType: 'video'});
    if (!res.assets?.[0]) return;

    const file = res.assets[0];
    setMediaUri(file.uri);
    setIsVideo(true);
    setPaused(false);
    setDetections([]);
    setUniqueViolations([]);
    setLoading(true);

    wsRef.current = new WebSocket(`${BASE_URL.replace('https', 'wss')}/ws-video`);
    const ws = wsRef.current;

    ws.onopen = async () => {
      try {
        const base64Data = await RNFS.readFile(file.uri, 'base64');
        const binary = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        if (!paused) ws.send(binary);
      } catch (err) {
        console.log('Video read/send error:', err);
        setLoading(false);
      }
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        setDetections(data.detections);
        extractUniqueViolations(data.detections);
      } catch (err) {
        console.log('WebSocket message parse error:', err);
      } finally {
        setLoading(false);
      }
    };

    ws.onerror = err => {
      console.log('WebSocket error:', err);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setLoading(false);
    };
  };

  const renderBoxes = () =>
    detections.map((d, i) => {
      const [x1, y1, x2, y2] = d.box;
      return (
        <React.Fragment key={i}>
          <Rect
            x={x1 * displayW}
            y={y1 * displayH}
            width={(x2 - x1) * displayW}
            height={(y2 - y1) * displayH}
            stroke="red"
            strokeWidth="3"
            fill="transparent"
          />
          <SvgText
            x={x1 * displayW + 5}
            y={y1 * displayH + 15}
            fill="red"
            fontSize="14"
            fontWeight="bold"
          >
            {d.label.toUpperCase()}
          </SvgText>
        </React.Fragment>
      );


      
    });

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F8FAFC'}} contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚦 Traffic Violation Detection</Text>
      <Text style={styles.subtitle}>AI-powered automatic traffic rule monitoring</Text>

      <View style={[styles.mediaBox, {width: displayW, height: displayH}]}>
        {isVideo ? (
          <>
            <Video
              key={videoKey} // remount video on app resume
              ref={videoRef}
              source={{uri: mediaUri}}
              style={styles.media}
              resizeMode="cover"
              paused={paused}
              onEnd={() => setLoading(false)}
            />
            {loading && (
              <ActivityIndicator
                size="large"
                color="green"
                style={{position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -15}, {translateY: -15}]}}
              />
            )}
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={() => {
                setPaused(!paused);
                if (!paused) wsRef.current?.send('pause');
                else wsRef.current?.send('resume');
              }}
            >
              <Text style={styles.btnText}>{paused ? '▶ Play' : '⏸ Pause'}</Text>
            </TouchableOpacity>
            <Svg style={StyleSheet.absoluteFill}>{renderBoxes()}</Svg>
          </>
        ) : mediaUri ? (
          <>
            <Image source={{uri: mediaUri}} style={styles.media} />
            {loading && (
              <ActivityIndicator
                size="large"
                color="green"
                style={{position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -15}, {translateY: -15}]}}
              />
            )}
            <Svg style={StyleSheet.absoluteFill}>{renderBoxes()}</Svg>
          </>
        ) : (
          <Text style={styles.placeholderText}>Upload Image or Video to Detect Violations</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.btnText}>📷 Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <Text style={styles.btnText}>🎥 Video</Text>
        </TouchableOpacity>
      </View>

      {mediaUri && !loading && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Detected Violations:</Text>
          {uniqueViolations.length > 0 ? (
            uniqueViolations.map((label, i) => (
              <Text key={i} style={styles.resultItem}>⚠ {label.toUpperCase()}</Text>
            ))
          ) : (
            <Text style={styles.resultItem}>✅ No Violations Detected</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', minHeight: Dimensions.get('window').height},
  title: {fontSize: 26, fontWeight: 'bold', marginTop: 15, color: '#0A3D2E'},
  subtitle: {fontSize: 14, marginBottom: 15, color: '#009688', fontWeight: '500'},
  mediaBox: {backgroundColor: '#E8F5E9', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 22, elevation: 2, marginTop: 95},
  placeholderText: {color: '#009688', fontSize: 15},
  media: {width: '100%', height: '100%', borderRadius: 12},
  buttonRow: {flexDirection: 'row', gap: 15, marginTop: 15},
  button: {backgroundColor: '#009688', paddingVertical: 12, paddingHorizontal: 26, borderRadius: 12, elevation: 2},
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 18},
  resultBox: {marginTop: 15, width: '100%', backgroundColor: '#f9f9f9ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#7ea56cff', elevation: 2},
  resultTitle: {fontSize: 16, fontWeight: 'bold', color: '#305d63ff', marginBottom: 8},
  resultItem: {fontSize: 15, color: '#BF360C', marginBottom: 4},
});
