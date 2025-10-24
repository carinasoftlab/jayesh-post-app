import bcrypt from "bcryptjs";
import Article from "./models/Article.js";
import Account from "./models/Account.js";
import { setAuthCookie, clearAuthCookie } from "./auth.js";

const resolvers = {
  Query: {
    posts: async () => {
      const docs = await Article.find()
        .sort({ createdAt: -1 })
        .populate("author")
        .exec();
      return docs.map((d) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        createdAt: d.createdAt.toISOString(),
        author: d.author
          ? {
              id: d.author.id,
              username: d.author.username,
              createdAt: d.author.createdAt.toISOString(),
            }
          : null,
      }));
    },
    myPosts: async (_, __, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      const docs = await Article.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate("author")
        .exec();
      return docs.map((d) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        createdAt: d.createdAt.toISOString(),
        author: d.author
          ? {
              id: d.author.id,
              username: d.author.username,
              createdAt: d.author.createdAt.toISOString(),
            }
          : null,
      }));
    },
    post: async (_, { id }) => {
      const d = await Article.findById(id).populate("author").exec();
      if (!d) return null;
      return {
        id: d.id,
        title: d.title,
        content: d.content,
        createdAt: d.createdAt.toISOString(),
        author: d.author
          ? {
              id: d.author.id,
              username: d.author.username,
              createdAt: d.author.createdAt.toISOString(),
            }
          : null,
      };
    },
    me: async (_, __, { userId }) => {
      if (!userId) return null;
      const u = await Account.findById(userId);
      if (!u) return null;
      return {
        id: u.id,
        username: u.username,
        createdAt: u.createdAt.toISOString(),
      };
    },
  },
  Mutation: {
    addPost: async (_, { title, content }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      const doc = await Article.create({ title, content, author: userId });
      const populated = await doc.populate("author");
      return {
        id: populated.id,
        title: populated.title,
        content: populated.content,
        createdAt: populated.createdAt.toISOString(),
        author: populated.author
          ? {
              id: populated.author.id,
              username: populated.author.username,
              createdAt: populated.author.createdAt.toISOString(),
            }
          : null,
      };
    },
    updatePost: async (_, { id, title, content }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      const doc = await Article.findOne({ _id: id, author: userId });
      if (!doc) throw new Error("Not found");
      if (typeof title === "string") doc.title = title;
      if (typeof content === "string") doc.content = content;
      await doc.save();
      const populated = await doc.populate("author");
      return {
        id: populated.id,
        title: populated.title,
        content: populated.content,
        createdAt: populated.createdAt.toISOString(),
        author: populated.author
          ? {
              id: populated.author.id,
              username: populated.author.username,
              createdAt: populated.author.createdAt.toISOString(),
            }
          : null,
      };
    },
    deletePost: async (_, { id }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      const res = await Article.deleteOne({ _id: id, author: userId });
      return res.deletedCount > 0;
    },
    register: async (_, { username, password }, { res }) => {
      const exists = await Account.findOne({ username });
      if (exists) throw new Error("Username already taken");
      const passwordHash = await bcrypt.hash(password, 10);
      const u = await Account.create({ username, passwordHash });
      const { signToken } = await import("./auth.js");
      const token = signToken(u.id);
      setAuthCookie(res, token);
      return {
        id: u.id,
        username: u.username,
        createdAt: u.createdAt.toISOString(),
      };
    },
    login: async (_, { username, password }, { res }) => {
      const u = await Account.findOne({ username });
      if (!u) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(password, u.passwordHash);
      if (!ok) throw new Error("Invalid credentials");
      const { signToken } = await import("./auth.js");
      const token = signToken(u.id);
      setAuthCookie(res, token);
      return {
        id: u.id,
        username: u.username,
        createdAt: u.createdAt.toISOString(),
      };
    },
    logout: async (_, __, { res }) => {
      clearAuthCookie(res);
      return true;
    },
  },
};

export default resolvers;


