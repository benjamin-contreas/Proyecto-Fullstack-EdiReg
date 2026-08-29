import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://6e436a40a8db0c32e25e3fcfb49beda3@o4507382468509696.ingest.de.sentry.io/4507382476308560', // Reemplaza esto con tu DSN
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

export default Sentry;
