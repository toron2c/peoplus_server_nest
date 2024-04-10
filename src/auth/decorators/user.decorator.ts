import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "@prisma/client";
export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req;
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
