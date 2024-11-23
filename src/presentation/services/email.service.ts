import { createTransport, Transporter } from "nodemailer";

export interface EmailSendOptions {
  htmlBody     : string;
  subject      : string;
  to           : string | Array<string>;
  attachements?: Array<Attachement>;
}

export interface Attachement {
  filename: string;
  content?: string | Buffer;
  path   ?: string;
}

export interface EmailTransporterConfig {
  service: string;
  auth: TransporterAuth;
}

export interface TransporterAuth{
  user: string;
  pass: string;
}

/**
 * Servicio de envios de emails
 */
export class EmailService {

  private readonly _transporter    : Transporter;
  private readonly _sendToProvider : boolean;

  /**
   * Nueva instancia de envio de correos
   * @param config Configuracion para el funcionamiento de la clase 
   * @type EmailTransporterConfig
   * @param sendToProvider determinar si se debe enviar el correo o no
   * @type boolean
   */
  constructor(config:EmailTransporterConfig, sendToProvider: boolean){
    this._transporter = createTransport(config);
    this._sendToProvider = sendToProvider;
  }

  /**
   * Enviar nuevo correo
   * @param options Opciones de envio de correos de tipo EmailSendOptions
   * @returns Promise<boolean>
   */
  public async send(options:EmailSendOptions):Promise<boolean>{

    if( !this._sendToProvider ) return true; // si no se requiere el envio del correo

    const sendMailInformation = await this._transporter.sendMail({
      to         : options.to,
      subject    : options.subject,
      html       : options.htmlBody,
      attachments: options.attachements
    });

    if(sendMailInformation && sendMailInformation.rejected && (sendMailInformation.rejected as Array<string>).length !== 0) throw 'Send email rejected';

    return true;
  }
}