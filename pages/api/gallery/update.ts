import { prisma } from '../../../lib/clients/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { galleryId, galleryName, artistName, description } = req.body
    const result = await prisma.gallery.update({
        where: { id: galleryId },
        data: {
            galleryName: galleryName,
            artistName: artistName,
            description: description
        }
    })
    res.json(result);
};