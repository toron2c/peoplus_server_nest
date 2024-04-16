import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { Profile } from "./entity/users.entity";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { User } from "@prisma/client";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ProfileDto } from "./dto/profile.dto";

@Resolver(() => Profile)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => Profile)
  @Auth()
  async getProfile(
    @CurrentUser() data: User,
    @Args("id", { type: () => Int }) id: number,
  ): Promise<Profile | null> {
    console.log(data);
    return this.usersService.getProfile(id);
  }

  @Mutation(() => Profile)
  @Auth()
  async updateProfile(
    @CurrentUser("id") userId: string,
    @Args("ProfileDto") dto: ProfileDto,
  ): Promise<Profile> {
    console.log(dto);
    return await this.usersService.updateProfile(dto, userId);
  }
}
