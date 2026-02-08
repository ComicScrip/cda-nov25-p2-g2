import { IsEmail, IsStrongPassword, Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Child } from "./Child";

export const UserRole = {
  Admin: "admin",
  Staff: "staff",
  Parent: "parent",
} as const;

export type Role = (typeof UserRole)[keyof typeof UserRole];

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Field()
  @Column({ type: "varchar", length: 50 })
  first_name!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  last_name!: string;

  @Field()
  @Column({ type: "varchar", length: 50 })
  phone: string;

  @Column({ name: "password", type: "text" })
  hashedPassword: string;

  @Field()
  @CreateDateColumn()
  creation_date: Date;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  avatar: string;

  @Field()
  @Column({ type: "varchar", length: 50, default: UserRole.Parent })
  role: Role;

  // group_id devient nullable pour permettre aux parents d'avoir plusieurs enfants dans différents groupes
  // Les staff ont un group_id obligatoire, les parents héritent des groupes de leurs enfants
  @Field(() => Int, { nullable: true })
  @Column({ type: "int", name: "group_id", nullable: true })
  group_id: number | null;

  // Relation ManyToMany inverse : un User (parent) peut avoir plusieurs enfants
  @Field(() => [Child], { nullable: true })
  @ManyToMany(
    () => Child,
    (child) => child.parents,
  )
  @JoinTable({
    name: "user_children",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "child_id", referencedColumnName: "id" },
  })
  children: Child[];
}

// Admin crée les comptes avec mdp temporaire
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field()
  @Length(2, 50, {
    message: "Le prénom doit contenir entre 2 et 50 caractères",
  })
  first_name: string;

  @Field()
  @Length(2, 100, { message: "Le nom doit contenir entre 2 et 100 caractères" })
  last_name: string;

  @Field()
  phone: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  password: string;

  @Field()
  role: Role; // parent / staff

  // ✅ group_id devient optionnel dans les inputs
  @Field(() => Int, { nullable: true })
  group_id?: number;
}
// Tout le monde peut se connecter et changer son mdp
@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  password: string;
}
// L'utilisateur peut changer son mot passe ensuite
@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword!: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le nouveau mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  newPassword!: string;
}
// Mise à jour des informations de l'utilisateur, les champs tous nullable sauf id car sinon on oblige l'admin à tout resaisir pour faire une modification
@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field({ nullable: true })
  @Length(2, 50)
  first_name: string;

  @Field({ nullable: true })
  @Length(2, 100)
  last_name: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  role: Role;

  @Field(() => Int, { nullable: true })
  group_id: number;
}
