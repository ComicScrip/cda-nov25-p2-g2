import { IsNotEmpty } from "class-validator";
import { GraphQLError } from "graphql";
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
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import type { GraphQLContext } from "../types";

@InputType()
// La création d'un nouveau message implique la création de la classe CreateMessageInput : c'est ce que fait @InputType en regroupant content et conversationId
export class CreateMessageInput {
  @Field()
  @IsNotEmpty({ message: "Le contenu ne peut pas être vide" }) // décorateur qui vient de la bibliothèque "class-validator" et qui veut dire "ce champ ne doit pas être vide"
  content: string;

  @Field(() => Int)
  conversationId: number;
}

@Resolver()
export default class MessageResolver {
  // On retourne un tableau de messages en prenant l'id des conversations en paramètres
  @Query(() => [Message])
  async messagesFromConversation(
    @Arg("conversationId", () => Int) conversationId: number,
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
      where: { id: conversationId },
      relations: ["initiator", "participant"],
    });

    if (!conversation) {
      throw new GraphQLError("Conversation introuvable", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    // Vérifie que l'utilisateur fait partie de la conversation
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new GraphQLError("Vous n'avez pas accès à cette conversation", {
        extensions: { code: "FORBIDDEN", http: { status: 403 } },
      });
    }

    // Récupère tous les messages de la conversation du plus ancien auplus récent
    const messages = await Message.find({
      where: { conversation: { id: conversationId } },
      relations: ["author", "conversation"],
      order: { date: "ASC" },
    });

    return messages;
  }
  // On retourne un message qui prend la data de type CreateMessageInput - voir @InputType au début
  @Mutation(() => Message)
  async createMessage(
    @Arg("data", () => CreateMessageInput, { validate: true }) // option de "data" qui va vérifier les décorateurs de validation de CreateMessageInput - si content = "" (vide), message ligne 22 et non exécution de createMessage
    data: CreateMessageInput,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);
    if (!currentUser) {
      throw new GraphQLError("Vous devez être connecté", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }

    // Vérifie que la conversation existe sinon il ne peut pas y avoir de message
    const conversation = await Conversation.findOne({
      where: { id: data.conversationId },
      relations: ["initiator", "participant"],
    });

    if (!conversation) {
      throw new GraphQLError("Conversation introuvable", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    // Vérifie que l'utilisateur fait bien partie de la conversation car on ne peut pas envoyer de message si on ne fait pas partie de la conversation
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new GraphQLError(
        "Vous ne pouvez pas envoyer de message dans cette conversation",
        {
          extensions: { code: "FORBIDDEN", http: { status: 403 } },
        },
      );
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
