export type MensajeContacto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: unknown;
};

export type MensajeContactoFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};