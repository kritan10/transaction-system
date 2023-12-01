# Transaction System - Node.js/gRPC

This is a Node.js based transaction system API built following the microservices architecture.

# Table of Contents

- [Transaction System - Node.js/gRPC](#transaction-system---nodejsgrpc)
- [Table of Contents](#table-of-contents)
  - [Modules](#modules)
    - [`server`](#server)
      - [Dependencies](#dependencies)
      - [Running the server](#running-the-server)
    - [`gateway`](#gateway)
      - [Dependencies](#dependencies-1)
      - [Running the gateway](#running-the-gateway)
    - [`common`](#common)
      - [Dependencies](#dependencies-2)
    - [`qr`](#qr)
      - [Dependencies](#dependencies-3)
      - [Running the `qr` server](#running-the-qr-server)
  - [System Features](#system-features)

## Modules

The project consists of the following modules:

### `server`

The `server` module consists of the core logic to handle transactions.

#### Dependencies

-   **node-grpc**: gRPC Server
-   **MySQL**: Database
-   **Sequelize**: ORM
-   **nodemailer**: Mail Client
-   **bcrypt**: Password Hashing
-   **socket.io-client**: Socket.IO client

#### Running the server

In order to run the server, a MySQL database is required. Download and install MySQL if your system does not have it already installed. Make sure the MySQL server is running.

A configuration file is required in order for the server to work. Create a file name .env.development in the `server` folder with the following fields:

```
DB_HOST="127.0.0.1"
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="transaction_db"
DB_PORT="3306"

GRPC_ADDRESS="0.0.0.0"
GRPC_PORT="50051"

SOCKETIO_ADDRESS="0.0.0.0"
SOCKETIO_PORT="3001"

ENABLE_NODEMAILER=0
NODEMAILER_EMAIL="myemail@mail.com"
NODEMAILER_PASSWORD="mypassword"
```

Install all dependencies

```sh
cd server && npm install
```

When running for the first time

```sh
npm run init
```

After initialization, the server can be run with

```sh
npm start
```

---

### `gateway`

The `gateway` module consists of a standard REST API to communicate with the `server` using gRPC client.

#### Dependencies

-   **express**: HTTP Server
-   **jsonwebtoken**: Handle JWT
-   **bcrypt**: Password Hashing

#### Running the gateway

A configuration file is required in order for the gateway to work. Create a file name .env.development in the `gateway` folder with the following fields:

```
GRPC_ADDRESS="0.0.0.0"
GRPC_PORT="3000"

JWT_KEY="MY JWT KEY"
JWT_EXPIRY_TIME="n d"
```

Note: _The gateway is incomplete and all functionality might not work. Consider using BloomRPC to use the server. The .proto files can be found in the `common` folder._

Install all dependencies

```sh
cd gateway && npm install
```

Start the gateway

```sh
npm start
```

---

### `common`

The `common` module consists of files shared between two or more modules.

#### Dependencies

-   No dependencies.

---

### `qr`

The `qr` module handles QR encoding/decoding and communication between `server` and a demo **browser client**.

#### Dependencies

-   **express**: HTTP Server
-   **socket.io**: Socket.IO (Websocket)
-   **styled-qr-code-node**: QR Code generation

#### Running the `qr` server

The QR server has a web portal available at the root address.

Install all dependencies

```sh
cd qr && npm install
```

Start the QR server

```sh
npm start
```

<br>

## System Features

-   standard transaction features
-   send and receive balance
-   get transaction history
-   user account creation and management
-   authentication using JWT
-   transaction verification through OTP or QR
-   password hashing and encryption
