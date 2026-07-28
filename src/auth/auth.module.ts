import { AuthService } from "./service/auth.service";
import { AuthController } from "./controller/auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
	controllers: [AuthController],
	exports: [],
	imports: [
		PassportModule,
		HttpModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>("JWT_SECRET"),
				signOptions: { expiresIn: "24h" },
			}),
			inject: [ConfigService],
		}),
	],
	providers: [AuthService],
})
export class AuthModule {}
