import { addMonths, startOfMonth } from "date-fns";

export function getFirstDayOfNextMonth(date) {
  return startOfMonth(addMonths(date, 1));
}
