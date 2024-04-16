import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";

@Module({
  providers: [PostsResolver, PostsService, PrismaService, UsersService],
})
export class PostsModule {}
