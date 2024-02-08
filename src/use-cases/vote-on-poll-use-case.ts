import { redis } from "../lib/redis";
import { PollRepository } from "../repositories/polls";
import { votingPubSub } from "../utils/voting-pub-sub";
import { VoteOnPollExistsError } from "./erros/vote-on-poll-already-exists-error copy";

export interface VoteOnPollUseCaseRequest {
  sessionId: string;
  pollId: string;
  pollOptionId: string;
}

export class VoteOnPollUseCase {

  constructor(private pollRepository: PollRepository) { }

  async execute({ sessionId, pollId, pollOptionId }: VoteOnPollUseCaseRequest): Promise<void> {

    const votePreviousVoteOnPoll = await this.pollRepository.getVoteOnPoll(sessionId, pollId);

    if (votePreviousVoteOnPoll && votePreviousVoteOnPoll.pollOptionId !== pollOptionId) {
      await this.pollRepository.deletePoll(votePreviousVoteOnPoll.id);
      const votes = await redis.zincrby(pollId, -1, votePreviousVoteOnPoll.pollOptionId)

      votingPubSub.publish(pollId, {
        pollOptionId: votePreviousVoteOnPoll.pollOptionId,
        votes: Number(votes)
      })
    } else {
      throw new VoteOnPollExistsError()
    }

    await this.pollRepository.voteOn({
      sessionId: sessionId,
      pollId: pollId,
      pollOptionId: pollOptionId
    });

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    votingPubSub.publish(pollId, {
      pollOptionId: pollOptionId,
      votes: Number(votes)
    })

  }
}