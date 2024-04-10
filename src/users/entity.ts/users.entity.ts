import { Field, Int, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Profile {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  bio: string;

  @Field({ nullable: true })
  birthday: Date | null;
}
