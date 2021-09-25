import startBroadcast from "../protocols/broadcastProtocol";
import WizLight from "./WizLight";
import WizLightProperties from "./WizLightProperties";
import DeviceAddedEvent from "../events/DeviceAddedEvent";
import { EventHandlerFunction } from "../events/EventHandler";
import DiscoveryFinishedEvent from "../events/DiscoveryFinishedEvent";

type WizLightMap = Map<string, WizLight>;
type WizLightDeviceManagerEventType = "device_added" | "discovery_finished";

interface WizLightDeviceManagerEvents {
  device_added: DeviceAddedEvent;
  discovery_finished: DiscoveryFinishedEvent;
}

type DeviceManagerEventHandler<E extends keyof WizLightDeviceManagerEvents> =
  EventHandlerFunction<WizLightDeviceManagerEvents[E]>;

class WizLightDeviceManager {
  private readonly devices: WizLightMap;
  private deviceAddedEventHandlers: DeviceManagerEventHandler<"device_added">[] =
    [];
  private discoveryFinishedEventHandlers: DeviceManagerEventHandler<"discovery_finished">[] =
    [];

  constructor() {
    this.devices = new Map<string, WizLight>();
  }

  on<Event extends WizLightDeviceManagerEventType>(
    event: Event,
    callback: DeviceManagerEventHandler<Event>
  ) {
    switch (event) {
      case "device_added":
        this.deviceAddedEventHandlers.push(
          callback as DeviceManagerEventHandler<"device_added">
        );
        break;
      case "discovery_finished":
        this.discoveryFinishedEventHandlers.push(
          callback as DeviceManagerEventHandler<"discovery_finished">
        );
        break;
      default:
        throw new Error("Unknown event " + event);
    }
  }

  /**
   * Discover devices on broadcast address, and add it to the device list.
   *
   * @param broadcastAddress The broadcast address.
   * @param timeoutSeconds The amount of time after which to stop discovering.
   * @param cancelHandler A function with a function as it's only parameter.
   *                      Calling this function will cancel discovery.
   * @param expectedDevices The amount of devices to discover before stopping.
   *                        Does not ignore timeoutSeconds.
   */
  async addDevicesByBroadcast(
    broadcastAddress: string,
    timeoutSeconds: number,
    cancelHandler: DiscoveryCancelHandler,
    expectedDevices?: number
  ): Promise<WizLight[]> {
    const finishCause = await startBroadcast(
      { ip: broadcastAddress, port: 38899 },
      timeoutSeconds,
      expectedDevices,
      cancelHandler,
      this.setDevice.bind(this)
    );

    const context = new DiscoveryFinishedEvent(finishCause);
    this.fireEvent<"discovery_finished">(
      this.discoveryFinishedEventHandlers,
      context
    );

    return Array.from(this.getDevices().values());
  }

  private setDevice(device: WizLight): void {
    this.devices.set(device.networkPair.ipAddress, device);

    const context = new DeviceAddedEvent(device);
    this.fireEvent<"device_added">(this.deviceAddedEventHandlers, context);
  }

  private fireEvent<EventType extends WizLightDeviceManagerEventType>(
    event: DeviceManagerEventHandler<EventType>[],
    context: WizLightDeviceManagerEvents[EventType]
  ) {
    event.forEach((handler) => handler(context));
  }

  /**
   * Adds device to the device list with a [network pair]{@link WizDeviceNetworkPair}.
   *
   * @param networkPair
   */
  addDevice(networkPair: WizDeviceNetworkPair): void {
    const device = new WizLight(networkPair);
    this.devices.set(device.networkPair.ipAddress, device);
  }

  async turnAllOff() {
    for (const device of this.getDevices().values()) {
      await device.turnOff();
    }
  }

  async turnAllOn(properties?: WizLightProperties) {
    for (const device of this.getDevices().values()) {
      await device.turnOn(properties);
    }
  }

  /**
   * Returns list of WizLights
   */
  getDevices(): WizLightMap {
    return this.devices;
  }
}

export default WizLightDeviceManager;
