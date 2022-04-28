# PrismaGQL

PrismaGQL is a GraphQL Schema builder designed to work well with [Prisma](https://github.com/prisma/prisma).  
It aims to be simple, type-safe and customizable as needed for real-world products.

**PrismaGQL is currently in alpha version, and the interface may change significantly until a stable version is released.**

## Getting started

The fastest way to get started with PrismaGQL is by following the [Quickstart](https://github.com/PrismaGQL/prismagql/blob/master/quickstart.md).  
If you prefer to see an actual example, there is a [sample repository](https://github.com/PrismaGQL/prismagql-example) that you can check out.

## Features

- Quickly create a GraphQL schema based on your Prisma models & [It is fully customizable]()
- Generating [efficient Prisma queries]() from GraphQL queries (solves N+1 problems)
- Easily [generate GraphQL inputs]() that can be passed to Prisma queries
- Built in tools you will allways need:
  - [pagination]() (Relay)
  - [dataloader]()
  - [input validator]()
  - [auth control]()
- As type-safe as possible, even if it contains circular references

## TODO

- [ ] Better documentation
- [ ] Support for the GraphQL interface and union
