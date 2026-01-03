import { useState, useEffect, useCallback } from 'react';
import { getInvokeFunction } from '../utils/mockDevices';

/**
 * Hook for managing device connections and operations
 * @returns {Object} Device management interface
 */
export const useDeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedDevices, setConnectedDevices] = useState(new Map());
  const [invoke] = useState(() => getInvokeFunction());

  const scanDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const networkDevices = await invoke('detect_devices');
      const usbDevices = await invoke('detect_usb_devices');
      const allDevices = [...networkDevices, ...usbDevices];
      setDevices(allDevices);
      return allDevices;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const connectDevice = useCallback(async (device) => {
    setError(null);
    try {
      let connected = false;

      if (device.device_type === 'mixer') {
        connected = await invoke('connect_mixer', {
          ip: device.ip_address,
          port: device.port,
        });
      }

      if (connected) {
        setConnectedDevices(new Map(connectedDevices).set(device.id, device));
      }
      return connected;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [connectedDevices]);

  const disconnectDevice = useCallback(async (deviceId) => {
    setError(null);
    try {
      const newConnected = new Map(connectedDevices);
      newConnected.delete(deviceId);
      setConnectedDevices(newConnected);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [connectedDevices]);

  const getConnectedDevice = useCallback((deviceId) => {
    return connectedDevices.get(deviceId);
  }, [connectedDevices]);

  const isDeviceConnected = useCallback((deviceId) => {
    return connectedDevices.has(deviceId);
  }, [connectedDevices]);

  return {
    devices,
    loading,
    error,
    connectedDevices: Array.from(connectedDevices.values()),
    scanDevices,
    connectDevice,
    disconnectDevice,
    getConnectedDevice,
    isDeviceConnected,
  };
};

/**
 * Hook for controlling audio mixers
 * @param {string} deviceId - Mixer device ID
 * @returns {Object} Mixer control interface
 */
export const useMixerControl = (deviceId) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoke] = useState(() => getInvokeFunction());

  useEffect(() => {
    if (!deviceId) return;

    const loadChannels = async () => {
      setLoading(true);
      setError(null);
      try {
        const mixerChannels = await invoke('get_mixer_channels', { device_id: deviceId });
        setChannels(mixerChannels);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, [deviceId]);

  const setChannelLevel = useCallback(
    async (channelId, level) => {
      if (!deviceId) return false;

      try {
        await invoke('set_mixer_level', {
          device_id: deviceId,
          channel: channelId,
          level: level / 100,
        });

        setChannels((prevChannels) =>
          prevChannels.map((ch) =>
            ch.id === channelId ? { ...ch, level: level / 100 } : ch
          )
        );
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [deviceId]
  );

  const muteChannel = useCallback(
    async (channelId, mute) => {
      if (!deviceId) return false;

      try {
        await invoke('mute_channel', {
          device_id: deviceId,
          channel: channelId,
          mute,
        });

        setChannels((prevChannels) =>
          prevChannels.map((ch) =>
            ch.id === channelId ? { ...ch, muted: mute } : ch
          )
        );
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [deviceId]
  );

  const getChannelLevel = useCallback(
    (channelId) => {
      const channel = channels.find((ch) => ch.id === channelId);
      return channel ? channel.level : 0;
    },
    [channels]
  );

  const isChannelMuted = useCallback(
    (channelId) => {
      const channel = channels.find((ch) => ch.id === channelId);
      return channel ? channel.muted : false;
    },
    [channels]
  );

  return {
    channels,
    loading,
    error,
    setChannelLevel,
    muteChannel,
    getChannelLevel,
    isChannelMuted,
  };
};

/**
 * Hook for managing device configurations
 * @returns {Object} Config management interface
 */
export const useDeviceConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoke] = useState(() => getInvokeFunction());

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedConfigs = await invoke('list_saved_devices');
      setConfigs(savedConfigs);
      return savedConfigs;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async (config) => {
    setError(null);
    try {
      await invoke('save_device_config', { config });
      setConfigs((prev) => [
        ...prev.filter((c) => c.device.id !== config.device.id),
        config,
      ]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const loadConfig = useCallback(async (deviceId) => {
    setError(null);
    try {
      const config = await invoke('load_device_config', { device_id: deviceId });
      return config;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  return {
    configs,
    loading,
    error,
    loadConfigs,
    saveConfig,
    loadConfig,
  };
};
