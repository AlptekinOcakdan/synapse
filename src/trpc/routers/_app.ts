import {usersRouter} from "@/modules/users/server/procedures";
import {createTRPCRouter} from '../init';

export const appRouter = createTRPCRouter({
    users: usersRouter,
});

export type AppRouter = typeof appRouter;