import { CreatePollUseCase } from '../create-poll-use-case';
import { PrismaPollRepository } from './../../repositories/prisma/prisma-poll-repository';

export function makeCreatePollUseCase() {
  const prismaPollRepository = new PrismaPollRepository()
  const createPollUseCase = new CreatePollUseCase(prismaPollRepository);
  return createPollUseCase;
}