import * as nodemailer from 'nodemailer';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';
export class Nodemailers {
    config: any;
    constructor(config:any){
        this.config=config;
    }
         async sendMail(documents: DocSend,email: string) {
           
            console.info( "start method sendMail" );
            let transporter = nodemailer.createTransport( {
                    host: this.config.nodemailer.host,
                    port: this.config.nodemailer.port,
                    secure: this.config.nodemailer.secure,
                    auth: {
                            user: this.config.nodemailer.auth.user,
                            pass: this.config.nodemailer.auth.pass
                        }
                } );
                
            let mailOptions:any = {
                    from: this.config.nodemailer.mailOptions.from, // sender address
                    to: email, // list of receivers
                    subject: this.config.nodemailer.mailOptions.subject, // Subject line // plain text body
                    attachments: 
                        documents
                };

            
            transporter.sendMail( mailOptions, ( error: any, info: any ) => {
                    if ( error ) {
                            return console.error( error );
                        }
                    console.debug( 'Message sent: ', info.messageId );
                    console.debug( 'Preview URL: ', nodemailer.getTestMessageUrl( info ) );
                });
            
            }

        
        async sendMailNewAccount(email: string, credentials: any ){
            logger.info('NODEMAILER: Method sendMailNewAccount Starting');
            logger.info("CREDENTIALS: ", JSON.stringify(credentials));
            logger.info(email);
            let transporter = nodemailer.createTransport( {
                    host: this.config.nodemailer.host,
                    port: this.config.nodemailer.port,
                    secure: this.config.nodemailer.secure,
                    auth: {
                            user: this.config.nodemailer.auth.user,
                            pass: this.config.nodemailer.auth.pass
                        }
                } );
                
            let mailOptions:any = {
                    from: this.config.nodemailer.mailOptions.from, // sender address
                    to: email, // list of receivers
                    subject: "Cuenta SUMAGRO", // Subject line // plain text body
                    text: `Username: ${credentials.email} Password: ${credentials.password}`
                };

                logger.info("pasas")
            transporter.sendMail( mailOptions, ( error: any, info: any ) => {
                logger.info("pasa")
                    if ( error ) {
                            return console.error( error );
                        }
                    console.debug( 'Message sent: ', info.messageId );
                    console.debug( 'Preview URL: ', nodemailer.getTestMessageUrl( info ) );
                });
            
                logger.debug('NODEMAILER: Method sendMailNewAccount Ending');
            
            }

        }
    
interface DocSend{
    content: any,
    filename: string
}