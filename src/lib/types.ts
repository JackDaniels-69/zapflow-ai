export type Service = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

export type AISettings = {
  id: string;
  company_id: string;
  enabled: boolean;
  personality_prompt: string;
  short_reply_mode: boolean;
  convert_to_sale_mode: boolean;
};

export type Message = {
  id: string;
  company_id: string;
  contact_name: string;
  contact_phone: string;
  user_message: string;
  ai_response: string | null;
  created_at: string;
};
