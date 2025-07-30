import { AddExpenseForm } from "@/components/expense/addexpenseform";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Calendar, DollarSign, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Content() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [expenses, setExpenses] = useState(mockExpenses);
  const expenses = useQuery(api.expenses.list) || [];
  const addExpense = useMutation(api.expenses.add);

  // Calculate stats
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentDate = new Date();
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    );
  });
  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // Prepare chart data
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({
          category:
            expense.category.charAt(0).toUpperCase() +
            expense.category.slice(1),
          amount: expense.amount,
        });
      }
      return acc;
    },
    [] as { category: string; amount: number }[],
  );

  // Prepare daily spending data (last 7 days)
  const dailyData = expenses
    .reduce(
      (acc, expense) => {
        const date = new Date(expense.date);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const existing = acc.find((item) => item.date === dateStr);
        if (existing) {
          existing.amount += expense.amount;
        } else {
          acc.push({ date: dateStr, amount: expense.amount });
        }
        return acc;
      },
      [] as { date: string; amount: number }[],
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddExpense = (newExpense: any) => {
    addExpense({
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
      place: newExpense.place,
      // DO NOT include createdAt or any other fields not in the validator
    });
    setIsDialogOpen(false);
  };

  // Black and white color palette for charts
  const bwColors = [
    "#000000",
    "#404040",
    "#808080",
    "#A0A0A0",
    "#C0C0C0",
    "#E0E0E0",
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-black dark:text-white">
          Welcome back
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your spending with clarity and purpose
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Total Spent
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-black dark:text-white">
              ${totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-black dark:text-white">
              ${thisMonthTotal.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-black dark:text-white">
              {expenses.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Spending Chart */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-black dark:text-white">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={bwColors[index % bwColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-3 rounded-lg shadow-lg">
                              <p className="font-medium text-black dark:text-white">
                                {data.category}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                ${data.amount.toFixed(2)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.map((entry, index) => (
                  <div
                    key={`${entry.category}-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: bwColors[index % bwColors.length],
                      }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.category}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Spending Chart */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-black dark:text-white">
                Daily Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-3 rounded-lg shadow-lg">
                              <p className="font-medium text-black dark:text-white">
                                {label}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                ${payload[0].value?.toFixed(2)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#000000"
                      radius={[4, 4, 0, 0]}
                      className="dark:fill-white"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Expense Button */}
      <div className="flex justify-center py-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-2xl">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-light text-black dark:text-white">
                New Expense
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Record your spending transaction
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm onSubmit={handleAddExpense} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Expenses */}
      {expenses.length > 0 ? (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-black dark:text-white">
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 8).map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-black dark:text-white">
                      {expense.place}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg text-black dark:text-white">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            No expenses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your spending by adding your first expense
          </p>
        </div>
      )}
    </div>
  );
}
