import { GetPollUseCase } from '../get-poll-use-case';
import { PrismaPollRepository } from './../../repositories/prisma/prisma-poll-repository';

export function makeGetPollUseCase() {
  const prismaPollRepository = new PrismaPollRepository()
  const getPollUseCase = new GetPollUseCase(prismaPollRepository);
  return getPollUseCase;
}