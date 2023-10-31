# Bank Transaction System

Bank transaction system built using node, gRPC and express.
The API allows users to create accounts and exchange balance between each other.

## Features

-   transaction system to exchange balance between users
-   authentication using JWT
-   password hashing and encryption using bcrypt
-   data storage using mysql and sequelize
-   database seeders and migrations
-   secrets stored using dotenv

## TODO

-   add endpoints for balance exchange in gateway
-   add feature to load balance
-   separate user and account logic (too much work)
-   add feature to get transaction history for user
-   add queuing feature
