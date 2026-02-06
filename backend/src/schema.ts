import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import ReportResolver from "./resolvers/ReportResolver";
import UserResolver from "./resolvers/UserResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ReportResolver],
    authChecker,
  });
}
