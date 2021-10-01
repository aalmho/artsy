import { Art } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/clients/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const artId = req.query.id as string;

  if (req.method === 'GET') {
    handleGET(artId, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(artId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/art/:id
async function handleGET(artId: string, res: NextApiResponse) {
  const safeJsonStringify = require('safe-json-stringify');
  let art: Art | null = await prisma.art.findUnique({
    where: { id: artId },
  })
  art = JSON.parse(safeJsonStringify(art));
  res.json(art)
}

// DELETE /api/art/:id
async function handleDELETE(artId: string, res: NextApiResponse) {
  const art = await prisma.art.delete({
    where: { id: artId },
  })
  res.json(art)
}