/**
 * Mock Device Simulator for Testing Without Real Hardware
 * Use this while waiting for Tauri/Rust setup or for testing without real devices
 */

const mockDevices = [
  {
    id: 'mixer_192.168.1.100_9000',
    name: 'Main Audio Mixer',
    device_type: 'mixer',
    ip_address: '192.168.1.100',
    port: 9000,
    protocol: 'osc',
    status: 'connected',
    custom_name: 'Main Mixer',
    enabled: true,
    auto_connect: true,
  },
  {
    id: 'camera_192.168.1.101_5678',
    name: 'PTZ Camera',
    device_type: 'camera',
    ip_address: '192.168.1.101',
    port: 5678,
    protocol: 'visca',
    status: 'connected',
    custom_name: 'Main Camera',
    enabled: true,
    auto_connect: false,
  },
  {
    id: 'router_192.168.1.102_9001',
    name: 'Video Router',
    device_type: 'router',
    ip_address: '192.168.1.102',
    port: 9001,
    protocol: 'tcp',
    status: 'disconnected',
    custom_name: 'HDMI Router',
    enabled: true,
    auto_connect: false,
  },
  {
    id: 'dmx_192.168.1.103_5000',
    name: 'DMX Controller',
    device_type: 'dmx',
    ip_address: '192.168.1.103',
    port: 5000,
    protocol: 'dmx512',
    status: 'connected',
    custom_name: 'Lighting DMX',
    enabled: true,
    auto_connect: false,
  },
];

const mockChannels = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Channel ${i + 1}`,
  level: Math.random(),
  muted: false,
}));

/**
 * Mock Tauri invoke function for development without Tauri
 * Replace with actual Tauri invoke in production
 */
export async function mockInvoke(command, args) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      switch (command) {
        case 'detect_devices':
          // Simulate device discovery
          resolve(
            mockDevices
              .filter((d) => d.device_type !== 'usb')
              .map((d) => ({ ...d, status: Math.random() > 0.2 ? 'connected' : 'disconnected' }))
          );
          break;

        case 'detect_usb_devices':
          resolve([
            {
              id: 'usb_D:',
              name: 'USB Drive D:',
              device_type: 'usb',
              ip_address: null,
              port: null,
              protocol: 'usb',
              status: 'connected',
            },
            {
              id: 'usb_audio_001',
              name: 'USB Audio Interface',
              device_type: 'usb',
              ip_address: null,
              port: null,
              protocol: 'usb',
              status: 'connected',
            },
          ]);
          break;

        case 'connect_mixer':
          if (args.ip && args.port) {
            resolve(true);
          } else {
            throw new Error('Invalid mixer configuration');
          }
          break;

        case 'get_mixer_channels':
          resolve(mockChannels);
          break;

        case 'set_mixer_level':
          if (args.level !== undefined) {
            const channel = mockChannels.find((c) => c.id === args.channel);
            if (channel) {
              channel.level = args.level;
              resolve(true);
            }
          }
          break;

        case 'mute_channel':
          if (args.channel !== undefined) {
            const channel = mockChannels.find((c) => c.id === args.channel);
            if (channel) {
              channel.muted = args.mute;
              resolve(true);
            }
          }
          break;

        case 'save_device_config':
          // Mock saving to localStorage
          if (args?.config?.device?.id) {
            localStorage.setItem(`device_config_${args.config.device.id}`, JSON.stringify(args.config));
          }
          resolve(true);
          break;

        case 'load_device_config':
          const saved = localStorage.getItem(`device_config_${args.device_id}`);
          resolve(saved ? JSON.parse(saved) : null);
          break;

        case 'list_saved_devices':
          const configs = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('device_config_')) {
              configs.push(JSON.parse(localStorage.getItem(key)));
            }
          }
          resolve(configs);
          break;

        default:
          resolve(null);
      }
    }, 500 + Math.random() * 1000); // Simulate network latency
  });
}

/**
 * Helper to initialize mock devices in localStorage
 */
export function initializeMockDevices() {
  mockDevices.forEach((device) => {
    const config = {
      device,
      custom_name: device.custom_name,
      enabled: device.enabled,
      auto_connect: device.auto_connect,
      settings: {},
    };
    localStorage.setItem(`device_config_${device.id}`, JSON.stringify(config));
  });
}

/**
 * Get mock invoke function - use this in components for testing
 * In production, this should be replaced with actual Tauri invoke
 */
export function getInvokeFunction() {
  // Check if running in Tauri environment
  if (window.__TAURI__) {
    const { invoke } = require('@tauri-apps/api/tauri');
    return invoke;
  } else {
    // Use mock for development
    console.log('⚠️  Using mock device simulator - Tauri not available');
    return mockInvoke;
  }
}
