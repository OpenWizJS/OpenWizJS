import broadcastRegistration from "./broadcastRegistration";
import createSocket from "../common/createSocket";
import receiveMethod from "./receiveMethod";
import WizLight from "../../classes/WizLight";
import { DiscoveryFinishedCause } from "../../events/DiscoveryFinishedEvent";
import { clearTimeout } from "timers";

async function startBroadcast(
  host: ConnectionInformation,
  timeoutSeconds: number,
  expectedDevices: number | undefined,
  cancelHandler: DiscoveryCancelHandler,
  registerDeviceCallback: (device: WizLight) => void
): Promise<DiscoveryFinishedCause> {
  return new Promise((resolve) => {
    const socket = createSocket();
    socket.bind(host.port, async () => {
      socket.setBroadcast(true);

      try {
        await broadcastRegistration(socket, host);
      } catch (e) {
        console.error("Broadcast protocol failed: " + e);
        return;
      }
    });

    const timeoutFn = setTimeout(() => {
      socket.close();
      resolve(DiscoveryFinishedCause.TIMEOUT_REACHED);
    }, timeoutSeconds * 1000);

    let foundDevices = 0;

    function cancel() {
      clearTimeout(timeoutFn);
      socket.close();
      resolve(DiscoveryFinishedCause.USER_REQUESTED);
    }

    cancelHandler?.(cancel);

    socket.on("message", (message, info) => {
      const { result } = receiveMethod(message);
      if (!result) return;

      const { mac, success } = result;
      if (!success) return;

      const wizDeviceNetworkPair: WizDeviceNetworkPair = {
        macAddress: mac,
        ipAddress: info.address,
      };

      const wizDevice = new WizLight(wizDeviceNetworkPair);

      registerDeviceCallback(wizDevice);
      if (expectedDevices && ++foundDevices === expectedDevices) {
        clearTimeout(timeoutFn);
        socket.close();
        resolve(DiscoveryFinishedCause.EXPECTED_DEVICES_HIT);
      }
    });
  });
}

export default startBroadcast;
