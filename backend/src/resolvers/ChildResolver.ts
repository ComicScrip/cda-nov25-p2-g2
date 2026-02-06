import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Child, NewChildInput, UpdateChildInput } from "../entities/Child";
import { GraphQLError } from "graphql/error";

@Resolver()
export default class ChildResolver {
  
  @Query(() => [Child])
  async children() {
    return await Child.find();
  }

  @Query(() => Child)
  async child(@Arg("id", () => Int) id: number) {
    const child =  await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"]
    });

    if(!child) {
      throw new GraphQLError("Child not found", {
        extensions : { code: "NOT_FOUND", http: { status: 404 } }
      });
    }
    return child;
  }

  @Mutation(() => Child)
  async createChild( @Arg("data", () => NewChildInput, { validate: true }) data: NewChildInput) {
    const newChild = new Child();
    
    Object.assign(newChild, data);
    const { id } = await newChild.save();
    return Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"]
    });
  }

  @Mutation(() => Child)
  async updateAd(@Arg("id", () => Int) id: number, @Arg("data", () => UpdateChildInput, { validate: true }) data: UpdateChildInput) {
    const childToUpdate = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"]
    });
    if (!childToUpdate)
      throw new GraphQLError("Child not found", { extensions: { code: "NOT_FOUND", http: { status: 404 } }});

    Object.assign(childToUpdate, data);
    await childToUpdate.save();
    return await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"]
    });
  }

  @Mutation(() => String)
  async deleteChild(
    @Arg("id", () => Int) id: number) {
    const childToDelete = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"]
    });

    if (!childToDelete)
      throw new GraphQLError("Child not found", { extensions: { code: "NOT_FOUND", http: { status: 404 } }
      });

    await childToDelete.remove();
    return "Child has been deleted correctly !";
  }
}
