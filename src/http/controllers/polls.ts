import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreatePollUseCase } from '../../use-cases/factories/make-create-poll-use-case';

export async function createPoll(request: FastifyRequest, reply: FastifyReply) {
  const createPollBodySchema = z.object({
    title: z.string(),
    options: z.array(z.string()),
  });

  const { title, options } = createPollBodySchema.parse(request.body);

  try {
    const createPollUseCase = makeCreatePollUseCase();

    const { poll } = await createPollUseCase.execute({
      title,
      options
    });

    return reply.status(201).send({
      pollId: poll.id,
    });

  } catch (error) {
    throw error;
  }
}
