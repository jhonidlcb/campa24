import { z } from "zod";
import { insertSupporterSchema, insertActivitySchema, insertNewsSchema, insertProposalSchema, supporters, activities, news, proposals } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  supporters: {
    create: {
      method: "POST" as const,
      path: "/api/supporters" as const,
      input: insertSupporterSchema,
      responses: {
        201: z.custom<typeof supporters.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    count: {
      method: "GET" as const,
      path: "/api/supporters/count" as const,
      responses: {
        200: z.object({ count: z.number() }),
      }
    },
    list: {
      method: "GET" as const,
      path: "/api/supporters" as const,
      responses: {
        200: z.array(z.custom<typeof supporters.$inferSelect>()),
        403: z.string(),
      }
    }
  },
  activities: {
    list: {
      method: "GET" as const,
      path: "/api/activities" as const,
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/activities" as const,
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
        403: z.string(),
      },
    }
  },
  news: {
    list: {
      method: "GET" as const,
      path: "/api/news" as const,
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/news" as const,
      input: insertNewsSchema,
      responses: {
        201: z.custom<typeof news.$inferSelect>(),
        400: errorSchemas.validation,
        403: z.string(),
      },
    }
  },
  proposals: {
    list: {
      method: "GET" as const,
      path: "/api/proposals" as const,
      responses: {
        200: z.array(z.custom<typeof proposals.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/proposals" as const,
      input: insertProposalSchema,
      responses: {
        201: z.custom<typeof proposals.$inferSelect>(),
        400: errorSchemas.validation,
        403: z.string(),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
