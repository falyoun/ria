import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReplaySubject } from 'rxjs';
import { Role } from '@app/role/models/role.model';
import { AppRole } from '@app/role/enums/app-role.enum';

@Injectable()
export class RoleService implements OnApplicationBootstrap {
  private _cachedRoles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>();
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {}
  private createJunoRoles() {
    return this.roleModel.bulkCreate([
      {
        name: AppRole.SUPER_ADMIN,
      },
      {
        name: AppRole.ADMIN,
      },
      {
        name: AppRole.HR_MANAGER,
      },
      {
        name: AppRole.MANAGER,
      },
      {
        name: AppRole.USER,
      },
    ]);
  }
  async onApplicationBootstrap() {
    const loadedRoles = await this.roleModel.findAll();
    if (loadedRoles && loadedRoles.length > 0)
      this._cachedRoles.next(loadedRoles);
    else {
      const junoRoles = await this.createJunoRoles();
      this._cachedRoles.next(junoRoles);
    }
  }
  get roleReplaySubject() {
    return this._cachedRoles;
  }
}
