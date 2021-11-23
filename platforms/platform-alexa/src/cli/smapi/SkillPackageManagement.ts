import { execAsync } from '@jovotech/cli-core';
import { ImportResponse, ImportStatus } from '../interfaces';
import { getAskError } from '../utilities';

export async function createNewUploadUrl(): Promise<string> {
  try {
    const { stdout } = await execAsync('ask smapi create-upload-url');
    const { uploadUrl } = JSON.parse(stdout!);
    return uploadUrl;
  } catch (error) {
    throw getAskError('smapiCreateUploadUrl', error.stderr);
  }
}

export async function createSkillPackage(
  location: string,
  askProfile?: string,
): Promise<string | undefined> {
  const cmd: string[] = [
    'ask smapi create-skill-package',
    '--full-response',
    `--location "${location}"`,
  ];

  if (askProfile) {
    cmd.push(`-p ${askProfile}`);
  }

  try {
    const { stdout } = await execAsync(cmd);
    return parseImportUrl(JSON.parse(stdout!));
  } catch (error) {
    throw getAskError('smapiCreateSkillPackage', error.stderr);
  }
}

export async function importSkillPackage(
  location: string,
  skillId: string,
  askProfile?: string,
): Promise<string | undefined> {
  const cmd: string[] = [
    'ask smapi import-skill-package',
    '--full-response',
    `--location "${location}"`,
    `-s ${skillId}`,
  ];

  if (askProfile) {
    cmd.push(`-p ${askProfile}`);
  }

  try {
    const { stdout } = await execAsync(cmd);
    return parseImportUrl(JSON.parse(stdout!));
  } catch (error) {
    throw getAskError('smapiImportSkillPackage', error.stderr);
  }
}

function parseImportUrl({ headers }: ImportResponse): string | undefined {
  // Try to parse the import url from command result
  return headers
    .find((header) => header.key === 'location')
    ?.value.split('/')
    .pop();
}

export async function getImportStatus(importId: string): Promise<ImportStatus> {
  const cmd: string[] = ['ask smapi get-import-status', `--import-id "${importId}"`];

  try {
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout!);
  } catch (error) {
    throw getAskError('smapiGetImportStatus', error.stderr);
  }
}
