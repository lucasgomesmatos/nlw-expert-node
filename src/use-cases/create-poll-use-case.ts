import { Poll } from '@prisma/client';
import { PollRepository } from "../repositories/polls";

export interface CreatePollUseCaseRequest {
  title: string;
  options: string[];
}

export interface CreatePollUseCaseResponse {
  poll: Poll;
}


export class CreatePollUseCase {

  constructor(private pollRepository: PollRepository) { }

  async execute({ title, options }: CreatePollUseCaseRequest): Promise<CreatePollUseCaseResponse> {
    const poll = await this.pollRepository.create(title, options);

    return {
      poll
    }
  }
}