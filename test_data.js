// test_account_1 total points: 26.25
// test_account_2 total points: 70
// test_account_1 total points: 22.50

[
  {
    user_id: "U1",
    user_name: "test_account_1",
    text: "5",
    command: "/running",
  },
  {
    user_id: "U1",
    user_name: "test_account_1",
    text: "10",
    command: "/running",
  },
  {
    user_id: "U1",
    user_name: "test_account_1",
    text: "5",
    command: "/biking",
  },

  {
    user_id: "U2",
    user_name: "test_account_2",
    text: "20",
    command: "/running",
  },
  {
    user_id: "U2",
    user_name: "test_account_2",
    text: "30",
    command: "/biking",
  },
  {
    user_id: "U3",
    user_name: "test_account_3",
    text: "5",
    command: "/biking",
  },
  {
    user_id: "U3",
    user_name: "test_account_3",
    text: "10",
    command: "/biking",
  },
].map((x) => handleTask({ body: x }, { json: () => {} }));
