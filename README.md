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

-   [X] separate user and account tables
-   [X] migrate from mysql2 to mysql2/promise
-   [X] add otp feature for transaction
-   [X] add feature to load balance
-   [ ] add endpoints for balance transaction in gateway
-   [ ] add feature to get transaction history for user
-   [ ] add queuing feature
