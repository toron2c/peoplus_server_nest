import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ProfileDto {
  @Field()
  name: string;

  @Field()
  bio: string;

  @Field()
  birthday: Date;
}
