# Bank Transaction System

Bank transaction system built using node, gRPC and express.
The API allows users to create accounts and exchange balance between each other.

## Features

-   transaction system to send and recieve balance between users
-   authentication using JWT
-   password hashing and encryption using bcrypt
-   data storage using mysql and sequelize
-   database seeders and migrations
-   secrets stored using dotenv

## TODO

-   [x] separate user and account tables
-   [x] migrate from mysql2 to mysql2/promise
-   [x] add otp feature for transaction
-   [x] add feature to load balance
-   [x] add endpoints for balance transaction in gateway
-   [x] add feature to fail transaction if wrong otp is provided for 3 time
-   [x] add feature to get transaction history for user
-   [x] add feature to email otp and transaction notification
-   [ ] add queuing feature
