/// <reference types="vite/client" />

import { JSX } from "react/jsx-runtime";

export type Child = {
    firstName: string;
    lastName: string;
    birthDate: number;
    picture: string;
    healthRecord: string;
    group: Group;
    parents: User[];
    onClick: () => void;
};

export type User = {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    hashedPassword: string;
    creation_date: Date;
    avatar: string;
    role: Role;
    group: Group[];
    children: Child[];
  }

