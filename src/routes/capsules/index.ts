import express from "express";
import { postHandlers } from "./create.js";
import { db } from "../../database/index.js";
import { capsulesTable, capsulesFilesTable } from "../../database/schema.js";
import { eq } from "drizzle-orm";

const app = express();
export const router = app.router;

router.get("/", async (req, res) => {
  const capsules = await db.select().from(capsulesTable);

  if (!capsules) {
    return res
      .status(404)
      .render("404", { title: "Błąd podczas wyszukiwania kapsuł" });
  }

  res.render("capsules/list", {
    title: "Lista kapsuł",
    capsules,
  });
});

router.get("/new", (req, res) => {
  res.render("capsules/new", {
    title: "Nowa kapsuła",
  });
});

router.post("/", postHandlers);

router.get("/:id", async (req, res) => {
  const capsuleWithFiles = await db
    .select({
      capsule: capsulesTable,
      files: capsulesFilesTable,
    })
    .from(capsulesTable)
    .leftJoin(
      capsulesFilesTable,
      eq(capsulesFilesTable.capsuleId, capsulesTable.id)
    )
    .where(eq(capsulesTable.id, Number(req.params.id)));

  const capsule = capsuleWithFiles[0]?.capsule;
  const files = capsuleWithFiles
    .filter((row) => row.files)
    .map((row) => row.files);

  if (!capsule) {
    return res.status(404).render("404", { title: "Kapsuła nie została znaleziona" });
  }

  const publishDate = new Date(capsule.publishDate);

  if (publishDate > new Date()) {
    return res.render("capsules/show", {
      title: `Kapsuła #${capsule.id}`,
      capsule: { id: capsule.id, publishDate: capsule.publishDate },
    });
  }

  res.render("capsules/show", {
    title: `Kapsuła #${capsule.id}`,
    capsule,
    files,
  });
});

// Deletions and updates of capsules are not allowed
