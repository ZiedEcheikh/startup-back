
export interface AuthResponseData {
    token_type: string;
    access_token: string;
    email: string;
    refresh_token: string;
    userId: string;
    expires_in: string;
    registered?: boolean;
  }