import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NewPostInput {
  @Field()
  text: string;
}

export class PostDto extends NewPostInput {
  profileId: number;
}
