import { prisma } from '../../../lib/clients/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'
import cuid from 'cuid';
import fs from "fs";
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

const artId = cuid();
const src = `/art/${artId}`;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const file: formidable.File = files['file'] as formidable.File;
    await saveFile(file);
    await saveToDB(fields)
  });
  res.status(200).send('');
};

const saveToDB = async (fields: formidable.Fields) => {
  const galleryId = fields['galleryId'] as string;
  const artName = fields['artName'] as string;
  const description = fields['description'] as string;
  await prisma.art.create({
    data: {
      id: artId,
      galleryId: galleryId,
      name: artName,
      description: description,
      src: src,
    }
  });
  return;
}

const saveFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.path);
  fs.writeFileSync(`./public/art/${artId}`, data);
  fs.unlinkSync(file.path);
  return;
};