import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Post } from "./entity/posts.entity";
import { PostDto } from "./dto/create-post.dto";
import { AllPostsDto } from "./dto/allposts.dto";
import { UsersService } from "src/users/users.service";
import { UpdatePostDto } from "./dto/update-post.dto";
import { RemovePostDto } from "./dto/remove-post.dto";
import { ChangeStateLikeDto } from "./dto/change-like-post.dto";
import { CommentsService } from "src/comments/comments.service";

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly comments: CommentsService,
  ) {}

  /**
   * func create post
   * @param data {authorId: number, text: string}
   * @returns Post
   */
  async createPost(data: PostDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        authorId: data.profileId,
        text: data.text,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return post;
  }

  /**
   * func get limited posts
   * @param data {authorId: number, page?: number }
   * @returns post[]
   */
  async getPosts(data: AllPostsDto) {
    const count: number = 10;
    const limit = {
      take: count,
      skip: data.page ? data.page * count : 0,
    };
    const posts = await this.getAllPosts(data.authorId, limit);
    return posts;
  }

  /**
   * func get count posts
   * @param profileId author id
   * @returns count posts
   */
  async getCountPosts(profileId: number): Promise<number> {
    const count = await this.prisma.post.count({
      where: {
        authorId: profileId,
      },
    });
    return count ? count : 0;
  }

  /**
   * func update text post
   * @param data updatePostDto {post id, user id, new Text}
   * @returns updated post
   */
  async editPost(data: UpdatePostDto): Promise<Post> {
    await this.validateAuthor(data.postId, data.userId);
    const post = this.prisma.post.update({
      where: {
        id: data.postId,
      },
      data: {
        text: data.text,
        edited: true,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return post;
  }
  /**
   * func delete post
   * @param data post id user id
   */
  async removePost(data: RemovePostDto) {
    await this.validateAuthor(data.postId, data.userId);
    const post = await this.prisma.post.delete({
      where: {
        id: data.postId,
      },
    });
    return post.id;
  }

  async changeLikesPost(data: ChangeStateLikeDto) {
    const like = await this.prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: data.profileId,
          postId: data.postId,
        },
      },
    });
    if (like) {
      await this.prisma.likes.delete({
        where: {
          userId_postId: {
            userId: data.profileId,
            postId: data.postId,
          },
        },
      });
      return 0;
    } else {
      await this.prisma.likes.create({
        data: {
          userId: data.profileId,
          postId: data.postId,
        },
      });
      return 1;
    }
  }
  //maybe enough func with get likes
  async getCountLikes(postId: number) {
    const likes = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: true,
      },
    });
    return likes?.likes?.length ? likes.likes.length : 0;
  }

  /**
   * private func get all posts
   * @param profileId id author posts
   * @param limit limit get posts
   * @returns post[]
   */
  private async getAllPosts(
    profileId: number,
    limit?: { take: number; skip: number },
  ): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: profileId,
      },
      ...limit,
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return posts;
  }
  /**
   * private func validate author post and user id. if the data does not match,
   *  issue a new error
   * @param postId number
   * @param userId string
   */
  private async validateAuthor(postId: number, userId: string) {
    try {
      const user = await this.users.findUserWithId(userId);
      const post = await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) throw new BadRequestException("Post not found!");
      if (post.authorId !== user.profileId) {
        throw new UnauthorizedException("Error authorization");
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
