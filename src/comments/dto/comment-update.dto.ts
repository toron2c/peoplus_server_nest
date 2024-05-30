import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RemoveCommentInput {
  @Field(() => Int)
  commentId: number;
}

export class RemoveCommentDto extends RemoveCommentInput {
  profileId: number;
}

export class UpdateCommentDto extends RemoveCommentDto {
  text: string;
}
