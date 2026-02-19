// @ts-nocheck
import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type AdminCounts = {
  __typename?: 'AdminCounts';
  childrenCount: Scalars['Int']['output'];
  parentCount: Scalars['Int']['output'];
  staffCount: Scalars['Int']['output'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Child = {
  __typename?: 'Child';
  birthDate: Scalars['DateTimeISO']['output'];
  firstName: Scalars['String']['output'];
  group: Group;
  healthRecord?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  parents: Array<User>;
  picture: Scalars['String']['output'];
  reports: Array<Report>;
};

export type Conversation = {
  __typename?: 'Conversation';
  creationDate: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  initiator: User;
  messages: Array<Message>;
  participant: User;
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Int']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  group_id?: InputMaybe<Scalars['Int']['input']>;
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  capacity: Scalars['Int']['output'];
  children?: Maybe<Array<Child>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plannings?: Maybe<Array<Planning>>;
  staff: Array<User>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  author: User;
  content: Scalars['String']['output'];
  conversation: Conversation;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
  createChild: Child;
  createConversation: Conversation;
  createGroup: Group;
  createMessage: Message;
  createPlanning: Planning;
  createReport: Report;
  createUser: User;
  deleteChild: Scalars['String']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deletePlanning: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: Scalars['String']['output'];
  logout: Scalars['Boolean']['output'];
  updateAd: Child;
  updateGroup: Group;
  updatePlanning: Planning;
  updateReport: Report;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCreateChildArgs = {
  data: NewChildInput;
};


export type MutationCreateConversationArgs = {
  participantId: Scalars['Int']['input'];
};


export type MutationCreateGroupArgs = {
  capacity: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateMessageArgs = {
  data: CreateMessageInput;
};


export type MutationCreatePlanningArgs = {
  data: PlanningInput;
};


export type MutationCreateReportArgs = {
  data: NewReportInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteChildArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteGroupArgs = {
  group_id: Scalars['Int']['input'];
};


export type MutationDeletePlanningArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationUpdateAdArgs = {
  data: UpdateChildInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateGroupArgs = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePlanningArgs = {
  data: UpdatePlanningInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateReportArgs = {
  data: UpdateReportInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewChildInput = {
  birthDate: Scalars['DateTimeISO']['input'];
  firstName: Scalars['String']['input'];
  group: ObjectId;
  healthRecord?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  parents: Array<ObjectId>;
  picture: Scalars['String']['input'];
};

export type NewReportInput = {
  baby_mood: Scalars['String']['input'];
  child?: InputMaybe<ObjectId>;
  date: Scalars['DateTimeISO']['input'];
  isPresent: Scalars['Boolean']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  staff_comment?: InputMaybe<Scalars['String']['input']>;
};

export type ObjectId = {
  id: Scalars['Int']['input'];
};

export type Planning = {
  __typename?: 'Planning';
  afternoon_activities?: Maybe<Scalars['String']['output']>;
  afternoon_nap?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTimeISO']['output'];
  group: Group;
  id: Scalars['ID']['output'];
  meal?: Maybe<Scalars['String']['output']>;
  morning_activities?: Maybe<Scalars['String']['output']>;
  morning_nap?: Maybe<Scalars['String']['output']>;
  snack?: Maybe<Scalars['String']['output']>;
};

export type PlanningInput = {
  afternoon_nap: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  groupId: Scalars['Int']['input'];
  meal: Scalars['String']['input'];
  morning_nap: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminCounts: AdminCounts;
  child: Child;
  children: Array<Child>;
  conversation?: Maybe<Conversation>;
  getAllGroups: Array<Group>;
  getAllPlannings: Array<Planning>;
  getGroupById?: Maybe<Group>;
  getPlanningById: Planning;
  me?: Maybe<User>;
  messagesFromConversation: Array<Message>;
  myConversations: Array<Conversation>;
  report?: Maybe<Report>;
  reports: Array<Report>;
  users: Array<User>;
};


export type QueryChildArgs = {
  id: Scalars['Int']['input'];
};


export type QueryConversationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetAllGroupsArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryGetGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetPlanningByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMessagesFromConversationArgs = {
  conversationId: Scalars['Int']['input'];
};


export type QueryReportArgs = {
  id: Scalars['Float']['input'];
};

export type Report = {
  __typename?: 'Report';
  baby_mood: Scalars['String']['output'];
  child: Child;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  isPresent: Scalars['Boolean']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  staff_comment?: Maybe<Scalars['String']['output']>;
};

export type UpdateChildInput = {
  birthDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<ObjectId>;
  healthRecord?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  parents?: InputMaybe<Array<ObjectId>>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlanningInput = {
  afternoon_nap?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTimeISO']['input']>;
  meal?: InputMaybe<Scalars['String']['input']>;
  morning_nap?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReportInput = {
  baby_mood: Scalars['String']['input'];
  child?: InputMaybe<ObjectId>;
  date: Scalars['DateTimeISO']['input'];
  isPresent: Scalars['Boolean']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  staff_comment?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Child>>;
  creation_date: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  group?: Maybe<Group>;
  id: Scalars['Int']['output'];
  last_name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type AdminCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminCountsQuery = { __typename?: 'Query', adminCounts: { __typename?: 'AdminCounts', childrenCount: number, staffCount: number, parentCount: number } };

export type ChangePasswordMutationVariables = Exact<{
  data: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, first_name: string, last_name: string, avatar?: string | null, creation_date: any, email: string, phone: string, role: string, children?: Array<{ __typename?: 'Child', id: number }> | null, group?: { __typename?: 'Group', id: string, name: string, children?: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, picture: string }> | null } | null } | null };

export type UpdateProfileMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, first_name: string, last_name: string, phone: string, avatar?: string | null } };


export const AdminCountsDocument = gql`
    query AdminCounts {
  adminCounts {
    childrenCount
    staffCount
    parentCount
  }
}
    `;

/**
 * __useAdminCountsQuery__
 *
 * To run a query within a React component, call `useAdminCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminCountsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
      }
export function useAdminCountsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
        }
export function useAdminCountsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
        }
export type AdminCountsQueryHookResult = ReturnType<typeof useAdminCountsQuery>;
export type AdminCountsLazyQueryHookResult = ReturnType<typeof useAdminCountsLazyQuery>;
export type AdminCountsSuspenseQueryHookResult = ReturnType<typeof useAdminCountsSuspenseQuery>;
export type AdminCountsQueryResult = ApolloReactCommon.QueryResult<AdminCountsQuery, AdminCountsQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data)
}
    `;
export type ChangePasswordMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = ApolloReactCommon.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data)
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ProfileDocument = gql`
    query Profile {
  me {
    id
    role
    first_name
    last_name
    avatar
    creation_date
    email
    phone
    role
    children {
      id
    }
    group {
      id
      name
      children {
        id
        firstName
        lastName
        picture
      }
    }
    avatar
    group {
      id
      name
    }
  }
}
    `;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export function useProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = ApolloReactCommon.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($data: UpdateUserInput!) {
  updateUser(data: $data) {
    id
    first_name
    last_name
    phone
    avatar
  }
}
    `;
export type UpdateProfileMutationFn = ApolloReactCommon.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = ApolloReactCommon.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
