import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostId {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class Post extends PostId {
  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date | null;

  @Field()
  text: string;

  // array with comments or number comments
}

@ObjectType()
export class CountPosts {
  @Field(() => Int)
  count: number;
}
