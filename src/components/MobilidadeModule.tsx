
import React, { useState, useEffect } from 'react';
import { 
  Language, UserProfile, UsageLog 
} from '../types';

interface MobilidadeModuleProps {
  user: any;
  userProfile: UserProfile | null;
  t: any;
  language: Language;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onDataChange: (data: { 
    carLocation: {lat: number, lng: number} | null,
    saveCarLocation: () => void,
    openCarRoute: () => void,
    carReminderEnabled: boolean,
    setCarReminderEnabled: (val: boolean) => void,
    carReminderInterval: number,
    setCarReminderInterval: (val: number) => void,
    carAutoDisableTime: number,
    setCarAutoDisableTime: (val: number) => void,
    setCarLocation: (val: any) => void,
    setCarSaveTimestamp: (val: any) => void,
    origin: string,
    setOrigin: (val: string) => void,
    getCurrentLocation: () => void,
    destination: string,
    setDestination: (val: string) => void,
    calculateSafeRoute: () => void,
    isCalculatingRoute: boolean,
    safeRouteSuggestion: string | null,
    mapUrl: string | null
  }) => void;
  genAI: any;
  logModuleUsage: (modulo: UsageLog['modulo']) => void;
}

export const MobilidadeModule: React.FC<MobilidadeModuleProps> = ({
  user, userProfile, t, language, showToast, 
  onDataChange, genAI, logModuleUsage
}) => {
  // Car State
  const [carLocation, setCarLocation] = useState<{lat: number, lng: number} | null>(() => {
    const saved = localStorage.getItem('guardian-car-location');
    return saved ? JSON.parse(saved) : null;
  });
  const [carReminderEnabled, setCarReminderEnabled] = useState(() => {
    return localStorage.getItem('guardian-car-reminder-enabled') === 'true';
  });
  const [carReminderInterval, setCarReminderInterval] = useState(() => {
    const saved = localStorage.getItem('guardian-car-reminder-interval');
    return saved ? parseInt(saved) : 30;
  });
  const [carAutoDisableTime, setCarAutoDisableTime] = useState(() => {
    const saved = localStorage.getItem('guardian-car-auto-disable');
    return saved ? parseInt(saved) : 120;
  });
  const [carSaveTimestamp, setCarSaveTimestamp] = useState<number | null>(() => {
    const saved = localStorage.getItem('guardian-car-timestamp');
    return saved ? parseInt(saved) : null;
  });

  // Safe Route State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [safeRouteSuggestion, setSafeRouteSuggestion] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('guardian-car-reminder-enabled', carReminderEnabled.toString());
    localStorage.setItem('guardian-car-reminder-interval', carReminderInterval.toString());
    localStorage.setItem('guardian-car-auto-disable', carAutoDisableTime.toString());
  }, [carReminderEnabled, carReminderInterval, carAutoDisableTime]);

  useEffect(() => {
    let reminderInterval: NodeJS.Timeout | null = null;
    let autoDisableTimeout: NodeJS.Timeout | null = null;

    if (carLocation && carReminderEnabled && carSaveTimestamp) {
      reminderInterval = setInterval(() => {
        showToast(t.carReminderToast, "info");
      }, carReminderInterval * 60 * 1000);

      const timeSinceSave = Date.now() - carSaveTimestamp;
      const remainingTime = (carAutoDisableTime * 60 * 1000) - timeSinceSave;

      if (remainingTime > 0) {
        autoDisableTimeout = setTimeout(() => {
          setCarReminderEnabled(false);
          setCarLocation(null);
          setCarSaveTimestamp(null);
          localStorage.removeItem('guardian-car-location');
          localStorage.removeItem('guardian-car-timestamp');
          showToast(t.carAutoDisabledToast, "info");
        }, remainingTime);
      } else {
        setCarReminderEnabled(false);
        setCarLocation(null);
        setCarSaveTimestamp(null);
        localStorage.removeItem('guardian-car-location');
        localStorage.removeItem('guardian-car-timestamp');
      }
    }

    return () => {
      if (reminderInterval) clearInterval(reminderInterval);
      if (autoDisableTimeout) clearTimeout(autoDisableTimeout);
    };
  }, [carLocation, carReminderEnabled, carReminderInterval, carAutoDisableTime, carSaveTimestamp, t]);

  const saveCarLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const now = Date.now();
          setCarLocation(newLoc);
          setCarSaveTimestamp(now);
          setCarReminderEnabled(true);
          localStorage.setItem('guardian-car-location', JSON.stringify(newLoc));
          localStorage.setItem('guardian-car-timestamp', now.toString());
          showToast(t.carLocationSaved, "success");
        },
        (error) => {
          console.error("Error getting location for car:", error);
          showToast("Erro ao obter localização atual.", "error");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  };

  const openCarRoute = () => {
    if (carLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${carLocation.lat},${carLocation.lng}`;
      window.open(url, '_blank');
    } else {
      showToast(t.carNotMarked, "error");
    }
  };

  const calculateSafeRoute = async () => {
    if (!destination?.trim() || !origin?.trim()) return;
    setIsCalculatingRoute(true);
    logModuleUsage('rota_segura');
    setSafeRouteSuggestion(null);
    setMapUrl(null);
    
    try {
      const model = "gemini-3-flash-preview";
      const prompt = t.routePrompt.replace('{origin}', origin).replace('{dest}', destination);
      
      const response = await genAI.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: { systemInstruction: t.routeSystemInstruction },
      });
      
      setSafeRouteSuggestion(response.text || t.routeSuccess);
      setMapUrl(`https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&output=embed`);
    } catch (error) {
      console.error(error);
      setSafeRouteSuggestion(t.routeFallback);
      setMapUrl(`https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&output=embed`);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrigin(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Sync Data with App.tsx
  useEffect(() => {
    onDataChange({
      carLocation,
      saveCarLocation,
      openCarRoute,
      carReminderEnabled,
      setCarReminderEnabled,
      carReminderInterval,
      setCarReminderInterval,
      carAutoDisableTime,
      setCarAutoDisableTime,
      setCarLocation,
      setCarSaveTimestamp,
      origin,
      setOrigin,
      getCurrentLocation,
      destination,
      setDestination,
      calculateSafeRoute,
      isCalculatingRoute,
      safeRouteSuggestion,
      mapUrl
    });
  }, [
    carLocation, carReminderEnabled, carReminderInterval, carAutoDisableTime, 
    origin, destination, isCalculatingRoute, safeRouteSuggestion, mapUrl
  ]);

  return null;
};
