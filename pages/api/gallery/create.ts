import { prisma } from '../../../lib/clients/prisma';
import { getSession } from "next-auth/client";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserId(req)
  const { galleryName, artistName, description } = req.body
  const result = await prisma.gallery.create({
    data: {
      userId: userId,
      galleryName: galleryName,
      artistName: artistName,
      description: description,
    }
  });
  res.json(result);
};

const getUserId = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  return Promise.resolve(Number(session?.userId).toString());
}