import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CommentCreateInput {
  @Field(() => Int)
  postId: number;
  @Field()
  text: string;
}

export class CommentCreateDto extends CommentCreateInput {
  profileId: number;
}
