import { prisma } from '../../../lib/clients/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const userId = fields['userId'] as string;
    const src = `/profile/${userId}`;
    const file: formidable.File = files['file'] as formidable.File;
    await saveFile(file, userId);
    await saveToDB(userId, src)
  });
  res.status(200).send('');
};

const saveToDB = async (userId: string, src: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      image: src
    }
  });
  return;
}

const saveFile = async (file: formidable.File, userId: string) => {
  const data = fs.readFileSync(file.path);
  fs.writeFileSync(`./public/profile/${userId}`, data);
  fs.unlinkSync(file.path);
  return;
};