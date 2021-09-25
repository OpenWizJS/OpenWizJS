interface ConnectionInformation {
  ip: string;
  port: number;
}

interface WizDeviceNetworkPair {
  macAddress: string;
  ipAddress: string;
}

interface DiscoveryResult {
  mac: string;
  success: boolean;
}

interface WizLightPropertiesRaw {
  w?: number;
  c?: number;
  speed?: number;
  sceneId?: number;
  r?: number;
  g?: number;
  b?: number;
  dimming?: number;
  temp?: number;
}

interface SystemConfig {
  mac: string;
  homeId: number;
  roomId: number;
  rgn: string;
  moduleName: string;
  fwVersion: string;
  groupId: number;
  ping: number;
}

interface PilotResponse {
  mac: string;
  rssi: number;
  src: string;
  state: boolean;
  sceneId: number;
  r: number;
  g: number;
  b: number;
  c: number;
  w: number;
  dimming: number;
}

interface WizMethodResponse<Result> extends Record<string, unknown> {
  method: string;
  env: string;
  result?: Result;
}

interface WizMethodRequest<Params> extends Record<string, unknown> {
  method: string;
  params: Params;
}

type CancelFn = () => void;
type DiscoveryCancelHandler = ((cancelFn: CancelFn) => void) | undefined;
