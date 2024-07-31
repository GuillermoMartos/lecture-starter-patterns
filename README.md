# BSA patterns practices and principles homework starter

## For deployed version:

[Frontend deployed URL](https://lecture-starter-patterns-client-mu.vercel.app/)

## For local version:

Since this version deployed won't let you see backend logs and data writting, you can run this project
on local changing useDeployedProductionURL variable to false on client/src/common/constants/socket.constant.ts
and follow the next steps:

## Start the application

1. Install dependencies

```
npm i
```

2. Start backend

```
npm start -w server
```

3. Start client

```
npm start -w client

## Info

- This project saves data in memory so you don't need any database
- This project uses [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- NodeJS (16.x.x)
- NPM (8.x.x)
```
