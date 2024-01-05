import z from 'zod'
import * as core from '@actions/core'

export const configSchema = z
  .object({
    currentEnvironment: z.enum(['production', 'staging']),
    productionVersion: z.string(),
    bumpType: z.enum(['major', 'minor', 'patch', 'pre-release']),
    stagingVersion: z.string().optional(),
    buildMetadata: z.string().optional()
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
    buildMetadata: core.getInput('build_metadata')
  })
}
