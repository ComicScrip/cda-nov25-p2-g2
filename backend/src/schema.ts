import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import UserResolver from "./resolvers/UserResolver";
import ChildResolver from "./resolvers/ChildResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ChildResolver],
    authChecker,
  });
}
