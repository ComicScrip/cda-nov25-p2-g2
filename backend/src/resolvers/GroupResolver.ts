import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { NotFoundError } from "../errors"; 

@Resolver()
export class GroupResolver {
  
  // READ
  @Query(() => [Group])
  async getAllGroups(
    @Arg("take", () => Int, { defaultValue: 10 }) take: number,
    @Arg("skip", () => Int, { defaultValue: 0 }) skip: number
  ): Promise<Group[]> {
    return await Group.find({ 
      relations: ["plannings", "children"],
      take,
      skip 
    });
  }

  @Query(() => Group, { nullable: true })
  async getGroupById(@Arg("group_id", () => Int) id: number): Promise<Group | null> {
    const group = await Group.findOne({ 
      where: { group_id: id }, 
      relations: ["plannings", "children"] 
    });

    if (!group) throw new NotFoundError();
    return group;
  }

  // CREATE
  @Mutation(() => Group)
  async createGroup(
    @Arg("group_name") group_name: string,
    @Arg("capacity_group", () => Int) capacity_group: number,
    @Arg("parent_id", () => Int, { nullable: true }) parentId?: number
  ): Promise<Group> {
    const newGroup = Group.create({
      group_name,
      capacity_group,
    });

    if (parentId) {
      const parent = await Group.findOneBy({ group_id: parentId });
      if (parent) newGroup.parent = parent;
    }

    return await newGroup.save(); 
  }

  // UPDATE
  @Mutation(() => Group)
  async updateGroup(
    @Arg("group_id", () => Int) id: number,
    @Arg("group_name", { nullable: true }) group_name?: string,
    @Arg("capacity_group", { nullable: true }) capacity_group?: number
  ): Promise<Group> {
    const group = await Group.findOneBy({ group_id: id });
    
    if (!group) {
        throw new NotFoundError({ message: "Group not found" });
    }

    Object.assign(group, JSON.parse(JSON.stringify({ group_name, capacity_group })));

    return await group.save();
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteGroup(@Arg("group_id", () => Int) id: number): Promise<boolean> {
    const result = await Group.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundError({ message: "Group to delete not found" });
    }
    
    return true;
  }
}