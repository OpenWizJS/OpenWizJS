class Event {
  readonly cancelable: boolean;
  readonly name: string;
  private _cancelled = false;

  get cancelled(): boolean {
    return this._cancelled;
  }

  private set cancelled(value: boolean) {
    this._cancelled = value;
  }

  constructor(name: string, cancelable: boolean) {
    this.name = name;
    this.cancelable = cancelable;
  }

  cancel() {
    const failurePrefix = `Attempt to cancel ${this.name} failed:`;

    if (!this.cancelable)
      throw new Error(`${failurePrefix} Event is not cancelable.`);

    this.cancelled = true;
  }
}

export default Event;
