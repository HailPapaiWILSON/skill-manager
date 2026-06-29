import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, usuarios } from "../db/schema.js";
import {
  normalizarTexto,
  normalizarEmail,
  normalizarCodigo,
} from "../utils/string.js";

export type CadastroInput = {
  nome: string;
  email: string;
  senha: string;
  codigoIngresso: string;
};

export type LoginInput = {
  email: string;
  senha: string;
};

export async function cadastrar(input: CadastroInput) {
  const nome = normalizarTexto(input.nome);
  const email = normalizarEmail(input.email);
  const codigoIngresso = normalizarCodigo(input.codigoIngresso);

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.codigoIngresso, codigoIngresso),
  });

  if (!equipe) {
    throw new Error("Codigo de ingresso invalido");
  }

  const usuarioExistente = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (usuarioExistente) {
    throw new Error("Email ja cadastrado");
  }

  const hashDaSenha = await bcrypt.hash(input.senha, 10);

  const [usuario] = await db
    .insert(usuarios)
    .values({
      nome,
      email,
      senhaHash: hashDaSenha,
      equipeId: equipe.id,
      funcao: "usuario",
    })
    .returning();

  if (!usuario) {
    throw new Error("Erro ao criar o usuário no banco de dados");
  }

  const { senhaHash: _, ...usuarioSemSenha } = usuario;

  return usuarioSemSenha;
}

export async function login(input: LoginInput) {
  const email = normalizarEmail(input.email);

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (!usuario) {
    throw new Error("Credenciais inválidas");
  }

  const senhaValida = await bcrypt.compare(input.senha, usuario.senhaHash);

  if (!senhaValida) {
    throw new Error("Credenciais inválidas");
  }

  const secret = "waises";

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      funcao: usuario.funcao,
      equipeId: usuario.equipeId,
    },
    secret,
    { expiresIn: "7d" },
  );

  const { senhaHash: _, ...usuarioSemSenha } = usuario;

  return { usuarioSemSenha, token };
}
