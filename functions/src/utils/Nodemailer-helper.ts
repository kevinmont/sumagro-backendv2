import * as nodemailer from 'nodemailer';
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

        
        sendMailNewAccount(email: string, credentials: any ){
            console.log("CREDENTIALS: ", JSON.stringify(credentials));
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
                    subject: "Cuenta SUMAGRO", // Subject line // plain text body
                    text: `Username: ${credentials.email} Password: ${credentials.password}`
                };

            
            transporter.sendMail( mailOptions, ( error: any, info: any ) => {
                    if ( error ) {
                            return console.error( error );
                        }
                    console.debug( 'Message sent: ', info.messageId );
                    console.debug( 'Preview URL: ', nodemailer.getTestMessageUrl( info ) );
                });
            
            }

        }
    
interface DocSend{
    content: any,
    filename: string
}