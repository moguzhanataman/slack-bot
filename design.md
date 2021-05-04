# General Design Document

Sketching rough ideas

## API

Create a new task for user with value
PUT /tasks/running { user_id, value }
PUT /tasks/biking { user_id, value }

GET /leaderboards

## Database Entities

### Users

Represents slack user
Examples:

| id  | name    |
| --- | ------- |
| 1   | oguzhan |
| 2   | ege     |
| 3   | kerem   |

### Commands

Slack "slash" commands that has side effects (eg. /running, /biking but not /leaderboard, we don't need to hold information about users calling leaderboard). The reason I'm using "numeric" data type for factor is PostgreSQL documentation (https://www.postgresql.org/docs/9.3/datatype-numeric.html section 8.1.2 recommends numeric type where exactness required, if performance would be an issue double can be used) NOTE: Commands have timestamp which omitted in following table for brewity.

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

Roughly this SQL gets the necessary information

```sql
SELECT
    u.name,
    factor * sum(value) as total_points
FROM
    tasks t
INNER JOIN
    commands c ON c.id = t.command_id
INNER JOIN
    users u ON u.id = t.user_id

-- only last 1 hour
WHERE
    t.timestamp >= (NOW() - INTERVAL '1 hour')

-- highest to lowest points
ORDER BY
    total_points DESC

-- top 3 users
LIMIT 3
```
