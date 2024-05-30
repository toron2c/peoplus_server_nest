import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RemovePostInput {
  @Field(() => Int)
  postId: number;
}

export class RemovePostDto extends RemovePostInput {
  userId: string;
}
