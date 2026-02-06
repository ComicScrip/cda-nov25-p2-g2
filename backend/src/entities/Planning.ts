import { Field, ID, ObjectType } from "type-graphql";
import { 
    BaseEntity, 
    Column, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";

import { Group } from "./Group";

@ObjectType()
@Entity()
export class Planning extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  planning_id: number;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  meal: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  morning_nap: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  afternoon_nap: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  morning_activities: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  afternoon_activities: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  snack: string;

  @Field()
  @Column({ type: "datetime" })
  date: Date;

  @Field(() => Group)
  @ManyToOne(
    () => Group,
    (group) => group.planning,
    { onDelete: "CASCADE" }
  )
  group: Group;
}