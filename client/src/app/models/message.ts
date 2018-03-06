export class Message{
  constructor(
    public _id: string,
    public text: string,
    public emitter: string,
    public receiver: string,
    public create_at: string
  ){}
}
