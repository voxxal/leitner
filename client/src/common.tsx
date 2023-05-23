export interface Card {
  id?: string;
  question?: string;
  answer?: string;
  level?: number;
}

export interface V1ResultFailure {
  status: "failure";
  result?: never;
  reason: Failure;
}

export interface V1ResultPending {
  status: "pending";
  result?: never;
  reason?: never;
}

export interface V1ResultSuccess {
  status: "success";
  result?: any;
  reason?: never;
}
export type V1Result = V1ResultFailure | V1ResultSuccess | V1ResultPending;

export type Failure =
  | "name_conflict"
  | "user_not_found"
  | "login_was_wrong"
  | "unauthorized"
  | "passwords_do_not_match";
// To be synced with client
