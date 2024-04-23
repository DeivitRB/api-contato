import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import GrupoContatos from "App/Models/gruposcontatos";
import GroupContatoValidator from "App/Validators/gruposcontatos";

export default class GruposContatosController {
  public async index({ response }: HttpContextContract) {
    const groupsContatos = await GrupoContatos.query().orderBy("id", "desc");

    response.status(200);

    return groupsContatos;
  }

  public async store({ request, response }: HttpContextContract) {
    const groupContatosData = await request.validate(GroupContatoValidator);

    const groupContatos = await GrupoContatos.create(groupContatosData);

    response.status(201);

    return groupContatos;
  }

  public async show({ params }: HttpContextContract) {
    let sql = `SELECT contatos_grupocontatos.*, grupocontatos.ds_grupocontato FROM contatos_grupocontatos
    LEFT JOIN grupocontatos ON grupocontatos.id = contatos_grupocontatos.grupocontato_id
    WHERE contatos_grupocontatos.contato_id = ${params.id}`;

    const groupContatos = await Database.rawQuery(sql);

    return groupContatos;
  }

  public async update({ params, request, response }: HttpContextContract) {
    const groupContatosData = await request.validate(GroupContatoValidator);

    const groupContato = await GrupoContatos.findOrFail(params.id);

    groupContato.contatoId = groupContatosData.contatoId;

    groupContato.grupocontatoId = groupContatosData.grupocontatoId;

    await groupContato.save();

    response.status(201);

    return groupContato;
  }

  public async destroy({ params, response }: HttpContextContract) {
    const groupContato = await GrupoContatos.findOrFail(params.id);

    await groupContato.delete();

    return response.status(204);
  }
}
