import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { NotFoundError } from "../errors"; // Ajuste le chemin

@InputType()
class PlanningInput {
  @Field()
  meal: string;

  @Field()
  morning_nap: string;

  @Field()
  afternoon_nap: string;

  @Field()
  date: Date;

  @Field(() => Int)
  groupId: number;
}

@InputType()
class UpdatePlanningInput {
  @Field({ nullable: true })
  meal?: string;

  @Field({ nullable: true })
  morning_nap?: string;

  @Field({ nullable: true })
  afternoon_nap?: string;

  @Field({ nullable: true })
  date?: Date;
}

@Resolver()
export class PlanningResolver {
  // READ
  @Query(() => [Planning])
  async getAllPlannings(): Promise<Planning[]> {
    return await Planning.find({ relations: ["group"] });
  }

  @Query(() => Planning)
  async getPlanningById(@Arg("id", () => Int) id: number): Promise<Planning> {
    const planning = await Planning.findOne({
      where: { id: id },
      relations: ["group"],
    });

    if (!planning) throw new NotFoundError();
    return planning;
  }

  // CREATE
  @Mutation(() => Planning)
  async createPlanning(@Arg("data") data: PlanningInput): Promise<Planning> {
    const group = await Group.findOneBy({ id: data.groupId });

    if (!group) {
      throw new NotFoundError({ message: "Group not found for this planning" });
    }

    const newPlanning = Planning.create({
      ...data,
      group: group,
    });

    return await newPlanning.save();
  }

  // UPDATE
  @Mutation(() => Planning)
  async updatePlanning(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdatePlanningInput,
  ): Promise<Planning> {
    const planning = await Planning.findOneBy({ id: id });

    if (!planning) {
      throw new NotFoundError({ message: "Planning not found" });
    }

    // Utilisation de Object.assign (en filtrant les undefined)
    const updates = JSON.parse(JSON.stringify(data));
    Object.assign(planning, updates);

    return await planning.save();
  }

  // DELETE
  @Mutation(() => Boolean)
  async deletePlanning(@Arg("id", () => Int) id: number): Promise<boolean> {
    const result = await Planning.delete(id);

    if (result.affected === 0) {
      throw new NotFoundError({ message: "Planning to delete not found" });
    }

    return true;
  }
}
