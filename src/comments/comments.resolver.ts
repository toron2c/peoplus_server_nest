import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CommentsService } from "./comments.service";
import { Comment } from "./entity/comment.entity";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CommentCreateDto, CommentCreateInput } from "./dto/comment-create.dto";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { GetCommentsInput } from "./dto/get-comments.dto";
import { RemoveCommentDto, RemoveCommentInput } from "./dto/comment-update.dto";

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}
  @Mutation(() => Comment)
  @Auth()
  async createComment(
    @Args("CreateCommentInput") createCommentInput: CommentCreateInput,
    @CurrentUser("profileId") profileId: number,
  ) {
    const data: CommentCreateDto = {
      profileId,
      postId: createCommentInput.postId,
      text: createCommentInput.text,
    };
    return await this.commentsService.createComment(data);
  }
  @Query(() => [Comment])
  @Auth()
  async getComments(
    @Args("GetCommentsInput") getCommentsInput: GetCommentsInput,
  ): Promise<Comment[]> {
    const skip = getCommentsInput.skip ? getCommentsInput.skip : 0;
    return await this.commentsService.getComments(
      getCommentsInput.postId,
      skip,
    );
  }
  @Mutation(() => Int)
  @Auth()
  async removeComment(
    @Args("RemoveCommentInput") removeCommentInput: RemoveCommentInput,
    @CurrentUser("profileId") profileId: number,
  ) {
    const data: RemoveCommentDto = {
      profileId,
      commentId: removeCommentInput.commentId,
    };
    return await this.commentsService.deleteComment(data);
  }
}
