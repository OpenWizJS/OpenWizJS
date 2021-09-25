import Event from "./Event";

export enum DiscoveryFinishedCause {
  TIMEOUT_REACHED,
  EXPECTED_DEVICES_HIT,
  USER_REQUESTED,
}

class DiscoveryFinishedEvent extends Event {
  readonly cause: DiscoveryFinishedCause;

  constructor(cause: DiscoveryFinishedCause) {
    super("discovery_finished", true);

    this.cause = cause;
  }
}

export default DiscoveryFinishedEvent;
