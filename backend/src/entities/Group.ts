import { Field, ID, ObjectType, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

import { Planning } from "./Planning"; 

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  group_id: number;

  @Field()
  @Column({ type: "varchar", length: 100 })
  group_name: string;

  @Field(() => Int)
  @Column({ type: "int" })
  capacity_group: number;

  // Un groupe peut avoir plusieurs plannings
  @Field(() => [Planning], { nullable: true })
  @OneToMany(() => Planning, (planning) => planning.group)
  plannings: Planning[];
    planning: any;
}