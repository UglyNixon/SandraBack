import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'asd@gmail.com', description: 'unique mail' })
  readonly email: string;
  @ApiProperty({ example: '123qweasd', description: 'user password' })
  readonly password: string;
  @ApiProperty({ example: '+79161234567', description: 'unique phone' })
  readonly phone: string;
  @ApiProperty({ example: 'John Jonson', description: 'unique mail' })
  readonly name: string;
  @ApiProperty({ example: 'Male', description: 'User gender' })
  readonly gender: string;
  @ApiProperty({example:'sadasdasdadqweqeq',description:'Actiovation link'})
  readonly  activationLink:string;
}
