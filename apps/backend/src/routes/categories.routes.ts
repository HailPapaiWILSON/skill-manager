import { Router } from "express";

import {
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categories.service.js";

const router = Router();


router.get("/", async (_req, res) =>
{
    const categories = await listCategories();

    res.json(categories);
});

router.get("/:id", async (req, res) =>
{
    const category = await getCategoryById(
        Number(req.params.id)
    );

    if (!category)
    {
        return res.status(404).json({
            error: "Categoria não encontrada",
        });
    }

    res.json(category);
});

router.post("/", async (req, res) =>
{
    const category = await createCategory(req.body);

    res.status(201).json(category);
});

router.put("/:id", async (req, res) =>
{
    const category = await updateCategory(
        Number(req.params.id),
        req.body
    );

    res.json(category);
});


router.delete("/:id", async (req, res) =>
{
    await deleteCategory(
        Number(req.params.id)
    );

    res.sendStatus(204);
});

export default router;
