// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//     constructor(private authService: AuthService) {
//         super({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: 'http://localhost:3000/auth/google/callback',
//             scope: ['email', 'profile'],
//         });
//     }

//     async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
//         const { name, emails } = profile;
//         const user = await this.authService.validateGoogleUser(emails[0].value, name.givenName, name.familyName);
//         if (!user) {
//             throw new UnauthorizedException();
//         }
//         done(null, user);
//     }
// }
