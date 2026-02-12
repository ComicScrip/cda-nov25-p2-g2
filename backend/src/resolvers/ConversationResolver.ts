import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getCurrentUser } from "../auth";
import { Conversation } from "../entities/Conversation";
import { User } from "../entities/User";
import { ForbiddenError, NotFoundError } from "../errors";
import type { GraphQLContext } from "../types";

@Resolver()
export default class ConversationResolver {
  @Query(() => [Conversation])
  // myConversations : affiche toutes mes conversations dans un tableau, sans les détails - uniquement la date et les interlocuteurs
  async myConversations(@Ctx() context: GraphQLContext) {
    // getCurrentUser gère l'erreur UnauthenticatedError si l'utilisateur n'est pas connecté
    const currentUser = await getCurrentUser(context);

    // Récupère toutes les conversations où l'utilisateur est soit l'initiator, soit le participant
    // TypeORM utilise déjà un OR avec le tableau where: [...]
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

    // Vérifie que la conversation existe
    const conversation = await Conversation.findOne({
      where: { id },
      relations: ["initiator", "participant", "messages"],
    });

    if (!conversation) {
      throw new NotFoundError({ message: "Conversation introuvable" });
    }

    // Vérifie que l'utilisateur fait partie de la conversation
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new ForbiddenError({
        message: "Vous n'avez pas accès à cette conversation",
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

    // Vérifie que l'utilisateur ne crée pas une conversation avec lui-même
    if (currentUser.id === participantId) {
      throw new ForbiddenError({
        message: "Vous ne pouvez pas créer une conversation avec vous-même",
      });
    }

    // Vérifie que le participant existe
    const participant = await User.findOne({ where: { id: participantId } });
    if (!participant) {
      throw new NotFoundError({ message: "Utilisateur introuvable" });
    }

    // Vérifie qu'une conversation n'existe pas déjà entre ces deux utilisateurs
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
      throw new ForbiddenError({
        message: "Une conversation existe déjà avec cet utilisateur",
      });
    }

    // Crée la nouvelle conversation
    const newConversation = Conversation.create({
      initiator: currentUser,
      participant: participant,
    });

    return await newConversation.save();
  }
}
