import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class GroupContatoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    contatoId: schema.number(),
    grupocontatoId: schema.number(),
  });

  public messages: CustomMessages = {};
}
