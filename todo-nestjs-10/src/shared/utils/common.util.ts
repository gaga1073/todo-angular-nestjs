import { existsSync } from 'fs';
import { resolve } from 'path';
import { InternalServerErrorException } from '@nestjs/common';

export function toISOStringWithTimezone(date: Date): string {
  const zeroPadding = (s: string): string => {
    return ('0' + s).slice(-2);
  };

  const year = date.getFullYear().toString();
  const month = zeroPadding((date.getMonth() + 1).toString());
  const day = zeroPadding(date.getDate().toString());

  const hour = zeroPadding(date.getHours().toString());
  const minute = zeroPadding(date.getMinutes().toString());
  const second = zeroPadding(date.getSeconds().toString());

  const localDate = `${year}-${month}-${day}`;
  const localTime = `${hour}:${minute}:${second}`;

  const diffFromUtc = date.getTimezoneOffset();

  if (diffFromUtc === 0) {
    const tzSign = 'Z';
    return `${localDate}T${localTime}${tzSign}`;
  }

  const tzSign = diffFromUtc < 0 ? '+' : '-';
  const tzHour = zeroPadding((Math.abs(diffFromUtc) / 60).toString());
  const tzMinute = zeroPadding((Math.abs(diffFromUtc) % 60).toString());

  return `${localDate}T${localTime}${tzSign}${tzHour}:${tzMinute}`;
}

export function getEnvFilePath(envFilesDirectory: string): string {
  const env = process.env.NODE_ENV;
  const fileName = env ? `.env.${env}` : '.env.development';
  const filePath = resolve(`${envFilesDirectory}/environment/${fileName}`);
  if (!existsSync(filePath)) {
    throw new InternalServerErrorException(
      `Environment file "${fileName}" was not found in directory "${envFilesDirectory}".`,
    );
  }
  return filePath;
}
