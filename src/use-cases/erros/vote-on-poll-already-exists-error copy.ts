export class VoteOnPollExistsError extends Error {
  constructor(message?: string) {
    super(message || "You have already voted on this poll");
  }
}