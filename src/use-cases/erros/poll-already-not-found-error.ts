export class PollNotFound extends Error {
  constructor(message?: string) {
    super(message || "Poll not found");
  }
}