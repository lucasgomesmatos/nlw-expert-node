import { PollRepository, VoteOnPollProps } from "../polls";
import { prisma } from './../../lib/prisma';


export class PrismaPollRepository implements PollRepository {
  async create(title: string, options: string[]) {
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => ({
              title: option,
            }))
          }
        }
      }
    })

    return poll;
  }

  async getPoll(pollId: string) {

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });

    return poll;
  }

  async voteOn(params: VoteOnPollProps) {

    const { sessionId, pollId, pollOptionId } = params;

    await prisma.vote.create({
      data: {
        sessionId: sessionId,
        pollId: pollId,
        pollOptionId: pollOptionId,
      }
    })
  }

  async getVoteOnPoll(sessionId: string, pollId: string) {

    const vote = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId
        }
      }
    });

    return vote;
  }

  async deletePoll(voteId: number) {
    await prisma.vote.delete({
      where: {
        id: voteId
      }
    })
  }

}