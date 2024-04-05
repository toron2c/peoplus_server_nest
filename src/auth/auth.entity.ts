import { Field, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Tokens {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}

@ObjectType()
export class User {
  @Field()
  email: string;
  @Field()
  id: string;
  @Field()
  tokens: Tokens;
}
