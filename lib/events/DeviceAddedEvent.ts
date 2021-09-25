import Event from "./Event";
import WizLight from "../classes/WizLight";

class DeviceAddedEvent extends Event {
  readonly device: WizLight;

  constructor(device: WizLight) {
    super("device_added", true);

    this.device = device;
  }
}

export default DeviceAddedEvent;
