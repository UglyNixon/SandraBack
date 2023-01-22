import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface UserCreationAttrs {
  email: string;
  phone: string;
  password: string;
  name: string;
  gender: string;
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'primary key' })
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: 'asd@gmail.com', description: 'unique mail' })
  @Column({ type: DataTypes.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: '+79161234567', description: 'unique phone' })
  @Column({ type: DataTypes.STRING, unique: true, allowNull: false })
  phone: string;
  @ApiProperty({ example: 'John Jonson', description: 'Full Name' })
  @Column({ type: DataTypes.STRING, allowNull: false })
  name: string;
  @ApiProperty({ example: 'Male', description: 'gender' })
  @Column({ type: DataTypes.STRING, allowNull: false })
  gender: string;
  @ApiProperty({ example: '123qweasd', description: 'User password' })
  @Column({ type: DataTypes.STRING, allowNull: false })
  password: string;
  @ApiProperty({ example: 'bad client', description: 'admin notice' })
  @Column({ type: DataTypes.STRING })
  notice: string;
  @ApiProperty({
    example: 'localhost:5000/api/asd81lknfs3rjns0s',
    description: 'Activation Link',
  })
  @Column({ type: DataTypes.STRING })
  activationLink: string;
  @ApiProperty({ example: 'true', description: 'User have activate account' })
  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isActivate: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  users: Role[];
}
