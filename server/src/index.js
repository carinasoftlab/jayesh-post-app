import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './typeDefs.js';
import resolvers from './api.js';
import { getUserIdFromReq } from './auth.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';

const DB = (process.env.MONGODB_URI || '').replace('<PASSWORD>', process.env.MONGODB_PASSWORD || '');

async function start() {
  if (!DB) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }
  await mongoose.connect(DB);

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, userId: getUserIdFromReq(req) }),
    })
  );

  app.get('/', (req, res) => {
    res
      .type('text/html')
      .send('<!doctype html><html><head><meta charset="utf-8"><title>Blog API</title></head><body><pre>Blog API running. Send GraphQL requests to /graphql</pre></body></html>')
  })

  app.post('/', (req, res) => {
    res.status(404).json({ error: 'Not found. Use /graphql for POST GraphQL operations.' })
  })

  httpServer.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});


