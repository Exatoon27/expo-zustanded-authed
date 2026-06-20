export type AuthStackParams = {
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
  'phone-login': undefined;
  'otp-verify': {
    phone: string;
    channel: 'sms' | 'whatsapp';
  };
};

export type TabsParams = {
  index: undefined;
  profile: undefined;
};
