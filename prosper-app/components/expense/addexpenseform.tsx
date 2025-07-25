import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function AddExpenseForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place || !category || !amount) return;

    onSubmit({
      place,
      category,
      amount: Number.parseFloat(amount),
      date: new Date(date).toISOString(),
    });

    // Reset form
    setPlace("");
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="place"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Place
        </Label>
        <Input
          id="place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Where did you spend?"
          className="border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-black text-black dark:text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="category"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-black text-black dark:text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="amount"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-black text-black dark:text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="date"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-black text-black dark:text-white"
          required
        />
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white"
        >
          Add Expense
        </Button>
      </DialogFooter>
    </form>
  );
}
