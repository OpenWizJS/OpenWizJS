import Event from "./Event";

export type EventHandlerFunction<Context extends Event> = (
  context: Context
) => Promise<void>;

interface EventHandler<Context extends Event> {
  readonly priority: number;
  readonly handler: EventHandlerFunction<Context>;
}

export default EventHandler;
