import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private jwtService: JwtService) {
    super();
  }

  /**
   * Used to sign up a user
   * @param authCredentialsDTO
   */
  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { email, password } = authCredentialsDTO;
    // const salt = await bcrypt.genSalt(); // We use a simple salt for this case.
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User();
    user.email = email;
    user.password = hashedPw;

    try {
      await user.save();
    } catch (error) {
      console.log(error.code);
      if (error.code == 23505) {
        // For Duplicate email
        throw new ConflictException(
          'A user with this email exists. Try another email',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Password Validator
   * @param authCredentialsDTO
   */
  public async pwdValidator(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<User> {
    const { email, password } = authCredentialsDTO;

    const user = await this.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('No user with this email found');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password. Please try again');
    }

    return user;
  }
}
