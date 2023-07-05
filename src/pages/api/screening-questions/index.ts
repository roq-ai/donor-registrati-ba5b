import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { screeningQuestionValidationSchema } from 'validationSchema/screening-questions';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getScreeningQuestions();
    case 'POST':
      return createScreeningQuestion();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getScreeningQuestions() {
    const data = await prisma.screening_question
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'screening_question'));
    return res.status(200).json(data);
  }

  async function createScreeningQuestion() {
    await screeningQuestionValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.screening_question.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
