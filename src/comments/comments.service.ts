import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentCreateDto } from "./dto/comment-create.dto";
import { RemoveCommentDto, UpdateCommentDto } from "./dto/comment-update.dto";
import { Comment } from "@prisma/client";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(data: CommentCreateDto) {
    const post = await this.prisma.comment.create({
      data: {
        authorId: data.profileId,
        postId: data.postId,
        text: data.text,
      },
    });
    return post;
  }

  async getComments(postId: number, skip: number): Promise<Comment[]> {
    const limit = {
      take: -3,
      skip: skip,
    };
    const comments = await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      ...limit,
    });
    return comments;
  }

  async updateComment(data: UpdateCommentDto): Promise<Comment> {
    await this.validateAuthor(data.profileId, data.commentId);
    const comment = await this.prisma.comment.update({
      where: {
        id: data.commentId,
      },
      data: {
        text: data.text,
        edited: true,
      },
    });
    return comment;
  }
  async deleteComment(data: RemoveCommentDto): Promise<number> {
    await this.validateAuthor(data.profileId, data.commentId);
    const comment = await this.prisma.comment.delete({
      where: {
        id: data.commentId,
      },
    });
    return comment.id;
  }

  private async validateAuthor(authorId: number, commentId: number) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      if (!comment) throw new BadRequestException("Comment not found!");
      if (comment.authorId !== authorId)
        throw new UnauthorizedException("Error authorization");
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
