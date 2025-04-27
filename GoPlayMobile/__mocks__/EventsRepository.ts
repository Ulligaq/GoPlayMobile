const mockEvents = [
    {
      EventID: "1",
      EventName: "Test Event",
      EventType: "Music",
      EventDescription: "Live music in the park",
      EventDateTime: "2099-12-31 06:00 PM",
      Address: "123 Fake St",
      Latitude: 46.87,
      Longitude: -113.99,
      Approval: true,
      AttendanceCount: 42,
      AdvertiserID: "abc123",
      AgeRange: "All",
      SoberFriendly: true,
      PrimaryImage: "",
      SecondaryImages: [],
      RejectionReason: "",
      videoLink: ""
    }
  ];
  
  // Default mock implementation of EventsRepository
  export const EventsRepository = jest.fn().mockImplementation(() => {
    console.log("🧪 EventsRepository (mock) called");
    return {
      getAllEvents: jest.fn().mockResolvedValue(mockEvents),
      getEventById: jest.fn().mockImplementation((id: string) => {
        const match = mockEvents.find(event => event.EventID === id);
        return Promise.resolve(match || null);
      })
    };
  });