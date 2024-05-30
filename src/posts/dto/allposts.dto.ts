import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@ArgsType()
export class AuthorId {
  @Field(() => Int)
  authorId: number;
}

@InputType()
export class AllPostsDto {
  @Field(() => Int)
  authorId: number;
  @Field(() => Int, { nullable: true })
  page: number;
}
