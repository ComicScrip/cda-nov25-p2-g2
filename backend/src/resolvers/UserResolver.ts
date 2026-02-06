import { hash, verify } from "argon2";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { endSession, getCurrentUser, startSession } from "../auth";
import {
  ChangePasswordInput,
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  User,
} from "../entities/User";
import type { GraphQLContext } from "../types";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

@Resolver()
export default class UserResolver {
  @Authorized("admin")
  @Query(() => [User])
  async users() {
    return await User.find();
  }

  // Créer un compte (parent / staff) avec mot de passe temporaire
  @Authorized("admin")
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => CreateUserInput, { validate: true }) data: CreateUserInput,
  ) {
    const email = normalizeEmail(data.email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists", {
        extensions: { code: "EMAIL_ALREADY_TAKEN", http: { status: 400 } },
      });
    }
    const hashedPassword = await hash(data.password);

    const newUser = User.create({
      email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      hashedPassword,
      role: data.role,
      group_id: data.group_id,
    });

    return await newUser.save();
  }

  // Modifier un compte (infos, role, group)
  @Authorized("admin")
  @Mutation(() => User)
  async updateUser(
    @Arg("data", () => UpdateUserInput, { validate: true }) data: UpdateUserInput,
  ) {
    const user = await User.findOne({ where: { id: data.id } });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (data.email !== undefined) user.email = normalizeEmail(data.email);
    if (data.first_name !== undefined) user.first_name = data.first_name;
    if (data.last_name !== undefined) user.last_name = data.last_name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.avatar !== undefined) user.avatar = data.avatar;
    if (data.role !== undefined) user.role = data.role;
    if (data.group_id !== undefined) user.group_id = data.group_id;

    return await user.save();
  }

  // Supprimer un compte
  @Authorized("admin")
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    await user.remove();
    return true;
  }

  @Mutation(() => String)
  async login(
    @Arg("data", () => LoginInput, { validate: true }) data: LoginInput,
    @Ctx() context: GraphQLContext,
  ) {
    const email = normalizeEmail(data.email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new GraphQLError("Invalid email or password", {
        extensions: { code: "INVALID_CREDENTIALS", http: { status: 401 } },
      });
    }

    const isPasswordValid = await verify(user.hashedPassword, data.password);
    if (!isPasswordValid) {
      throw new GraphQLError("Invalid email or password", {
        extensions: { code: "INVALID_CREDENTIALS", http: { status: 401 } },
      });
    }

    return startSession(context, user);
  }

  // Déconnexion (clear cookie)
  @Mutation(() => Boolean)
  async logout(@Ctx() context: GraphQLContext) {
    endSession(context);
    return true;
  }

  // Profil courant
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: GraphQLContext) {
    try {
      return await getCurrentUser(context);
    } catch {
      return null;
    }
  }
  // Changer son mot de passe (user connecté)
  @Authorized() // juste être connecté
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data", () => ChangePasswordInput, { validate: true })
    data: ChangePasswordInput,
    @Ctx() context: GraphQLContext,
  ) {
    const user = await getCurrentUser(context);

    const ok = await verify(user.hashedPassword, data.currentPassword);
    if (!ok) {
      throw new GraphQLError("Current password is incorrect", {
        extensions: { code: "INVALID_CURRENT_PASSWORD", http: { status: 400 } },
      });
    }

    user.hashedPassword = await hash(data.newPassword);
    await user.save();

    return true;
  }
}
