import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Contatos extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dsContato: string

  @column()
  public nrCelular: string

  @column()
  public dsEmail: string

  @column()
  public stAtivo: boolean


  static get table() {
    return 'contatos'
  }
  
}
