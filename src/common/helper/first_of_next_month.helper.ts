import { addMonths, startOfMonth } from "date-fns";

//delete
export function getFirstDayOfNextMonth(date) {
  return startOfMonth(addMonths(date, 1));
}
