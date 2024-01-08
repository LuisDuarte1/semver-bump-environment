import z from 'zod'
import { configSchema } from './config'
import { SemVer, compare, parse } from 'semver'

function bump(semver: SemVer, config: z.infer<typeof configSchema>): SemVer {
  return semver.inc(config.bumpType)
}

export function bumpProduction(config: z.infer<typeof configSchema>): SemVer {
  const productionSemVer = parse(config.productionVersion)
  if (productionSemVer === null) {
    throw Error(`Could not parse SemVer ${config.productionVersion}`)
  }

  return bump(productionSemVer, config)
}

export function bumpStaging(config: z.infer<typeof configSchema>): SemVer {
  const productionSemVer = parse(config.productionVersion)
  if (productionSemVer === null) {
    throw Error(`Could not parse SemVer ${config.productionVersion}`)
  }

  const stagingSemVer = parse(config.stagingVersion)
  if (stagingSemVer === null) {
    throw Error(`Could not parse SemVer ${config.stagingVersion}`)
  }

  if (compare(productionSemVer, stagingSemVer) === 1) {
    return productionSemVer.inc(
      config.stagingBumpTypeOlderThanProd,
      config.stagingIdentifier
    )
  }

  return stagingSemVer.inc(config.bumpType, config.stagingIdentifier)
}
