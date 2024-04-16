import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import { hash, verify } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { Tokens, User } from "./auth.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async register(dto: AuthDto): Promise<User> {
    const oldUser = await this.users.findUserWithEmail(dto.email);
    if (oldUser) throw new BadRequestException("User already register");
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
      },
    });
    // create profile in db
    const profile = await this.prisma.profile.create({
      data: {
        userId: user.id,
      },
    });
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileId: profile.id,
      },
    });
    const tokens = await this.genTokens(user.id);
    const field = await this.getUserFields(user.id);
    return {
      user: field,
      tokens: tokens,
    };
  }
  async login(dto: AuthDto): Promise<User> {
    const user = await this.users.findUserWithEmail(dto.email);
    if (!user) throw new BadRequestException("User is not registered");
    if (await verify(user.password, dto.password)) {
      const tokens = await this.genTokens(user.id);
      const field = await this.getUserFields(user.id);

      return {
        user: field,
        tokens: tokens,
      };
    } else throw new BadRequestException("Wrong password or email");
  }

  async getNewTokens(refreshToken: string): Promise<User> {
    const res = await this.jwt.verifyAsync(refreshToken);
    if (!res) throw new UnauthorizedException("Invalid refresh token");
    const user = await this.users.findUserWithId(res.id);
    const tokens = await this.genTokens(user.id);
    return {
      user: await this.getUserFields(user.id),
      tokens: tokens,
    };
  }

  // remove func
  async getUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return {
      email: user.email,
      uid: user.id,
    };
  }

  private async genTokens(id: string): Promise<Tokens> {
    const data = { id };
    const accessToken = this.jwt.sign(data, {
      expiresIn: "1h",
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: "3d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  private async getUserFields(id: string) {
    return await this.users.findUserWithId(id);
  }
}
