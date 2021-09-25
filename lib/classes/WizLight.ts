import createSocket from "../protocols/common/createSocket";
import objectToBytes from "../protocols/common/objectToBytes";
import createMethod from "../protocols/common/createMethod";
import { clearTimeout } from "timers";
import WizLightProperties from "./WizLightProperties";
import bytesToObject from "../protocols/common/bytesToObject";
import parsePilotResponse from "../utils/parsePilotResponse";

type JsonObject = { [key: string]: unknown };

class WizLight {
  private readonly _networkPair: WizDeviceNetworkPair;
  private _state: boolean | undefined;
  private _properties: WizLightProperties | undefined;

  get networkPair(): WizDeviceNetworkPair {
    return this._networkPair;
  }

  get state(): boolean | undefined {
    return this._state;
  }

  get properties(): WizLightProperties | undefined {
    return this._properties;
  }

  constructor(networkPair: WizDeviceNetworkPair) {
    this._networkPair = networkPair;
  }

  private async sendJSON<T extends JsonObject>(json: T) {
    const socket = createSocket();
    const bytes = objectToBytes(json);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.close();
        reject();
      }, 1000);
      socket.send(bytes, 38899, this.networkPair.ipAddress, (err) => {
        if (err) throw err;

        clearTimeout(timeout);
        socket.close();
        resolve(null);
      });
    });
  }

  private async sendAndReceiveJSON<
    ToSend extends JsonObject,
    ToReceive extends JsonObject
  >(json: ToSend): Promise<ToReceive> {
    const socket = createSocket();
    const bytes = objectToBytes(json);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.close();
        throw new Error("Request timed out");
      }, 1000);

      socket.send(bytes, 38899, this.networkPair.ipAddress, (err) => {
        if (err) throw err;

        clearTimeout(timeout);
      });

      socket.on("message", (message, info) => {
        if (info.address !== this.networkPair.ipAddress) return;

        const obj = bytesToObject<ToReceive>(message);
        socket.close();
        resolve(obj);
      });
    });
  }

  /**
   * Return the raw configuration of the bulb.
   */
  async getBulbConfig(): Promise<SystemConfig> {
    const method = createMethod("getSystemConfig", {});
    const { result } = await this.sendAndReceiveJSON<
      WizMethodRequest<{}>,
      WizMethodResponse<SystemConfig>
    >(method);

    if (!result) throw new Error("result was undefined");

    return result;
  }

  /**
   * Return the raw user configuration of the bulb.
   */
  async getUserConfig(): Promise<Record<string, unknown>> {
    const method = createMethod("getUserConfig", {});

    const { result } = await this.sendAndReceiveJSON<
      WizMethodRequest<{}>,
      WizMethodResponse<Record<string, unknown>>
    >(method);

    if (!result) throw new Error("result was undefined");

    return result;
  }

  /**
   * Return the raw user configuration of the bulb.
   */
  private async getPilot(): Promise<PilotResponse> {
    const method = createMethod("getPilot", {});

    const { result } = await this.sendAndReceiveJSON<
      WizMethodRequest<Record<string, never>>,
      WizMethodResponse<PilotResponse>
    >(method);

    if (!result) throw new Error("result was undefined");

    return result;
  }

  /**
   * Fetch the device's properties.
   */
  async fetchAndUpdateCache(): Promise<void> {
    const pilot = await this.getPilot();
    const { state, properties } = parsePilotResponse(pilot);

    this._state = state;
    this._properties = properties;
  }

  /**
   * Attempt to turn off the device.
   */
  async turnOff() {
    const params = { state: false };
    const method = createMethod("setPilot", params);

    await this.sendJSON(method);
  }

  /**
   * Attempt to turn on the device.
   *
   * @param properties The properties with which to turn the device on.
   */
  async turnOn(properties?: WizLightProperties) {
    const params = { state: true, ...properties?.getRawProperties() };
    const method = createMethod("setPilot", params);

    await this.sendJSON(method);
  }
}

export default WizLight;
