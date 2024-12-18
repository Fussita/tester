import { Controller, Get, Inject, Param, Post, Query, Body } from "@nestjs/common";
import { AMQPExchange } from "./amqp/publish-suscribe/_model/amqp-exchange";
import { AMQPQueue } from "./amqp/publish-suscribe/_model/amqp-queue";
import { AMQPConsumer } from "./amqp/publish-suscribe/amqp-consumer";

@Controller('')
export class AppController {
    
    private consumer: AMQPConsumer
    private readonly exchange: AMQPExchange = { name: 'tester_exchange', type: 'direct' }
    private readonly queue: AMQPQueue = { name: 'tester_queue', exchange: this.exchange }

    constructor() {
        this.consumer = new AMQPConsumer()
        setTimeout( async () => {
            await this.consumer.buildQueue( this.queue )
            await this.consumer.consume<any>( 
              this.queue, 
              async (entry: any) => {
                  console.log( entry )
                  return
                }
              )
            console.log('RABBIT RUNNING')
          }, 1000 )
    }
    
    @Get('url')
    async url() {
        console.log('TESTER URL ACTIVATED')
        return {
          text: 'testered url'
        }
    }


}