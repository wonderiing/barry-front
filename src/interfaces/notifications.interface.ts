export interface Notification {
    date:    Date;
    id:      number;
    tipo:    string;
    message: string;
    seen:    boolean;
    user_id: number;
}
