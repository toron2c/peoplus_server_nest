import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetCommentsInput {
  @Field(() => Int)
  postId: number;
  @Field(() => Int, { nullable: true })
  skip: number;
}
