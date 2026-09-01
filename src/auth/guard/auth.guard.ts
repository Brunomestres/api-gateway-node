import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

const JwtGuard = AuthGuard("jwt");

@Injectable()
export class JwtAuthGuard extends JwtGuard {
	constructor(private readonly reflector: Reflector) {
		super();
	}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any, _info: any) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
