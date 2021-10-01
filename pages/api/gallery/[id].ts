import { Gallery } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/clients/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const galleryId = req.query.id as string;

  if (req.method === 'GET') {
    handleGET(galleryId, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(galleryId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/gallery/:id
async function handleGET(galleryId: string, res: NextApiResponse) {
  const safeJsonStringify = require('safe-json-stringify');
  let gallery: Gallery | null = await prisma.gallery.findUnique({
    where: { id: galleryId },
  })
  gallery = JSON.parse(safeJsonStringify(gallery));
  res.json(gallery)
}

// DELETE /api/gallery/:id
async function handleDELETE(artId: string, res: NextApiResponse) {
  const post = await prisma.art.delete({
    where: { id: artId },
  })
  res.json(post)
}