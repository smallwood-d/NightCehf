import fs from 'fs';
import path from 'path';
import {ApolloServer, gql, Config} from 'apollo-server-express'; 
import {BaseContext} from'apollo-server-types';

import { Application } from "express";
import { DB } from '../api/db';

const db = new DB();

// import schema, (using GraphQL schema language)
const typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    async Recepies(parent: any, {ingredients, first, offset}: any, {db}: BaseContext) {
      return await db.getRecepie(ingredients, first, offset);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers, context: { db } });

export async function addGraphql (app: Application) { 
  await server.start();
  server.applyMiddleware({
    app, 
    //path: '/notitlie'
  });
  db.setDB("recepies");
  await db.connect();
 }