import { GraphQLError } from "graphql/error";
import {
  Arg,
  GraphQLISODateTime,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Child } from "../entities/Child";
import { Report } from "../entities/Report";

@Resolver()
export default class ReportResolver {
  // afficher tous les reports
  @Query(() => [Report])
  async reports() {
    return Report.find({
      relations: [
        "child",
        "child.parents", // ✅ Corrigé : "parents" au lieu de "representatives"
        "child.group", // ✅ Ajouté : pour accéder à child.group.group_name
      ],
      order: { date: "DESC" },
    });
  }

  // afficher un seul
  @Query(() => Report, { nullable: true })
  async report(@Arg("id", () => Int) id: number) {
    return Report.findOne({
      where: { id },
      relations: [
        "child",
        "child.parents", // ✅ Corrigé
        "child.group", // ✅ Ajouté
      ],
    });
  }

  // créer un report
  @Mutation(() => Report)
  async createReport(
    @Arg("childId", () => Int) childId: number,
    @Arg("isPresent") isPresent: boolean,
    @Arg("date", () => GraphQLISODateTime) date: Date,
    @Arg("staff_comment", { nullable: true }) staff_comment?: string,
    @Arg("baby_mood", { nullable: true }) baby_mood?: string,
    @Arg("picture", { nullable: true }) picture?: string,
  ): Promise<Report> {
    const child = await Child.findOne({
      where: { id: childId },
      // ✅ Pas besoin de relations ici, on a juste besoin de vérifier que l'enfant existe
    });

    if (!child) {
      throw new GraphQLError("Child not found", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    const report = await Report.create({
      child,
      isPresent,
      date, // ✅ Utilise la date passée en paramètre, pas Date.now()
      staff_comment,
      baby_mood,
      picture,
    }).save();

    return report;
  }
}
