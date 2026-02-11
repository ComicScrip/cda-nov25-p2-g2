import { hash, verify } from "argon2";
import { GraphQLError } from "graphql";
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { endSession, getCurrentUser, startSession } from "../auth";
import {
  ChangePasswordInput,
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  User,
} from "../entities/User";
import type { GraphQLContext } from "../types";
import { NotFoundError, UnauthenticatedError } from "../errors";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertRoleGroupRule(role: string, groupId: number | null | undefined) {
  if (role === "staff") {
    if (groupId == null) {
      throw new GraphQLError("Staff must have a group", {
        extensions: { code: "STAFF_GROUP_REQUIRED", http: { status: 400 } },
      });
    }
    return;
  }
  if (groupId != null) {
    throw new GraphQLError("Parent/Admin must not have a group", {
      extensions: { code: "GROUP_NOT_ALLOWED", http: { status: 400 } },
    });
  }
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
    @Arg("data", () => CreateUserInput, { validate: true })
    data: CreateUserInput,
  ) {
    const email = normalizeEmail(data.email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists", {
        extensions: { code: "EMAIL_ALREADY_TAKEN", http: { status: 400 } },
      });
    }
    assertRoleGroupRule(data.role, data.group_id);
    const hashedPassword = await hash(data.password);

    const newUser = User.create({
      email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      hashedPassword,
      role: data.role,
      group_id: data.role === "staff" ? (data.group_id as number) : null,
    });

    return await newUser.save();
  }

  // Modifier un compte (infos, role, group)
  @Authorized("admin")
  @Mutation(() => User)
  async updateUser(
    @Arg("data", () => UpdateUserInput, { validate: true })
    data: UpdateUserInput,
  ) {
    const user = await User.findOne({ where: { id: data.id } });
    if (!user) {
      throw new NotFoundError({ message: "User not found" });
    }

    const update: Partial<User> = {};
    if (data.email !== undefined && data.email !== null) {
      update.email = normalizeEmail(data.email);
    }
    if (data.first_name !== undefined && data.first_name !== null) {
      update.first_name = data.first_name;
    }
    if (data.last_name !== undefined && data.last_name !== null) {
      update.last_name = data.last_name;
    }
    if (data.phone !== undefined && data.phone !== null) {
      update.phone = data.phone;
    }
    if (data.avatar !== undefined && data.avatar !== null) {
      update.avatar = data.avatar;
    }

    const nextRole = (data.role ?? user.role) as string;
    if (data.role !== undefined && data.role !== null) update.role = data.role;
    if (nextRole === "staff") {
      if (data.group_id !== undefined) {
        update.group_id = data.group_id;
      }
      const finalGroupId = update.group_id ?? user.group_id;
      if (finalGroupId == null) {
        throw new GraphQLError("Staff must have a group", {
          extensions: { code: "STAFF_GROUP_REQUIRED", http: { status: 400 } },
        });
      }
    } else {
      if (data.group_id !== undefined && data.group_id !== null) {
        throw new GraphQLError("Parent/Admin must not have a group", {
          extensions: { code: "GROUP_NOT_ALLOWED", http: { status: 400 } },
        });
      }
      update.group_id = null;
    }

    Object.assign(user, update);
    return await user.save();
  }

  // Supprimer un compte
  @Authorized("admin")
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundError({ message: "User not found" });
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
      throw new UnauthenticatedError({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await verify(user.hashedPassword, data.password);
    if (!isPasswordValid) {
      throw new UnauthenticatedError({
        message: "Invalid email or password",
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
