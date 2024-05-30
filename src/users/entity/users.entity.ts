import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/entity/posts.entity";
@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  bio: string;

  @Field({ nullable: true })
  birthday: Date | null;
}

// export class ProfileWithPosts extends Profile {
//   @Field(() => [Post])
//   posts: Post[];
// }
