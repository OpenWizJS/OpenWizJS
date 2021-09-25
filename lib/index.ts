import createRgbPropertiesFromHex from "./generic/createRgbPropertiesFromHex";
import WizLightDeviceManager from "./classes/WizLightDeviceManager";

async function test() {
  const deviceManager = new WizLightDeviceManager();
  deviceManager.on("device_added", async ({ device }) => {
    console.log(
      `found ${device.networkPair.ipAddress} : ${device.networkPair.macAddress}`
    );
  });
  deviceManager.on("discovery_finished", async ({ cause }) => {
    console.log(`Discovery finished with reason: ${cause}`);
  });

  await deviceManager.addDevicesByBroadcast("255.255.255.255", 5, undefined, 4);
  const properties = createRgbPropertiesFromHex(0xffffff);
  properties.setBrightness(100);
  await deviceManager.turnAllOn(properties);
}

test();
