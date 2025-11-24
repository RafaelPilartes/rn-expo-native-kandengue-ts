interface AppSettingsInterface {
  id: string;
  user_id: string;
  receive_push_alerts: boolean;
  receive_sms_fallback: boolean;
  created_at: Date;
  updated_at: Date;
}
