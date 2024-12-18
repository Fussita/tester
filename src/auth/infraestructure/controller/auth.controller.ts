import { Body, Controller, Get, Inject, Logger, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Mongoose } from "mongoose";
import { SignInService } from "src/auth/application/service/sign-in/sign-in-service.application";
import { SignUpService } from "src/auth/application/service/sign-up/sign-up-service.application";
import { SignInEntryController } from "./dto/sign-in/sign-in-entry-dto";
import { SignUpEntryController } from "./dto/sign-up/sign-up-entry-dto";
import { IEncryptor, IJWTGenerator, UUIDGenerator, IUUIDGenerator } from "_libs/core";
import { OdmAccountRepository } from "src/account/infraestructure/repository/odm-repository/odm-repository-account";
import { BcryptEncryptor } from "../encryptor/bcrypt-encryptor";
import { JWTGenerator } from "../jwt-generator/jwt-generator";
import { envs } from "src/config/envs";
import { AMQPPublisher } from "src/amqp/publish-suscribe/amqp-publisher";
import { AMQPExchange } from "src/amqp/publish-suscribe/_model/amqp-exchange";

@Controller()
export class AuthController {

    private readonly accountRepo: OdmAccountRepository
    private readonly encryptor: IEncryptor
    private readonly idGen: IUUIDGenerator
    private readonly jwtGen: IJWTGenerator
    private readonly mssgPublisher: AMQPPublisher
    private readonly exchange: AMQPExchange = { name: 'tester_exchange', type: 'direct' }

    private readonly logger = new Logger('AUTH')

    constructor(
        @Inject('NoSQL') mongo: Mongoose,
        private jwtService: JwtService
    ) {
        this.accountRepo = new OdmAccountRepository( mongo )
        this.encryptor = new BcryptEncryptor()
        this.idGen = new UUIDGenerator()
        this.jwtGen = new JWTGenerator( jwtService )
    
        this.mssgPublisher = new AMQPPublisher()
        setTimeout( () => {
            this.mssgPublisher.buildExchange( this.exchange )
            this.logger.log('RABBIT RUNNING')
        }, 1000 )
    }

    @Get('monton')
    async monton() {
        const url = envs.url
    }

    @Post('registro')
    async signUpUser( @Body() entry: SignUpEntryController ) {
        this.logger.log( '[RPC]: SIGNUP - '+ entry.email )
        const service = new SignUpService(
            this.accountRepo,
            this.encryptor,
            this.idGen,
            this.jwtGen
        )            
        const result = await service.execute({ ...entry })
        if (!result.isSuccess()) throw result.Error
        return result.Value
    }

}