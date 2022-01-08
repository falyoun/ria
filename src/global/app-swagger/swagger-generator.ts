import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import { ISwagger } from './swagger-config.interface';

type AllowedEnvs = ('development' | 'staging' | 'production')[];
export class SwaggerGenerator {
  private readonly useAuth: {
    username: string;
    password: string;
  };
  constructor(
    private readonly swagger: ISwagger,
    private readonly allowedEnvironments: AllowedEnvs = ['development'],
    private readonly ignoreSwaggerAuth: boolean = true,
  ) {
    this.useAuth = swagger.useAuth;
  }
  private lockDocumentationForUnAuthenticatedUser(app: INestApplication) {
    const { username, password } = this.useAuth;
    app.use(
      [this.swagger.api],
      basicAuth({
        challenge: true,
        users: {
          [username]: password,
        },
      }),
    );
  }
  public load(app: INestApplication) {
    if (this.allowedEnvironments.some((v) => v === process.env.NODE_ENV)) {
      if (
        !this.ignoreSwaggerAuth &&
        this.useAuth &&
        this.useAuth.username &&
        this.useAuth.password
      ) {
        console.log('Locking documentation');
        this.lockDocumentationForUnAuthenticatedUser(app);
      }
      const document = SwaggerModule.createDocument(
        app,
        this.buildSwaggerDocument(),
      );
      SwaggerModule.setup(this.swagger?.api, app, document);
    }
  }
  private buildSwaggerDocument() {
    return new DocumentBuilder()
      .setTitle(this.swagger?.title)
      .setDescription(this.swagger?.description)
      .setVersion(this.swagger?.version)
      .addTag(this.swagger?.tag)
      .build();
  }
}
