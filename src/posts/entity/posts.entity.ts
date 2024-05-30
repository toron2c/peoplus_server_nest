import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostId {
  @Field(() => Int)
  id: number;
}
@ObjectType()
export class _count {
  @Field(() => Int)
  likes: number;
}

@ObjectType()
export class Post extends PostId {
  @Field()
  createdAt: Date;
  @Field()
  edited: boolean;

  @Field({ nullable: true })
  updatedAt: Date | null;

  @Field()
  text: string;

  @Field(() => Int)
  authorId: number;
  @Field()
  _count: _count;
}

@ObjectType()
export class CountPosts {
  @Field(() => Int)
  count: number;
}
