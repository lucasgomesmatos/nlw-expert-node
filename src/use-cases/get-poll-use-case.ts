import { redis } from "../lib/redis";
import { PollRepository } from "../repositories/polls";
import { PollNotFound } from "./erros/poll-already-not-found-error";


export interface GetPollUseCaseRequest {
  pollId: string;
}

export interface GetPollUseCaseResponse {
  poll: {
    id: string;
    title: string;
    options: {
      id: string;
      title: string;
      votes: number;
    }[]
  }
}


export class GetPollUseCase {

  constructor(private pollRepository: PollRepository) { }

  async execute({ pollId }: GetPollUseCaseRequest): Promise<GetPollUseCaseResponse> {
    const poll = await this.pollRepository.getPoll(pollId);

    if (!poll) throw new PollNotFound()

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = result.reduce((acc, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1]

        Object.assign(acc, { [line]: Number(score) })
      }
      return acc

    }, {} as Record<string, number>)

    return {
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => ({
          id: option.id,
          title: option.title,
          votes: votes[option.id] || 0
        }))
      }
    }

  }
}