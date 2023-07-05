import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { screeningQuestionValidationSchema } from 'validationSchema/screening-questions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.screening_question
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getScreeningQuestionById();
    case 'PUT':
      return updateScreeningQuestionById();
    case 'DELETE':
      return deleteScreeningQuestionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getScreeningQuestionById() {
    const data = await prisma.screening_question.findFirst(convertQueryToPrismaUtil(req.query, 'screening_question'));
    return res.status(200).json(data);
  }

  async function updateScreeningQuestionById() {
    await screeningQuestionValidationSchema.validate(req.body);
    const data = await prisma.screening_question.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteScreeningQuestionById() {
    const data = await prisma.screening_question.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
