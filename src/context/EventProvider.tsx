import { ApiKey, User } from '@/utils/types';
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

// Define a discriminated union type for event payloads
export type EventPayloads = {
  INITIAL_EVENT: {},
  EDIT_USER: User,
  DELETE_USER: User,
  EDIT_KEY: ApiKey,
  DELETE_KEY: ApiKey,
  TOGGLE_KEY_STATUS: ApiKey
  // Define other event names and their payload types here
}

// Define a union of all possible event names
type EventNames = keyof EventPayloads;


export type Event = {
  eventName: EventNames,
  payload: EventPayloads[EventNames],
}

export interface EventContextInterface {
  event: Event,
  setEvent: Dispatch<SetStateAction<Event>>
}

export const defaultEventState = {
  event: {
    eventName: "",
    payload: {},
  },
  setEvent: (event: Event) => {
    console.log(event);
  }
}


// Create the event context
export const EventContext = createContext(defaultEventState);

type EventProviderProps = {
  children: ReactNode
}

// Create the EventProvider component
export default function EventProvider({ children }: EventProviderProps) {
  const [event, setEvent] = useState<Event>({ eventName: "INITIAL_EVENT", payload: {} });


  return (
    <EventContext.Provider value={{ event, setEvent }}>
      {children}
    </EventContext.Provider>
  );
};
