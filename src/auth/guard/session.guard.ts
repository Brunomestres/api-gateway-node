import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../service/auth.service";

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const sessionToken = req.headers["x-session-token"];

		if (!sessionToken) {
			throw new UnauthorizedException("Session token required");
		}

		try {
			const session = await this.authService.validateSessionToken(sessionToken);

			if (!session.valid || !session.user) {
				throw new UnauthorizedException("Invalid session token");
			}
			req.user = session.user;
			return true;
		} catch (error) {
			throw new UnauthorizedException("Invalid session token");
		}
	}
}
