import gql from "graphql-tag";

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    author: User
  }

  type User {
    id: ID!
    username: String!
    createdAt: String!
  }

  type Query {
    posts: [Post!]!
    me: User
    myPosts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    addPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): User!
    logout: Boolean!
  }
`;

export default typeDefs;


