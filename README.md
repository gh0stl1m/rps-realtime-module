# RealTime module
This module was been created to create the websocket server.

## Desing
The module use the architechture called **Clean Architecture**, based on the boilerplate [clean-node](https://github.com/gh0stl1m/clean-node)

## Entities
The domain contain one entities:
- Room: This entitie contains the members of the room.

## Drivers
The drivers contains only the connection with the redis database.

## Interfaces
The interface expose to another modules the methods which are going to be used for the services.

> **Note:** The module is part of the Game of Drones ecosystem, it it a technical test for the company UruIT.