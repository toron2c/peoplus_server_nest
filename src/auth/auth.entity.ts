import { Field, Int, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Tokens {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}
@ObjectType()
export class UserFields {
  @Field()
  email: string;

  @Field()
  id: string;

  @Field(() => Int)
  profileId: number;
}

@ObjectType()
export class User {
  @Field()
  user: UserFields;
  @Field()
  tokens: Tokens;
}
