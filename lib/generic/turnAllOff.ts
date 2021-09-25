import WizLight from "../classes/WizLight";

async function turnAllOff(devices: WizLight[]) {
  for (const device of devices) {
    await device.turnOff();
  }
}

export default turnAllOff;
