import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, getUsers } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;
  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    reply.code(500).send(error);
  }
}

export async function loginUserHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return reply.code(401).send({ message: "Invalid credentials" });
  }

  const isMatch = verifyPassword({
    candidatePassword: password,
    hash: user.password,
    salt: user.salt,
  });

  if (isMatch) {
    const { password, salt, ...rest } = user;
    return {
      accessToken: server.jwt.sign(rest),
    };
  }

  return reply.code(401).send({ message: "Invalid credentials" });
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users = await getUsers();
  return reply.code(200).send(users);
}
