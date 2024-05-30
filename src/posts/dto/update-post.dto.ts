import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  postId: number;
  @Field()
  text: string;
}

export class UpdatePostDto extends UpdatePostInput {
  userId: string;
}
