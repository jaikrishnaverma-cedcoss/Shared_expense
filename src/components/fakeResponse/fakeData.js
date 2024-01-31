export const fakeData = {
  login: {
    success: true,
    data: {
      id: 15,
      username: "jai verma",
      email: "jai@gmail.com",
      firstName: "jai",
      lastName: "verma",
      gender: "male",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZz9zaXplPTUweDUwJnNldD1zZXQxIiwiaWF0IjoxNjM1NzczOTYyLCJleHAiOjE2MzU3Nzc1NjJ9.n9PQX8w8ocKo0dMCw3g8bKhjB8Wo7f7IONFBDqfxKhs",
    },
    msg: "Login successfully",
  },

  login_error: {
    success: false,
    msg: "Something wents wong!",
  },

  users: {
    success: true,
    msg: "successfully fetched",
    data: [
      {
        id: 15,
        username: "jai verma",
        email: "jai@gmail.com",
        firstName: "jai",
        lastName: "verma",
        gender: "male",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      {
        id: 16,
        username: "radhesh tiwari",
        email: "radhesh@gmail.com",
        firstName: "radhesh",
        lastName: "tiwari",
        gender: "male",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      {
        id: 17,
        username: "prabhaker",
        email: "prabhaker@gmail.com",
        firstName: "prabhaker",
        lastName: "",
        gender: "male",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      {
        id: 18,
        username: "shakti",
        email: "shakti@gmail.com",
        firstName: "shakti",
        lastName: "",
        gender: "male",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    ],
  },
  transactions: {
    success: true,
    msg: "successfully fetched",
    data: [
      {
        "amount": 5666,
        "collabrators": [
            15,
            17
        ],
        "expense_detail": "market",
        "expense_time": "Wed 31-Jan-2024 05:11 PM"
    }
    ],
  },
  wrong_endpoint: {
    success: false,
    msg: "wrong api endpoint call",
  },
  success_endpoint: {
    success: true,
    msg: "data saved successfully",
  },
};
