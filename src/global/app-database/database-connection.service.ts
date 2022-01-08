import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseConnectionService {
  constructor(
    @InjectConnection('default')
    private readonly connection: Sequelize,
  ) {}

  getDatabaseActiveConnection() {
    return this.connection;
  }
}
