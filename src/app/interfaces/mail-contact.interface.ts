import { Client } from "../entities/client";

export interface MailContact {
  auth: Client,
  message: string
}
