import { DataSource } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { User } from "../entities/User";
import { Child } from "../entities/Child";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import env from "../env";

export default new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
  entities: [User, Message, Conversation],
  entities: [User,Group,Planning],
  entities: [User,Child,Group,Planning],
  synchronize: env.NODE_ENV !== "production",
  //logging: true
});
