import { Router } from "express";

import {
    listarCategorias,
    obterCategoriaPorId,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
} from "../services/categorias.service.js";

import { isAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", async (_req, res) =>
{
    const categorias = await listarCategorias();

    res.json(categorias);
});

router.get("/:id", async (req, res) =>
{
    const categoria = await obterCategoriaPorId(
        Number(req.params.id)
    );

    if (!categoria)
    {
        return res.status(404).json({
            error: "Categoria não encontrada",
        });
    }

    res.json(categoria);
});

router.post("/", isAdmin, async (req, res) =>
{
    const categoria = await criarCategoria(req.body);

    res.status(201).json(categoria);
});

router.put("/:id", isAdmin, async (req, res) =>
{
    const categoria = await atualizarCategoria(
        Number(req.params.id),
        req.body
    );

    res.json(categoria);
});


router.delete("/:id", isAdmin, async (req, res) =>
{
    await deletarCategoria(
        Number(req.params.id)
    );

    res.sendStatus(204);
});

export default router;
