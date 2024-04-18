import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { CountPosts, Post } from "./entity/posts.entity";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { AllPostsDto } from "./dto/allposts.dto";
import { UpdatePostInput } from "./dto/update-post.dto";
import { RemovePostDto, RemovePostInput } from "./dto/remove-post.dto";
import {
  ChangeStateLikeDto,
  ChangedStateLikeInput,
} from "./dto/change-like-post.dto";

@Resolver(() => [Post])
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @Mutation(() => Post)
  @Auth()
  async createPost(
    @CurrentUser("profileId") profileId: number,
    @Args("NewPostInput") value: string,
  ): Promise<Post> {
    const data = { text: value, profileId };
    return await this.postsService.createPost(data);
  }

  @Query(() => [Post])
  @Auth()
  async getPosts(@Args("AllPostsDto") data: AllPostsDto): Promise<Post[]> {
    return await this.postsService.getPosts(data);
  }

  @Query(() => CountPosts)
  @Auth()
  async getCountPosts(@Args("AuthorId") authorId: number): Promise<number> {
    return await this.postsService.getCountPosts(authorId);
  }
  @Mutation(() => Post)
  @Auth()
  async updatePost(
    @CurrentUser("id") userId: string,
    @Args("UpdatePostDto") dto: UpdatePostInput,
  ): Promise<Post> {
    const data = {
      ...dto,
      userId,
    };
    return await this.postsService.editPost(data);
  }

  @Mutation(() => Int)
  @Auth()
  async removePost(
    @CurrentUser("id") userId: string,
    @Args("RemovePostInput") dto: RemovePostInput,
  ) {
    const data: RemovePostDto = {
      userId: userId,
      ...dto,
    };
    return await this.postsService.removePost(data);
  }

  @Mutation(() => Int)
  @Auth()
  async changeStatePostLikes(
    @Args("ChangedStateLikeInput") postId: ChangedStateLikeInput,
    @CurrentUser("profileId") profileId: number,
  ) {
    const data: ChangeStateLikeDto = {
      profileId,
      ...postId,
    };
    return await this.postsService.changeLikesPost(data);
  }
  @Query(() => Int)
  @Auth()
  async getLikes(@Args({ name: "postId", type: () => Int }) postId: number) {
    return await this.postsService.getCountLikes(postId);
  }
}
