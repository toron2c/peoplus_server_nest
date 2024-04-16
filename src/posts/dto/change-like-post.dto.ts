import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ChangedStateLikeInput {
  @Field(() => Int)
  postId: number;
}

export class ChangeStateLikeDto extends ChangedStateLikeInput {
  profileId: number;
}
