import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", "'data:'", "'https:'"],
				},
			},
			crossOriginEmbedderPolicy: false,
			hsts: {
				maxAge: 31536000,
				includeSubDomains: true,
				preload: true,
			},
		}),
	);

	app.enableCors({
		origin: (origin, cb) => {
			if (!origin) {
				cb(null, true);
			}
			const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["*"];

			if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
				cb(null, true);
			} else {
				cb(new Error("Not allowed by CORS"));
			}
		},
	});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	const config = new DocumentBuilder()
		.setTitle("Marketplace Api Gateway")
		.setDescription("API Gateway for Marketplace Microservices")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
