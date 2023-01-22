import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRole {
  @ApiProperty({ example: 'ADMIN', description: 'Role name' })
  readonly value: string;
  @ApiProperty({ example: 'full access', description: 'Description of rights' })
  readonly description: string;
}
