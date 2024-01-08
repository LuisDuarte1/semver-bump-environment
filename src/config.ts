import z from 'zod'
import * as core from '@actions/core'

export const configSchema = z
  .object({
    currentEnvironment: z.enum(['production', 'staging']),
    productionVersion: z.string(),
    bumpType: z.enum(['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease']),
    stagingVersion: z.string().optional(),
    buildMetadata: z.string().optional(),
    stagingIdentifier: z.string().default('beta'),
    stagingBumpTypeOlderThanProd: z.enum(['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease']).default('minor')
  })
  .refine(
    data =>
      (data.currentEnvironment === 'staging' &&
        data.stagingVersion !== undefined) ||
      data.currentEnvironment === 'production',
    {
      message:
        'You must define a staging version if the current environment is staging'
    }
  )

export function getConfig(): z.infer<typeof configSchema> {
  return configSchema.parse({
    currentEnviroment: core.getInput('current_environment'),
    productionVersion: core.getInput('production_version'),
    bumpType: core.getInput('bump_type'),
    stagingVersion: core.getInput('staging_version'),
    buildMetadata: core.getInput('build_metadata'),
    stagingIdentifier: core.getInput('staging_identifier'),
    stagingBumpTypeOlderThanProd: core.getInput('staging_bump_type_older_than_prod')
  })
}
