import { env } from '@/lib/utils/env';

const neon = {
  connectionString: env.DATABASE_URL,
  ssl: true,
};

export default neon;
