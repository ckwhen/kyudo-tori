import { db } from "@/shared/database";

export const service = {
  async getFilteredShinsas() {
    return db.query.shinsas.findMany({
      orderBy: (shinsa, { asc }) => [asc(shinsa.start_at)],
    });
  }
};
