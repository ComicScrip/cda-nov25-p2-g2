import { IsNotEmpty } from "class-validator";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { getCurrentUser } from "../auth";
import { ForbiddenError, NotFoundError } from "../errors";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import type { GraphQLContext } from "../types";

@InputType()
// La création d'un nouveau message implique la création de la classe CreateMessageInput
export class CreateMessageInput {
  @Field()
  @IsNotEmpty({ message: "Le contenu ne peut pas être vide" })
  content: string;

  @Field(() => Int)
  conversationId: number;
}

@Resolver()
export default class MessageResolver {
  // Retourne un tableau de messages d'une conversation
  @Query(() => [Message])
  async messagesFromConversation(
    @Arg("conversationId", () => Int) conversationId: number,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);

    // Vérifie que la conversation existe
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      relations: ["initiator", "participant"],
    });

    if (!conversation) {
      throw new NotFoundError({ message: "Conversation introuvable" });
    }

    // Vérifie que l'utilisateur fait partie de la conversation
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new ForbiddenError({ message: "Vous n'avez pas accès à cette conversation" });
    }

    // Récupère tous les messages de la conversation du plus ancien au plus récent
    const messages = await Message.find({
      where: { conversation: { id: conversationId } },
      relations: ["author", "conversation"],
      order: { date: "ASC" },
    });

    return messages;
  }

  // Crée un nouveau message dans une conversation
  @Mutation(() => Message)
  async createMessage(
    @Arg("data", () => CreateMessageInput, { validate: true })
    data: CreateMessageInput,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);

    // Vérifie que la conversation existe
    const conversation = await Conversation.findOne({
      where: { id: data.conversationId },
      relations: ["initiator", "participant"],
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
        message: "Vous ne pouvez pas envoyer de message dans cette conversation",
      });
    }

    // Crée le nouveau message et l'enregistre dans la BDD
    const newMessage = Message.create({
      content: data.content,
      author: currentUser,
      conversation: conversation,
    });

    return await newMessage.save();
  }
}
