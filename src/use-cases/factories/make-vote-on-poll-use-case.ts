import { VoteOnPollUseCase } from '../vote-on-poll-use-case';
import { PrismaPollRepository } from './../../repositories/prisma/prisma-poll-repository';

export function makeVoteOnPollUseCase() {
  const prismaPollRepository = new PrismaPollRepository()
  const voteOnPollUseCase = new VoteOnPollUseCase(prismaPollRepository);
  return voteOnPollUseCase;
}