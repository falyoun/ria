import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IServer } from '@app/app-config';
import { CrudConfigService } from '@nestjsx/crud';
import { json, urlencoded } from 'body-parser';
import {
  CodedExceptionFilter,
  DataResponseInterceptor,
  SequelizeExceptionFilter,
} from './shared';
import { createNamespace } from 'cls-hooked';
import { Sequelize } from 'sequelize';
import cookieParser from 'cookie-parser';
import { SwaggerGenerator } from '@app/app-swagger';

const namespace = createNamespace('ria-transactional-namespace');
Sequelize.useCLS(namespace);

CrudConfigService.load({
  serialize: {
    get: false,
    getMany: false,
    create: false,
    createMany: false,
    update: false,
    replace: false,
    delete: false,
  },
  query: {
    limit: 15,
    maxLimit: 100,
    alwaysPaginate: true,
  },
  auth: {
    property: 'user',
  },
  routes: {
    exclude: ['deleteOneBase', 'createManyBase', 'replaceOneBase'],
    // getOneBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
    // getManyBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
    // createOneBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
    // createManyBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
    // updateOneBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
    // replaceOneBase: {
    //   interceptors: [CrudWrapperInterceptor],
    // },
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(null, true);
        // callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders:
      'X-Requested-With, x-organization-id, X-HTTP-Method-Override, Content-Type, Accept, Observe, Origin,X-Requested-With,Accept,Authorization,authorization,X-Forwarded-for',
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  const configService = app.get<ConfigService<IAppConfig>>(ConfigService);
  const serverConfig = configService.get<IServer>('server');
  const { swagger, port, apiPrefix } = serverConfig;
  const swaggerGenerator = new SwaggerGenerator(
    swagger,
    ['development', 'production'],
    false,
  );
  swaggerGenerator.load(app);
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(
    new CodedExceptionFilter(),
    new SequelizeExceptionFilter(),
  );
  app.useGlobalInterceptors(new DataResponseInterceptor());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || port, () => {
    console.log('App is running on port: ', process.env.PORT || port);
  });
}

(async () => {
  try {
    await bootstrap();
  } catch (e) {
    console.log('Error while bootstrapping server: ', e);
  }
})();
