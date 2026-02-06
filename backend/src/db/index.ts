import { DataSource } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { User } from "../entities/User";
import env from "../env";

export default new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
  entities: [User, Message, Conversation],
  synchronize: env.NODE_ENV !== "production",
  //logging: true
});
