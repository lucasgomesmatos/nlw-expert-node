import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { fastifyWebsocket } from '@fastify/websocket';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { environment } from './env/env';
import { pollsRoutes } from './http/routes';


export const app = fastify();
app.register(cookie, {
  secret: environment.COOKIE_SECRET,
  hook: 'onRequest',
} as FastifyCookieOptions);

app.register(fastifyWebsocket)

app.register(pollsRoutes)



app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    });
  }

  if (environment.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: send error to external tool Sentry/Datadog/New Relic
  }

  reply.status(500).send({
    message: 'Internal server error',
  });
});
