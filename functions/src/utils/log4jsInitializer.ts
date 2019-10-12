import * as log4js from 'log4js';
import { LoggingEvent } from 'log4js';
const uuid = require('uuid');

export default () => {
    log4js.configure({
        appenders: {
            sumagro: {
                type: "stdout",
                layout: {
                    "type": "pattern",
                    pattern: "%[ %d [%p] %x{requestId} %c -%] %m",
                    tokens: {
                        requestId: function(logEvent: LoggingEvent) {
                            // an id which is used to identify a specific request
                            return uuid.v1();
                        }
                    }
                }
            }
        },
        categories: {
            default: {
                appenders: ["sumagro"],
                level: "debug",
                enableCallStack: true
            }
        }
    })
};