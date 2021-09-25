import WizLight from "../classes/WizLight";
import WizLightProperties from "../classes/WizLightProperties";

/**
 * Turns all specified devices on with the specified properties.
 *
 * @param devices The devices to turn on.
 * @param properties The properties to turn them on with.
 */
async function turnAllOn(devices: WizLight[], properties?: WizLightProperties) {
  for (const device of devices) {
    await device.turnOn(properties);
  }
}

export default turnAllOn;
