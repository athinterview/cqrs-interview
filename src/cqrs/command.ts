// Result is needed later, but eslint marks it incorrectly as unused variable.
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Command<Type extends string, Payload, Result> {
  type: Type;
  payload: Payload;
}

/**
 * Helper type to make it easier to define other types.
 */
export type GenericCommand = Command<string, unknown, unknown>;

/**
 * Returns the type of the command.
 */
export type GetCommandType<C extends GenericCommand> = C['type'];

/**
 * Returns the type of the payload of the command.
 */
export type GetCommandPayload<C extends GenericCommand> = C['payload'];

/**
 * Returns the type of the result of the command.
 */
export type GetCommandResult<C extends GenericCommand> = C extends Command<string, unknown, infer R> ? R : never;

/**
 * Command handler function type.
 */
export type CommandHandler<C extends GenericCommand> = (payload: GetCommandPayload<C>) => Promise<GetCommandResult<C>>;

/**
 * Class handling commands and queries.
 */
export class CommandExecutor {
  private handlers = new Map<string, CommandHandler<GenericCommand>>();

  addHandler<C extends GenericCommand>(type: GetCommandType<C>, handler: CommandHandler<C>): void {
    this.handlers.set(type, handler);
  }

  async execute<C extends GenericCommand>(command: C): Promise<GetCommandResult<C>> {
    const handler = this.handlers.get(command.type) as CommandHandler<C>;
    if (!handler) {
      throw new Error(`Handler not found for command: ${command.type}`);
    }
    return handler(command.payload);
  }
}

