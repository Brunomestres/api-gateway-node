import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../service/auth.service";
import { Throttle } from "@nestjs/throttler";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "User Login" })
	@ApiResponse({ status: 200, description: "Login successful" })
	@ApiResponse({ status: 401, description: "Invalid credentials" })
	@Throttle({ short: { limit: 5, ttl: 6000 } })
	async login(@Body() data: LoginDto) {
		return this.authService.login(data);
	}

	@Post("resister")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "User Registration" })
	@ApiResponse({ status: 201, description: "Registration successful" })
	@ApiResponse({ status: 401, description: "Invalid credentials data" })
	@Throttle({ medium: { limit: 3, ttl: 6000 } })
	async register(@Body() data: RegisterDto) {
		return this.authService.register(data);
	}
}
