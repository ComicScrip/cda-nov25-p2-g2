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
  UserRole,
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
    return await User.find({
      relations: ["children"], // Charge la relation avec les enfants
    });
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

    // ✅ VALIDATION : Un staff DOIT avoir un group_id
    if (data.role === UserRole.Staff && !data.group_id) {
      throw new GraphQLError(
        "Un membre du personnel doit être rattaché à un groupe",
        {
          extensions: { code: "MISSING_GROUP_ID", http: { status: 400 } },
        },
      );
    }

    // ✅ VALIDATION : Un parent NE DOIT PAS avoir de group_id (il hérite des groupes de ses enfants)
    if (data.role === UserRole.Parent && data.group_id) {
      throw new GraphQLError(
        "Un parent ne peut pas être rattaché directement à un groupe. Le(s) groupe(s) sont déterminés par ses enfants.",
        {
          extensions: { code: "INVALID_GROUP_ID", http: { status: 400 } },
        },
      );
    }

    const hashedPassword = await hash(data.password);

    const newUser = User.create({
      email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      hashedPassword,
      role: data.role,
      group_id: data.group_id || null, // ✅ Utiliser null si non fourni
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
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    // VALIDATION : Si on change le rôle vers Staff, vérifier qu'il y a un group_id
    if (data.role === UserRole.Staff && !data.group_id && !user.group_id) {
      throw new GraphQLError(
        "Un membre du personnel doit être rattaché à un groupe",
        {
          extensions: { code: "MISSING_GROUP_ID", http: { status: 400 } },
        },
      );
    }

    // VALIDATION : Si on change le rôle vers Parent, retirer le group_id
    if (data.role === UserRole.Parent && data.group_id) {
      throw new GraphQLError(
        "Un parent ne peut pas être rattaché directement à un groupe",
        {
          extensions: { code: "INVALID_GROUP_ID", http: { status: 400 } },
        },
      );
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
