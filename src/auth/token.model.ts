import {Column, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import { User } from "src/users/users.model";


@Table({tableName:'tokens',timestamps:false})
export class Token extends Model<Token>{

    @Column({type:DataTypes.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
    id:number;
    @Column({type:DataTypes.STRING(1000),allowNull:false})
    refreshToken:string;
    @ForeignKey(() => User)
    @Column({field: 'userId'})
    userId: number


}