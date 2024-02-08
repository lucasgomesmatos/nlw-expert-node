import { Poll, Vote } from "@prisma/client";

export type PollAndOptionsProps = Poll & {
  options: {
    id: string;
    title: string;
  }[]
}

export type VoteOnPollProps = {
  sessionId: string,
  pollId: string,
  pollOptionId: string
}

export interface PollRepository {
  create(title: string, options: string[]): Promise<Poll>;

  getPoll(pollId: string): Promise<PollAndOptionsProps | null>;

  voteOn(params: VoteOnPollProps): Promise<void>;

  getVoteOnPoll(sessionId: string, pollId: string): Promise<Vote | null>;

  deletePoll(voteId: number): Promise<void>;
}