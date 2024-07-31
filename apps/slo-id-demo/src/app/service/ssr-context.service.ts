import { Injectable } from '@angular/core';

@Injectable()
export abstract class SSRContextService {
  public abstract isClientSide: boolean;
}

@Injectable()
export class ClientContextService extends SSRContextService {
  public override isClientSide = true;
}

@Injectable()
export class ServerContextService extends SSRContextService {
  public override isClientSide = false;
}