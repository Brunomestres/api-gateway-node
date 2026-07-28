import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import  { AuthService } from "../service/auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "User Login"})
    @ApiResponse({ status: 200, description: "Login successful"})
    @ApiResponse({ status: 401, description: "Invalid credentials"})
	async login(@Body() data: any) {
        return this.authService.login(data)
    }

	@Post("resister")
	@HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "User Registration"})
    @ApiResponse({ status: 201, description: "Registration successful"})
    @ApiResponse({ status: 401, description: "Invalid credentials data"})
	async register(@Body() data: any) {
        return this.authService.register(data)
    }
}
