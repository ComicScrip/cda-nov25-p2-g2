import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";


@ObjectType()
@Entity()
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({type: "boolean"})
  isPresent: boolean;

  @Field()
  @Column()
  date: Date;
  
  @Field()
  @Column({nullable: true})
  staff_comment: string;

  @Field()
  @Column({nullable: true})
  baby_mood: string;

  @Field()
  @Column({nullable: true})
  picture: string;

  @Field(() => Child)
	@ManyToOne(
		() => Child,
		(child) => child.reports,
	)
	child: Child;

}