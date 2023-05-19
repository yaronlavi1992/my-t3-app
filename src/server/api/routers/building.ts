import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const buildingRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

  createBuilding: protectedProcedure.input(
    z.object({name: z.string(), sections: z.any() })
  ).mutation(async ({input, ctx}) => {
    const building = await ctx.prisma.building.create({
      data: {
        ...input,
        userId: ctx.auth.userId
      }
    })
    return building;
  }),

  getUserBuildingsList: publicProcedure.query(({ctx}) => {
    if(!ctx.auth.userId) {
      return 'no such user';
    }
    return ctx.prisma.building.findMany({
      where: {
        userId: ctx.auth.userId
      }
    })
  }),

  getUserBuildingById: publicProcedure.input(
    z.object({ buildingId: z.string() })
  ).query(({ctx, input}) => {
    return ctx.prisma.building.findUnique({
      where: {
        id: input.buildingId
      }
    })
  }),

  updateUserBuildingById: protectedProcedure.input(
    z.object({ buildingId: z.string(), name: z.string(), sections: z.any() })
  ).mutation(async ({ input, ctx }) => {
    const { buildingId, ...data } = input;
    const building = await ctx.prisma.building.update({
      where: { id: buildingId },
      data: { ...data }
    });
    return building;
  }),
  
  deleteUserBuildingById: protectedProcedure.input(
    z.object({ buildingId: z.string() })
  ).mutation(async ({ input, ctx }) => {
    const { buildingId } = input;
    await ctx.prisma.building.delete({
      where: { id: buildingId }
    });
    return 'Building successfully deleted';
  })
});
