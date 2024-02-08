import { SocketStream } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { z } from "zod";
import { votingPubSub } from "../../utils/voting-pub-sub";

export async function pollResults(connection: SocketStream, request: FastifyRequest) {
  const getPollParams = z.object({
    pollId: z.string().uuid(),
  })

  console.log('pollResults')

  const { pollId } = getPollParams.parse(request.params)


  votingPubSub.subscribe(pollId, (message) => {
    connection.socket.send(JSON.stringify(message))
  })

}
