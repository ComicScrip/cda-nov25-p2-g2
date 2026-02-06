import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import ChildResolver from "./resolvers/ChildResolver";
import { GroupResolver } from "./resolvers/GroupResolver";
import ReportResolver from "./resolvers/ReportResolver";
import UserResolver from "./resolvers/UserResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ReportResolver, ChildResolver, GroupResolver],
    authChecker,
  });
}
