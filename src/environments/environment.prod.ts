export const environment = {
  production: true,
  version: '20.0.0',
  googleMapsAPIKey: 'AIzaSyCERpTyB0-t2VxMabliMWm44DT4FNwv9GM',

  // api for use of the production dotnet and database
  apiUrl: 'https://rv.be/api/',
  apiWhiteListDomain: ['rv.be'],
  apiBlackListDomain: ['rv.be/api/account'],

  // Api Key and info for using contactmail functionality
  apiVsoftMailGuid: '5205fa57-766f-4af0-9207-d993d81d759b',
  apiVsoftSendFromAddress: 'josvermoesen@rv.be',
  apiVsoftSendFromName: 'Roelandt & Vermoesen 1935',

  // For vsoft
  contentful: {
    spaceId: 'mq8ieqd7mcv8',
    token: 'e92105b30fe907b0de47100961329d50bec5e0476f55473e1b821e4919e4a26e',
  },

  // Banking info
  brokerIban: 'BE83891854037015',
  brokerBic: 'VDSPBE91',
  brokerName: 'Roelandt en Vermoesen bv',

  // google meetup
  meetupCode: '9310gb141',

  fakeUser: {
    userName: 'myemail@outlook.be',
    token: 'token',
    email: 'myemail@outlook.be',
    knownAs: 'My FullName',
    roles: ['Member', 'VIP'],
    berNumber: '61022540345',
    clientNumber: '010018',
    phoneNumber: '0475/123456',
    city: 'Ghent',
    country: 'Belgium',
    gdpr: 'true',
    introduction: 'Hey, it is me Jos',
    lookingFor: 'I search a house',
    photos: [],
    created: new Date('2023-01-01'), // Example date
    lastActive: new Date(), // Current date
  },
};
