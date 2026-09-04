
import { useState, useEffect, useCallback, useMemo } from 'react';

const EMPTY_OPTIONS = {};

/**
 * Custom hook to track real-time or single-shot GPS coordinates.
 * @param {Object} options - Geolocation API options (highAccuracy, timeout, maximumAge)
 * @param {boolean} watch - Whether to continuously stream position changes
 */
const useGeoLocation = (options = EMPTY_OPTIONS, watch = false) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    speed: null,
    heading: null,
    timestamp: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultOptions = useMemo(() => ({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    ...options,
  }), [options]);

  const onSuccess = useCallback((position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: position.timestamp,
    });
    setError(null);
    setLoading(false);
  }, []);

  const onError = useCallback((err) => {
    setError({
      code: err.code,
      message: err.message,
    });
    setLoading(false);
  }, []);

  // Manual trigger to pull location once
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported by this browser.' });
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, defaultOptions);
  }, [onSuccess, onError, defaultOptions]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported by this browser.' });
      setLoading(false);
      return;
    }

    let watcherId = null;

    if (watch) {
      setLoading(true);
      watcherId = navigator.geolocation.watchPosition(onSuccess, onError, defaultOptions);
    } else {
      getCurrentPosition();
    }

    return () => {
      if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, [watch, getCurrentPosition, onSuccess, onError, defaultOptions]);

  return { location, error, loading, getCurrentPosition };
};

export default useGeoLocation;
