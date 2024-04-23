import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Contatos from "App/Models/contatos";
import ContatosValidator from "App/Validators/ContatosValidator";
export default class ContatosController {
  public async index({ request, response }: HttpContextContract) {
    let queryUrl = request.qs();
    let sql = "SELECT * FROM contatos WHERE 1=1 AND st_ativo IS NOT NULL";

    if (queryUrl.status != 99) {
      sql += ` AND st_ativo = ${queryUrl.status}`;
    }

    if (queryUrl.buscar != "") {
      sql += ` AND nr_celular LIKE '%${queryUrl.buscar}%' OR ds_contato LIKE '%${queryUrl.buscar}%' OR ds_email LIKE '%${queryUrl.buscar}%'`;
    }

    sql += " ORDER BY id DESC";

    try {
      const contatos = await Database.rawQuery(sql);

      response.status(200);

      return contatos;
    } catch (error) {
      response
        .status(500)
        .send({ error: "Ocorreu um erro ao executar a consulta SQL" });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const contatoData = await request.validate(ContatosValidator);

    const validContato = await this.getContato(contatoData.dsEmail, contatoData.nrCelular);

    if(validContato[0].length > 0) {
      return {
        valid: false
      }
    }

    const contato = await Contatos.create(contatoData);

    response.status(201);

    return contato;
  }

  async getContato(email: string, celular: string) {
    let sql = `SELECT * FROM contatos WHERE nr_celular = '${celular}' AND ds_email = '${email}'`;

    const contato = await Database.rawQuery(sql);

    return contato

  }

  public async show({ params }: HttpContextContract) {
    const contato = await Contatos.findOrFail(params.id);

    return contato;
  }

  public async update({ params, request, response }: HttpContextContract) {
    const contatoData = await request.validate(ContatosValidator);

    const contato = await Contatos.findOrFail(params.id);

    contato.dsContato = contatoData.dsContato;

    contato.stAtivo = contatoData.stAtivo;

    await contato.save();

    response.status(201);

    return contato;
  }

  public async destroy({ params, response }: HttpContextContract) {
    const contato = await Contatos.findOrFail(params.id);

    await contato.delete();

    return response.status(204);
  }
}
