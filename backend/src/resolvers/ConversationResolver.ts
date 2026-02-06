import { GraphQLError } from "graphql";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getCurrentUser } from "../auth";
import { Conversation } from "../entities/Conversation";
import { User } from "../entities/User";
import type { GraphQLContext } from "../types";

@Resolver()
export default class ConversationResolver {
  @Query(() => [Conversation])
  // myConversations : affiche toutes mes conversations dans un tableau, sans les détails - uniquement la date et les interlocuteurs
  async myConversations(@Ctx() context: GraphQLContext) {
    const currentUser = await getCurrentUser(context);
    if (!currentUser) {
      throw new GraphQLError("Vous devez être connecté", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }

    // Récupère toutes les conversations où l'utilisateur est soit l'initiator, soit le participant
    const conversations = await Conversation.find({
      where: [
        { initiator: { id: currentUser.id } },
        { participant: { id: currentUser.id } },
      ],
      relations: ["initiator", "participant", "messages"],
      order: { creationDate: "DESC" },
    });

    return conversations;
  }

  @Query(() => Conversation, { nullable: true })
  // conversation : affiche une conversation précise, avec tous les messages échangés dans cette conversation
  async conversation(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);
    if (!currentUser) {
      throw new GraphQLError("Vous devez être connecté", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }

    // Vérifie que la conversation existe si on la charche par son id
    const conversation = await Conversation.findOne({
      where: { id },
      relations: ["initiator", "participant", "messages"],
    });

    if (!conversation) {
      throw new GraphQLError("Conversation introuvable", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    // Vérifie que l'utilisateur fait partie de la conversation, soit comme initiator, soit comme participant
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new GraphQLError("Vous n'avez pas accès à cette conversation", {
        extensions: { code: "FORBIDDEN", http: { status: 403 } },
      });
    }

    return conversation;
  }

  @Mutation(() => Conversation)
  async createConversation(
    @Arg("participantId", () => Int) participantId: number,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);
    if (!currentUser) {
      throw new GraphQLError("Vous devez être connecté", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }

    // Vérifie que l'utilisateur ne crée pas une conversation avec lui-même
    if (currentUser.id === participantId) {
      throw new GraphQLError(
        "Vous ne pouvez pas créer une conversation avec vous-même",
        {
          extensions: { code: "INVALID_INPUT", http: { status: 400 } },
        },
      );
    }

    // Vérifie que le participant existe
    const participant = await User.findOne({ where: { id: participantId } });
    if (!participant) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    // Vérifie qu'une conversation n'existe pas déjà entre ces deux utilisateurs pour ne pas créer un doublon
    const existingConversation = await Conversation.findOne({
      where: [
        {
          initiator: { id: currentUser.id },
          participant: { id: participantId },
        },
        {
          initiator: { id: participantId },
          participant: { id: currentUser.id },
        },
      ],
    });

    if (existingConversation) {
      throw new GraphQLError(
        "Une conversation existe déjà avec cet utilisateur",
        {
          extensions: {
            code: "CONVERSATION_ALREADY_EXISTS",
            http: { status: 400 },
          },
        },
      );
    }

    // Crée la nouvelle conversation
    const newConversation = Conversation.create({
      initiator: currentUser,
      participant: participant,
    });

    return await newConversation.save();
  }
}
