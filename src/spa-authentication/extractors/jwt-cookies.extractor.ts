import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { SpaAuthConstants } from '@app/spa';

export function extractJWTFromCookies(req: Request): string | null {
  if (!req.cookies) {
    throw new UnauthorizedException();
  }
  if (
    !req.cookies[SpaAuthConstants.COOKIE_FIRST_AND_SECOND_PARTS] ||
    !req.cookies[SpaAuthConstants.COOKIE_THIRD_PART]
  )
    return null;
  const firstPart = req.cookies[SpaAuthConstants.COOKIE_FIRST_AND_SECOND_PARTS];
  const secondPart = req.cookies[SpaAuthConstants.COOKIE_THIRD_PART];
  return `${firstPart}.${secondPart}`;
}
