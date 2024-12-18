import { Provider } from "@nestjs/common";

export const MongooseDataBaseProvider: Provider = 
  {
    provide: 'NoSQL',
    useFactory: async () => {
    },
  }