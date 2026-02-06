import { DataSource } from "typeorm";
import { Child } from "../entities/Child";
import { Conversation } from "../entities/Conversation";
import { Group } from "../entities/Group";
import { Message } from "../entities/Message";
import { Planning } from "../entities/Planning";
import { Report } from "../entities/Report";
import { User } from "../entities/User";
import env from "../env";

export default new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
  entities: [User, Report, Group, Planning, Child, Message, Conversation],
  synchronize: env.NODE_ENV !== "production",
  //logging: true
});
