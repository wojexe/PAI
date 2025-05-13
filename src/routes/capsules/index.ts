import express from "express";

const app = express();
export const router = app.router;

router.get("/", (req, res) => {
  res.render("capsules/list", {
    title: "Time capsules",
    message: "List of capsules 🔮",
  });
});

router.get("/:id", (req, res) => {
  res.render("capsules/show", {
    title: `Time capsule #${req.params.id}`,
    message: `Time capsule #${req.params.id}`,
  });
});

router.post("/", (req, res) => {
  res.send("Create a new capsule");
});

router.delete("/:id", (req, res) => {
  res.send(`Delete capsule #${req.params.id}`);
});

// Updates of capsules are not allowed
