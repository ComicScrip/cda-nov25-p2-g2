import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Planning } from "../entities/Planning"; 
import { Group } from "../entities/Group";

@Resolver()
export class PlanningResolver {
  
  //  READ 
  @Query(() => [Planning])
  async getAllPlannings(): Promise<Planning[]> {
    return await Planning.find({ relations: ["group"] });
  }

  //  READ 
  @Query(() => Planning, { nullable: true })
  async getPlanningById(@Arg("id", () => Int) id: number): Promise<Planning | null> {
    return await Planning.findOne({ 
      where: { planning_id: id }, 
      relations: ["group"] 
    });
  }
  

  //  CREATE 
  @Mutation(() => Planning)
  async createPlanning(
    @Arg("meal") meal: string,
    @Arg("morning_nap") morning_nap: string,
    @Arg("date") date: Date,
    @Arg("groupId", () => Int) groupId: number
  ): Promise<Planning> {
    
    const group = await Group.findOneBy({ group_id: groupId });
    if (!group) throw new Error("Groupe non trouvé !");

    const newPlanning = Planning.create({
      meal,
      morning_nap,
      afternoon_nap: "", 
      morning_activities: "", 
      afternoon_activities: "", 
      snack: "", 
      date,
      group
    });

    return await newPlanning.save();
  }

  // UPDATE 
  @Mutation(() => Planning, { nullable: true })
  async updatePlanning(
    @Arg("id", () => Int) id: number,
    @Arg("meal", { nullable: true }) meal?: string,
    @Arg("morning_nap", { nullable: true }) morning_nap?: string
  ): Promise<Planning | null> {
    const planning = await Planning.findOneBy({ planning_id: id });
    if (!planning) return null;

    if (meal) planning.meal = meal;
    if (morning_nap) planning.morning_nap = morning_nap;

    return await planning.save();
  }

  //DELETE 
  @Mutation(() => Boolean)
  async deletePlanning(@Arg("id", () => Int) id: number): Promise<boolean> {
    const result = await Planning.delete(id);
    return result.affected !== 0; 
  }
}