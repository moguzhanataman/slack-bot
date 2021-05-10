# General Design Document

Design decisions about API, Database and Business Logic.

## API

### Public API

This API is for interacting with slack.

These two endpoints requires some information from Slack, user_id, user_name and text.
user_id and user_name refers to the user that is posting tasks, text is parameter to the task

- `POST /slack/commands/running` req.body params `{ user_id, user_name, text }`

- `POST /slack/commands/biking` req.body params `{ user_id, user_name, text }`

Sends a markdown formatted leaderboard

- `POST /slack/commands/leaderboard`

### Private API

- `GET /test/add-test-data` this endpoint allowed in development mode to insert data to database

## Database Entities

### Users

Represents slack user
Examples:

| id (PK) | name    |
| ------- | ------- |
| 1       | oguzhan |
| 2       | ege     |
| 3       | kerem   |

### Commands

Slack "slash" commands that has side effects (eg. /running, /biking but not /leaderboard, we don't need to hold information about users calling leaderboard). The reason I'm using "numeric" data type for factor is PostgreSQL documentation (https://www.postgresql.org/docs/9.3/datatype-numeric.html section 8.1.2 recommends numeric type where exactness required, if performance would be an issue double can be used)

| id (PK int) | name (string) | factor ( numeric (6, 2) ) |
| ----------- | ------------- | ------------------------- |
| 1           | running       | 1.25                      |
| 2           | biking        | 1.5                       |

### Tasks

When user runs a command we will create a task entry which will hold user and command information. NOTE: Tasks have timestamp which omitted in following table for brewity.

| id (PK int) | command_id | user_id | value | (meaning)                                                 |
| ----------- | ---------- | ------- | ----- | --------------------------------------------------------- |
| 1           | 1          | 1       | 5     | Oguzhan ran "running" command with value 5 ("/running 5") |
| 2           | 2          | 3       | 7     | Kerem ran "biking" command with value 7                   |

## Business Logic

The most complex bit in the application is leaderboard generation.

### Leaderboard

Every completed task generates points for users.

- When called upon, this command creates a table that ranks top 3 users from
  highest points accumulated to the lowest within the last hour frame (columns
  should have the necessary information that a user should see)
- It prints this table in the slack channel as a public message

#### SQL Queries

Get total points of users by command type final version

```sql
SELECT * FROM (
	SELECT
		users.name AS user_name,
		commands.name AS cmd_name,
		SUM(value * factor) AS total,
		RANK() OVER (PARTITION BY users.name ORDER BY SUM(value * factor) DESC) AS rnk
	FROM tasks
	JOIN commands ON commands.id = command_id
	JOIN users ON users.id = user_id
	GROUP BY users.id, users.name, commands.name
    ORDER BY total DESC
) AS t
WHERE rnk = 1
```

### Random Notes

Random thoughts and notes.

slack request verification
postgresql, which activity users most active

Printing leaderboard table

| ===== User name ===== | === Points === | Most Active |
| --------------------- | -------------- | ----------- |
|                       |                |             |
