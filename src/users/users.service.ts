import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User) private userRepository: typeof User,
      private rolesService : RolesService
      ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role =await this.rolesService.getRoleByValue("CLIENT")
    await user.$set('roles',[role.id])
    user.roles=[role]
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByPhone(phone:string) {
    const user=await this.userRepository.findOne({where:{phone:phone},include:{all:true}})
    return user
  }

  async getUserByEmail(email:string) {
    const user=await this.userRepository.findOne({where:{email:email},include:{all:true}})
    return user
  }

  async activateUser(link) {
    const candidate = await this.userRepository.findOne({where:{activationLink:link}})
    if (!candidate ) throw new HttpException('Не рабочая ссылка для активации',HttpStatus.BAD_GATEWAY)
    candidate.isActivate=true;
    await candidate.save()
    //костыль для передресации
    return true

  }
  async findById(id){
    const user = await this.userRepository.findOne({where:{id:id}})
    return user

  }

}
