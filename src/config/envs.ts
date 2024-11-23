import 'dotenv/config';
import { get } from 'env-var';

export type nodeEnvType = 'development' | 'production';

export interface Envs {
  PORT:              number;
  NODE_ENV:          nodeEnvType;
  MONGO_URL:         string;
  MONGO_DB_NAME:     string;
  JWT_SEED:          string;
  MAILER_SEND_EMAIL: boolean;
  MAILER_SERVICE:    string;
  MAILER_EMAIL:      string;
  MAILER_SECRET_KEY: string;
  WEB_SERVICE_URL:   string;
}

export const envs: Envs = {

  PORT:              get('PORT').required().asPortNumber(),
  NODE_ENV:          get('NODE_ENV').required().asEnum(['development', 'production'] as nodeEnvType[]),
  MONGO_URL:         get('MONGO_URL').required().asString(),
  MONGO_DB_NAME:     get('MONGO_DB_NAME').required().asString(),
  JWT_SEED:          get('JWT_SEED').required().asString(),
  MAILER_SERVICE:    get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL:      get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEB_SERVICE_URL:   get('WEB_SERVICE_URL').required().asString(),
  MAILER_SEND_EMAIL: get('MAILER_SEND_EMAIL').default('false').asBool(),

}



