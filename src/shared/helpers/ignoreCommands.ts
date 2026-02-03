/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const ignoreCommands = () => async (ctx, next) => {
  if (ctx.message?.text?.startsWith('/')) return;
  return next();
};
