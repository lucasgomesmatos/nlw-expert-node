import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PollNotFound } from '../../use-cases/erros/poll-already-not-found-error';
import { makeGetPollUseCase } from '../../use-cases/factories/make-get-poll-use-case';

export async function getPoll(request: FastifyRequest, reply: FastifyReply) {
  const getPollSchemaParams = z.object({
    pollId: z.string().uuid(),
  });

  const { pollId } = getPollSchemaParams.parse(request.params);

  try {
    const getPollUseCase = makeGetPollUseCase();

    const { poll } = await getPollUseCase.execute({ pollId });

    return reply.send({
      poll,
    });

  } catch (error) {

    if (error instanceof PollNotFound)
      return reply.status(404).send({ message: error.message })

    throw error;
  }
}
