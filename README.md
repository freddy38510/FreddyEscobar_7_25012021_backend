# Groupomania Backend

> Groupomania social network

## Install the dependencies

```bash
yarn
```

## Run migrations

- For production database

```bash
yarn knex:prod migrate:latest
```

- For development database

```bash
yarn knex:dev migrate:latest
```

### Start the server in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

### Start the server for production

```bash
yarn start
```
