import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Profile } from "./entity/users.entity";
import { UserFields } from "src/auth/auth.entity";
import { User as UserModel } from "@prisma/client";
import { ProfileDto } from "./dto/profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findUserWithEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async findUserWithId(id: string): Promise<UserFields | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        password: false,
        profileId: true,
      },
    });
    return user;
  }

  async getProfile(id: number): Promise<Profile> {
    const profile = await this.getProfileLimit(id);
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  async updateProfile(dto: ProfileDto, userId: string): Promise<Profile> {
    const profile = await this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        name: dto.name,
        bio: dto.name,
        birthday: dto.birthday,
      },
    });
    return await this.getProfileLimit(profile.id);
  }

  private async getProfileLimit(id: number): Promise<Profile> {
    return await this.prisma.profile.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        birthday: true,
        userId: false,
      },
    });
  }
}
