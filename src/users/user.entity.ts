import {
  Column,
  DataType,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  AllowNull,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table
export class User extends Model<User> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataType.UUIDV4 })
  id?: string;

  @Column({ allowNull: false })
  fullname: string;

  @Column({ unique: true, allowNull: false, validate: { isEmail: true } })
  email: string;

  @AllowNull
  @Column
  avatar?: string;

  @AllowNull
  @Column
  facebookId?: string;

  @Column
  emailValidate?: Date;

  @Column
  get password() {
    return this.getDataValue('password');
  }

  set password(value: string) {
    const salt = bcrypt.genSaltSync();
    this.setDataValue('password', bcrypt.hashSync(value, salt));
  }

  verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
