import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
}
