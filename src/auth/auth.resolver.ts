import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { User } from "./auth.entity";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@Resolver(of => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => User)
  @UsePipes(new ValidationPipe())
  async registration(@Args("AuthDto") dto: AuthDto): Promise<User> {
    return this.authService.register(dto);
  }
  @Query(returns => User)
  async getUid(@Args("email") email: string) {
    return this.authService.getUser(email);
  }
  @Mutation(returns => User)
  @UsePipes(new ValidationPipe())
  async login(@Args("AuthDto") dto: AuthDto): Promise<User> {
    return this.authService.login(dto);
  }
}
