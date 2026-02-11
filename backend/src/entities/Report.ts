import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsUrl,
  Length,
} from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  ObjectId,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Child } from "./Child";

@ObjectType()
@Entity()
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "boolean" })
  isPresent: boolean;

  @Field()
  @Column()
  date: Date;

  @Field({nullable : true})
  @Column({ nullable: true })
  staff_comment: string;

  @Field({nullable : true})
  @Column({ nullable: true })
  baby_mood: string;

  @Field()
  @Column({ nullable: true })
  picture: string;

  @Field(() => Child)
  @ManyToOne(
    () => Child,
    (child) => child.reports,
  )
  child: Child;
}

@InputType()
export class NewReportInput {
  @Field(() => Boolean)
  @IsBoolean({ message: "La présence doit être un booléen" })
  isPresent: boolean;

  @Field()
  @IsISO8601({}, { message: "La date est  de format incorrect" })
  date: Date;

  @Field({nullable : true})
  @Length(2, 150, { message: "Le nom doit contenir entre 2 et 150 caractères" })
  staff_comment: string;

  @Field({nullable : true})
  baby_mood: string;

  @Field({nullable : true})
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture: string;

  @Field(() => Int)
  @IsInt({ message: "L'id de l'enfant doit être un nombre" })
  child: number;
}

@InputType()
export class UpdateReportInput {
  @Field(() => Boolean)
  @IsBoolean({ message: "La présence doit être un booléen" })
  isPresent?: boolean;

  @Field()
  @IsISO8601({}, { message: "La date est  de format incorrect" })
  date?: Date;

  @Field({nullable : true})
  @Length(2, 150, { message: "Le nom doit contenir entre 2 et 150 caractères" })
  staff_comment?: string;

  @Field({nullable : true})
  baby_mood?: string;

  @Field({nullable : true})
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture?: string;

  @Field(() => Int)
  @IsInt({ message: "L'id de l'enfant doit être un nombre" })
  child: number;
}
