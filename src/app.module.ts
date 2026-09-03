import { ThrottlerModule } from "@nestjs/throttler";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProxyModule } from "./proxy/proxy.module";
import { MiddlewareModule } from "./middleware/middleware.module";
import { LoggingMiddleware } from "./middleware/logging/logging.middleware";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { CustomThrottlerGuard } from "./guards/throttler.guard";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => [
				{
					ttl: 600000,
					limit: configService.get<number>("RATE_LIMIT_MEDIUM", 10),
					name: "medium",
				},
				{
					ttl: 1000,
					limit: configService.get<number>("RATE_LIMIT_SHORT", 100),
					name: "short",
				},
				{
					ttl: 900000,
					limit: configService.get<number>("RATE_LIMIT_LONG", 1000),
					name: "long",
				},
			],
			inject: [ConfigService],
		}),
		ProxyModule,
		MiddlewareModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: CustomThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
