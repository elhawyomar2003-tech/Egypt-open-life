import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '../../store';

const AMBIENT_SOUNDS = {
  day: 'https://assets.mixkit.co/sfx/preview/mixkit-city-park-ambience-with-birds-and-distant-traffic-1227.mp3',
  night: 'https://assets.mixkit.co/sfx/preview/mixkit-night-city-ambience-with-distant-traffic-and-crickets-1228.mp3',
  rain: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
  storm: 'https://assets.mixkit.co/sfx/preview/mixkit-thunder-and-rain-ambient-2403.mp3',
  chatter: 'https://assets.mixkit.co/sfx/preview/mixkit-crowd-talking-in-a-busy-market-loop-441.mp3',
};

const RADIO_STATIONS = [
  'https://assets.mixkit.co/music/preview/mixkit-arabic-style-hip-hop-beat-481.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-luxury-lifestyle-145.mp3',
];

const MUSIC = {
  neighborhood: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
  souq: 'https://assets.mixkit.co/music/preview/mixkit-arabic-style-hip-hop-beat-481.mp3',
  industrial: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  palm: 'https://assets.mixkit.co/music/preview/mixkit-luxury-lifestyle-145.mp3',
};

export default function SoundManager() {
  const { timeOfDay, weather, currentDistrict } = useGameStore();
  const ambientRef = useRef<Howl | null>(null);
  const musicRef = useRef<Howl | null>(null);
  const weatherRef = useRef<Howl | null>(null);
  const chatterRef = useRef<Howl | null>(null);
  const radioRef = useRef<Howl | null>(null);
  const { isRadioOn, currentRadioStation } = useGameStore();

  useEffect(() => {
    // Radio logic
    if (isRadioOn) {
      if (radioRef.current) {
        radioRef.current.stop();
      }
      radioRef.current = new Howl({
        src: [RADIO_STATIONS[currentRadioStation]],
        loop: true,
        volume: 0.5,
        html5: true,
      });
      radioRef.current.play();
    } else {
      radioRef.current?.stop();
    }

    return () => {
      radioRef.current?.stop();
    };
  }, [isRadioOn, currentRadioStation]);

  useEffect(() => {
    // Music logic
    let musicUrl = MUSIC.neighborhood;
    if (currentDistrict === 'The Souq') musicUrl = MUSIC.souq;
    if (currentDistrict === 'Industrial Zone') musicUrl = MUSIC.industrial;
    if (currentDistrict === 'Palm Heights') musicUrl = MUSIC.palm;

    if (musicRef.current) {
      musicRef.current.fade(musicRef.current.volume(), 0, 1000);
      const oldMusic = musicRef.current;
      setTimeout(() => oldMusic.stop(), 1000);
    }

    musicRef.current = new Howl({
      src: [musicUrl],
      loop: true,
      volume: 0,
      html5: true,
    });
    musicRef.current.play();
    musicRef.current.fade(0, 0.3, 2000);

    return () => {
      musicRef.current?.stop();
    };
  }, [currentDistrict]);

  useEffect(() => {
    // Ambient logic
    const isDay = timeOfDay > 6 && timeOfDay < 18;
    const ambientUrl = isDay ? AMBIENT_SOUNDS.day : AMBIENT_SOUNDS.night;

    if (ambientRef.current) {
      ambientRef.current.fade(ambientRef.current.volume(), 0, 1000);
      const oldAmbient = ambientRef.current;
      setTimeout(() => oldAmbient.stop(), 1000);
    }

    ambientRef.current = new Howl({
      src: [ambientUrl],
      loop: true,
      volume: 0,
      html5: true,
    });
    ambientRef.current.play();
    ambientRef.current.fade(0, 0.2, 2000);

    return () => {
      ambientRef.current?.stop();
    };
  }, [timeOfDay > 6 && timeOfDay < 18]);

  useEffect(() => {
    // Weather sound logic
    let weatherUrl = '';
    if (weather === 'rainy') weatherUrl = AMBIENT_SOUNDS.rain;
    if (weather === 'stormy') weatherUrl = AMBIENT_SOUNDS.storm;

    if (weatherRef.current) {
      weatherRef.current.fade(weatherRef.current.volume(), 0, 1000);
      const oldWeather = weatherRef.current;
      setTimeout(() => oldWeather.stop(), 1000);
    }

    if (weatherUrl) {
      weatherRef.current = new Howl({
        src: [weatherUrl],
        loop: true,
        volume: 0,
        html5: true,
      });
      weatherRef.current.play();
      weatherRef.current.fade(0, 0.4, 2000);
    }

    return () => {
      weatherRef.current?.stop();
    };
  }, [weather]);

  useEffect(() => {
    // Chatter logic for Souq
    if (currentDistrict === 'The Souq') {
      chatterRef.current = new Howl({
        src: [AMBIENT_SOUNDS.chatter],
        loop: true,
        volume: 0,
        html5: true,
      });
      chatterRef.current.play();
      chatterRef.current.fade(0, 0.15, 2000);
    } else {
      chatterRef.current?.fade(chatterRef.current.volume(), 0, 1000);
      setTimeout(() => chatterRef.current?.stop(), 1000);
    }

    return () => {
      chatterRef.current?.stop();
    };
  }, [currentDistrict]);

  return null;
}
