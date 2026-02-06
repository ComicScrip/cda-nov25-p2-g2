import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import ConversationResolver from "./resolvers/ConversationResolver";
import MessageResolver from "./resolvers/MessageResolver";
import UserResolver from "./resolvers/UserResolver";
import ChildResolver from "./resolvers/ChildResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ConversationResolver, MessageResolver],
    resolvers: [UserResolver, ChildResolver],
    authChecker,
  });
}
