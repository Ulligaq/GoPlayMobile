export const getFirestore = jest.fn(() => ({}));

export const collection = jest.fn(() => ({
  doc: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
  add: jest.fn(),
  get: jest.fn(),
}));

export const getDocs = jest.fn(() =>
  Promise.resolve({
    docs: [
      {
        data: () => ({
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
          videoLink: "",
        }),
      },
    ],
  })
);

export const initializeApp = jest.fn();
export const getApps = jest.fn(() => []);
export const getApp = jest.fn();