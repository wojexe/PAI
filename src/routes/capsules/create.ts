import type { RequestHandler } from "express";
import multer, { memoryStorage } from "multer";
import * as v from "valibot";
import { customAlphabet } from "nanoid";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "../../database/index.js";
import { capsulesFilesTable, capsulesTable } from "../../database/schema.js";
import { Config } from "../../config/index.js";

// Nanoid setup
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12
);

// Validation schema
const capsulesPOSTSchema = v.strictObject({
  content: v.string(),
  publish_date: v.pipe(
    v.string(),
    v.isoDateTime(),
    v.transform((isoDate) => new Date(isoDate)),
    v.custom<Date>(
      (date) => (date as Date).getTime() >= Date.now(),
      "Date must be in the future"
    )
  ),
});

// Utility functions
const getExtension = (fileName: string) => fileName.split(".").pop();
const getContentType = (fileMime: string) => {
  const [kind] = fileMime.split("/");
  const contentTypeSchema = v.picklist(["image", "video", "audio"]);
  return v.parse(contentTypeSchema, kind);
};

async function processFile(
  file: Express.Multer.File,
  capsule: typeof capsulesTable.$inferSelect
): Promise<typeof capsulesFilesTable.$inferInsert> {
  const fileName = `${nanoid()}.${getExtension(file.originalname)}`;
  const contentType = getContentType(file.mimetype);
  const capsuleFolderPath = path.join(
    Config.CAPSULES_FOLDER,
    capsule.folderName
  );

  await fs.mkdir(capsuleFolderPath, { recursive: true });
  await fs.writeFile(path.join(capsuleFolderPath, fileName), file.buffer);

  return { fileName, contentType, capsuleId: capsule.id };
}

// Main POST handler
export const postHandler: RequestHandler = async (req, res) => {
  const { content, publish_date } = v.parse(capsulesPOSTSchema, req.body);

  const capsuleId = await db.transaction(async (tx) => {
    const [capsule] = await tx
      .insert(capsulesTable)
      .values({
        content,
        folderName: nanoid(),
        publishDate: publish_date.toISOString(),
      })
      .returning();

    if (capsule == null) return tx.rollback();

    const files = req.files as Express.Multer.File[];

    if (files.length > 0) {
      const capsuleFilesRows = await Promise.all(
        files.map((file) => processFile(file, capsule))
      );

      await tx.insert(capsulesFilesTable).values(capsuleFilesRows);
    }

    return capsule.id;
  });

  res.redirect(`/capsules/${capsuleId}`);
};

// Multer setup
const upload = multer({
  storage: memoryStorage(),
  limits: { files: 4, fileSize: 32 * 1024 * 1024 },
});

export const postHandlers = [upload.array("attachments"), postHandler];
