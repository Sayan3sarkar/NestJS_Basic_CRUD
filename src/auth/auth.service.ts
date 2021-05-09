import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JWTPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Used to sign up a user
   * @param authCredentialsDTO
   */
  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }

  /**
   * Used to Sign In a user
   * @param authCredentialsDTO
   */
  public async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.pwdValidator(authCredentialsDTO);
    if (!user) {
      throw new UnauthorizedException('No user with this email found');
    }
    const { email } = user;

    const payload: JWTPayload = { email };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
