import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import ConversationResolver from "./resolvers/ConversationResolver";
import MessageResolver from "./resolvers/MessageResolver";
import UserResolver from "./resolvers/UserResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ConversationResolver, MessageResolver],
    authChecker,
  });
}
