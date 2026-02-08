import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Group } from "../entities/Group";

@Resolver()
export class GroupResolver {
  //  READ
  @Query(() => [Group])
  async getAllGroups(): Promise<Group[]> {
    return await Group.find({
      relations: ["plannings", "children"], // ✅ Ajout de "children"
    });
  }

  // READ
  @Query(() => Group, { nullable: true })
  async getGroupById(
    @Arg("group_id", () => Int) id: number,
  ): Promise<Group | null> {
    return await Group.findOne({
      where: { group_id: id },
      relations: ["plannings", "children"], // ✅ Ajout de "children"
    });
  }

  // CREATE
  @Mutation(() => Group)
  async createGroup(
    @Arg("group_name") group_name: string,
    @Arg("capacity_group", () => Int) capacity_group: number,
  ): Promise<Group> {
    const newGroup = Group.create({
      group_name,
      capacity_group,
    });

    return await newGroup.save();
  }

  // UPDATE
  @Mutation(() => Group, { nullable: true })
  async updateGroup(
    @Arg("group_id", () => Int) id: number,
    @Arg("group_name", { nullable: true }) group_name?: string,
    @Arg("capacity_group", { nullable: true }) capacity_group?: number,
  ): Promise<Group | null> {
    const group = await Group.findOneBy({ group_id: id });
    if (!group) return null;

    if (group_name) group.group_name = group_name;
    if (capacity_group !== undefined) group.capacity_group = capacity_group;

    return await group.save();
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteGroup(@Arg("group_id", () => Int) id: number): Promise<boolean> {
    const result = await Group.delete(id);
    return result.affected !== 0;
  }
}
