import { Injectable } from '@nestjs/common';
import { CreateUserRole } from './dro/create-userRole';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private rolesRepository: typeof Role) {}
  async createRole(dto: CreateUserRole) {
    const role = await this.rolesRepository.create(dto);
    return role;
  }
  async getRoleByValue(value: string) {
    const role = await this.rolesRepository.findOne({
      where: { value: value },
    });
    return role
  }
}
