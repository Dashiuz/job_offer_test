import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsBoolean } from 'class-validator';

export class RequestReportByDateDto {
  @IsOptional()
  @IsDate()
  @Transform(
    ({ value }) => {
      if (!value) return undefined;
      return new Date(`${value}T00:00:00.000Z`);
    },
    { toClassOnly: true },
  )
  from?: Date;

  @IsOptional()
  @IsDate()
  @Transform(
    ({ value }) => {
      if (!value) return undefined;
      return new Date(`${value}T23:59:59.999Z`);
    },
    { toClassOnly: true },
  )
  to?: Date;

  @IsOptional()
  @IsBoolean()
  @Transform(
    ({ value }) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const v = value.trim().toLowerCase();
        if (['true', '1'].includes(v)) return true;
        if (['false', '0'].includes(v)) return false;
      }
      return undefined;
    },
    { toClassOnly: true },
  )
  hasPrice?: boolean;
}
