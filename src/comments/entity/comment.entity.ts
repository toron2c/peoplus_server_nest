import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;
  @Field()
  createdAt: Date;
  @Field()
  edited: boolean;
  @Field()
  updatedAt: Date;
  @Field()
  text: string;
  @Field(() => Int)
  authorId: number;
}
