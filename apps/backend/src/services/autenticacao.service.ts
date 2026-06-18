import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, usuarios } from "../db/schema.js";
import {
  normalizarTexto,
  normalizarEmail,
  normalizarCodigo,
} from "../utils/string.js";

export type EntradaCadastro = {
  nome: string;
  email: string;
  senha: string;
  codigoIngresso: string;
};

export type EntradaLogin = {
  email: string;
  senha: string;
};

export async function cadastrar(entrada: EntradaCadastro) {
  const nome = normalizarTexto(entrada.nome);
  const email = normalizarEmail(entrada.email);
  const codigoIngresso = normalizarCodigo(entrada.codigoIngresso);

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

  const senhaHash = await bcrypt.hash(entrada.senha, 10);

  const [usuario] = await db
    .insert(usuarios)
    .values({
      nome,
      email,
      senhaHash,
      equipeId: equipe.id,
      funcao: "usuario",
    })
    .returning();
  return usuario;
}

export async function login(entrada: EntradaLogin) {
  const email = normalizarEmail(entrada.email);

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (!usuario) {
    throw new Error("Credenciais invalidas");
  }

  const senhaValida = await bcrypt.compare(entrada.senha, usuario.senhaHash);

  if (!senhaValida) {
    throw new Error("Credenciais Invalidas");
  }

  return usuario;
}
