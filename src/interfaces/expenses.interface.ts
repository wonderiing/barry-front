export interface ExpensesByUser {
    id:          number;
    mount:       string;
    description: string;
    date:        Date;
    user_id:     number;
    category_id: number;
    Category:    Category;
}

export interface Category {
    name: string;
}
