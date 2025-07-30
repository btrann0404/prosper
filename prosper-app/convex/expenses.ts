import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const EXPENSES_TABLE = "expenses" as const;

interface ExpenseDocument {
  _id: any;
  _creationTime: number;
  userId: string;
  amount: number;
  category: string;
  date: string;
  place: string;
  createdAt: number;
}

//list of all expenses
export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty list if not authenticated
    }

    const userId = identity.subject;

    // @ts-ignore - Using type assertions and ts-ignore to bypass TypeScript errors
    const allTables = await ctx.db.query(EXPENSES_TABLE).collect();

    // Add type assertion to tell TypeScript about the structure
    return (allTables as unknown as ExpenseDocument[])
      .filter((expense) => expense.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt); // Sort in descending order by createdAt
  },
});

// to add expense
export const add = mutation({
  args: {
    amount: v.number(),
    category: v.string(),
    date: v.string(),
    place: v.string(),
    // Don't include createdAt in args validation since you're setting it server-side
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // @ts-ignore - Using ts-ignore to bypass TypeScript errors
    return await ctx.db.insert(EXPENSES_TABLE, {
      amount: args.amount,
      category: args.category,
      date: args.date,
      place: args.place,
      userId: identity.subject,
      createdAt: Date.now(), // Set createdAt here, not from args
    });
  },
});
