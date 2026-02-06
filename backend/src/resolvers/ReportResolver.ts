import { GraphQLError } from "graphql/error";
import { Arg, GraphQLISODateTime, Mutation, Query, Resolver } from "type-graphql";
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
        "child.representatives", // parents ou admin ou assistante mat
      ],
      order: { date: "DESC" },
    });
  }

  // afficher un seul
  @Query(() => Report, { nullable: true })
  async report(@Arg("id") id: number) {
    return Report.findOne({
      where: { id },
      relations: ["child", "child.representatives"],
    });
  }

  //   creer un report
  @Mutation(() => Report)
  async createReport(
    @Arg("childId") childId: number,
    @Arg("isPresent") isPresent: boolean,
    @Arg("date", () => GraphQLISODateTime) date: Date,
    @Arg("staff_comment", { nullable: true }) staff_comment?: string,
    @Arg("baby_mood", { nullable: true }) baby_mood?: string,
    @Arg("picture", { nullable: true }) picture?: string,
  ): Promise<Report> {
    const child = await Child.findOne({
      where: { id: childId },
      relations: ["child", "child.represent"],
    });

    if (!child) {
      throw new GraphQLError("child not found", {
        extensions: { code: "NOT_FOUND", http: { status: 404 } },
      });
    }

    const report = await Report.create({
      child,
      isPresent,
      date: new Date(Date.now()),
      staff_comment,
      baby_mood,
      picture,
    }).save();

    return report;
  }
}
