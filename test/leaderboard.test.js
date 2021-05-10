require("dotenv").config();
const db = require("../utils/db");
const handleTask = require("../slack/commands/task");
const fs = require("fs");
const LeaderboardService = require("../services/leaderboard");
const TaskService = require("../services/task");

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initDb();
});

afterEach(async () => {
  await clearData();
});

test("test leaderboard state multiple entries per user", async () => {
  /*
    Assumptions:
    running: 1.25
    biking: 1.50

    Data summary in this JSON
    =================================
    U1 running 15 
    U1 biking  5  most active running, total pts 15*1.25 + 5*1.5 = 26.25
    ---------------------------------
    U2 running 20
    U2 biking  30 most active biking, total pts 20*1.25 + 30*1.5=70
    --------------------------------
    U3 biking  15 most active biking, total pts 15*1.5=22.5
  */
  await insertJsonData("/data/1.json");

  // Get leaderboard
  const leaderboard = await LeaderboardService.getTop3UsersWithHighestPointsInLastHour();

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];
  expect(leaderboard).toBeDefined();

  expect(firstPlace.user_name).toBe("test_account_2");
  expect(secondPlace.user_name).toBe("test_account_1");
  expect(thirdPlace.user_name).toBe("test_account_3");

  expect(firstPlace.total_points).toBe(70);
  expect(secondPlace.total_points).toBe(26.25);
  expect(thirdPlace.total_points).toBe(22.5);

  expect(firstPlace.activity_name).toBe("biking");
  expect(secondPlace.activity_name).toBe("running");
  expect(thirdPlace.activity_name).toBe("biking");
});

test("test leaderboard one entry per user", async () => {
  /*
    Assumptions:
    running: 1.25
    biking: 1.50

    Data summary in this JSON
    =================================
    U1 running 3  most active running, total pts 3*1.25 = 3.75
    ---------------------------------
    U2 biking 17 most active biking, total pts 17*1.5=25.5
    --------------------------------
    U3 biking 35 most active biking, total pts 35*1.5=52.5
  */
  await insertJsonData("/data/2.json");

  // Get leaderboard
  const leaderboard = await LeaderboardService.getTop3UsersWithHighestPointsInLastHour();

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];
  expect(leaderboard).toBeDefined();

  expect(firstPlace.user_name).toBe("test_account_3");
  expect(secondPlace.user_name).toBe("test_account_2");
  expect(thirdPlace.user_name).toBe("test_account_1");

  expect(firstPlace.total_points).toBe(52.5);
  expect(secondPlace.total_points).toBe(25.5);
  expect(thirdPlace.total_points).toBe(3.75);

  expect(firstPlace.activity_name).toBe("biking");
  expect(secondPlace.activity_name).toBe("biking");
  expect(thirdPlace.activity_name).toBe("running");
});

async function initDb() {
  await db.query(`
drop table if exists users cascade;
drop table if exists commands cascade;
drop table if exists tasks cascade;

create table users(
    id varchar primary key,
    name varchar(255)
);
create table commands(
    id serial primary key,
    name varchar(255),
    factor numeric(6, 2)
);

insert into commands (name, factor) values ('running', 1.25);
insert into commands (name, factor) values ('biking', 1.5);

create table tasks(
    id serial primary key,
    command_id integer references commands(id),
    user_id varchar(255) references users(id),
    value integer,
    created_at timestamp with time zone
);
  `);
}

async function insertJsonData(fileName) {
  const data = JSON.parse(fs.readFileSync(__dirname + fileName, "utf-8"));

  // Write to database
  for (let i = 0; i < data.length; ++i) {
    const dataPoint = data[i];
    await TaskService.createTask(
      dataPoint.user_id,
      dataPoint.user_name,
      dataPoint.command.substring(1),
      dataPoint.text
    );
  }
}

async function clearData() {
  await db.query(`DELETE FROM tasks; DELETE FROM users`);
}
