import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { VoteOnPollExistsError } from '../../use-cases/erros/vote-on-poll-already-exists-error copy';
import { makeVoteOnPollUseCase } from '../../use-cases/factories/make-vote-on-poll-use-case';

export async function voteOnPoll(request: FastifyRequest, reply: FastifyReply) {
  const voteOnPollSchemaBody = z.object({
    pollOptionId: z.string().uuid(),
  });

  const voteOnPollSchemaParams = z.object({
    pollId: z.string().uuid(),
  });

  const { pollId } = voteOnPollSchemaParams.parse(request.params);
  const { pollOptionId } = voteOnPollSchemaBody.parse(request.body);

  let { sessionId } = request.cookies;

  if (!sessionId) {
    sessionId = randomUUID()

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      signed: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  try {
    const voteOnPollUseCase = makeVoteOnPollUseCase();

    await voteOnPollUseCase.execute({
      sessionId: sessionId,
      pollId: pollId,
      pollOptionId: pollOptionId
    });

    return reply.status(201).send();
  } catch (error) {

    if (error instanceof VoteOnPollExistsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

}
