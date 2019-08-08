export default {
    
        firebase:{
            firebaseAccountFilePath:"./trackingpopodevaca.json",
            databaseURL:"https://sumagro-backend.firebaseio.com",
            sumagro:{
                admin: "ignacio_triplex-8@hotmail.com.ar"
            },
            env:{
                TABLES:{
                    orders:"ORDERS"
                }
            }
        },
        nodemailer:{
            host:"smtp.gmail.com",
            port:"465",
            secure:true,
            auth:{
                user: "sumagro.distribucion@gmail.com",
                pass: "Dist2019"
            },
            mailOptions:{
                from: "SUMAGRO <sumagro.distribucion@gmail.com>",
                subject: "Remision"
            }
        }
        
        
    
}