import { ref } from 'vue';
import generalGet from '@/helpers/generalGet';
import type { ExpensesByUser } from '@/interfaces/expenses.interface';
import type { IncomesByUser } from '@/interfaces/incomes.interface';

export const useFinancialData = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const expensesList = ref<ExpensesByUser[]>([]);
  const incomesList = ref<IncomesByUser[]>([]);

  const userId = localStorage.getItem('user_id');

  const expensesByUser = async () => {
    const response = await generalGet(`${API_URL}/api/expenses/user/${userId}`);
    expensesList.value = response;
  };

  const incomesByUser = async () => {
    const response = await generalGet(`${API_URL}/api/incomes/user/${userId}`);
    incomesList.value = response;
  };

  return {
    expensesList,
    incomesList,
    expensesByUser,
    incomesByUser
  };
};