import { ref } from 'vue';
import generalGet from '@/helpers/generalGet';
import type { ExpensesByUser } from '@/interfaces/expenses.interface';
import type { IncomesByUser } from '@/interfaces/incomes.interface';

export const useFinancialData = () => {
  const expensesList = ref<ExpensesByUser[]>([]);
  const incomesList = ref<IncomesByUser[]>([]);

  const userId = localStorage.getItem('user_id');

  const expensesByUser = async () => {
    const response = await generalGet(`http://localhost:8000/api/expenses/user/${userId}`);
    expensesList.value = response;
  };

  const incomesByUser = async () => {
    const response = await generalGet(`http://localhost:8000/api/incomes/user/${userId}`);
    incomesList.value = response;
  };

  return {
    expensesList,
    incomesList,
    expensesByUser,
    incomesByUser
  };
};