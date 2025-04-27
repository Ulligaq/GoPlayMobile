export class ParticipantEventRepository {
    addParticipantEvent = jest.fn();
  }
  
  export const ParticipantEventFactory = {
    createParticipantEvent: jest.fn(() => ({
      id: "mock-event-id",
      type: "INTERESTED",
      eventId: "mocked-event-id",
    })),
  };