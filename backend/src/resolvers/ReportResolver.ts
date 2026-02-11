import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Child } from "../entities/Child";
import { NewReportInput, Report, UpdateReportInput } from "../entities/Report";
import { NotFoundError } from "../errors";

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
    @Arg("data", () => NewReportInput, { validate: true })
    data: NewReportInput
  ): Promise<Report> {
    const child = await Child.findOne({
      where: { id: data.child},
      relations: ["child", "child.representatives"],
    });

    if (!child) {
      throw new NotFoundError()
    }

    const newReport = new Report();
    
    Object.assign(newReport, data);
    newReport.child = child;
    newReport.date = new Date();
    await newReport.save();
    return newReport;
  }

  //  modifier un report
  @Mutation(() => Report)
  async updateReport(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateReportInput, { validate: true }) data: UpdateReportInput
  ): Promise<Report> {
  
    const reportToUpdate = await Report.findOne({
      where: { id },
      relations: ["child", "child.representatives"],
    });
  
    if (!reportToUpdate) throw new NotFoundError();
  
    Object.assign(reportToUpdate, data);
    await reportToUpdate.save();
  
    return reportToUpdate;
  }
}