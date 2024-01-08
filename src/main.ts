import * as core from '@actions/core'
import { getConfig } from './config'
import { bumpProduction, bumpStaging } from './bump';
import { SemVer } from 'semver';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const config = getConfig() 
    let newVersionSemVer :SemVer
    switch (config.currentEnvironment) {
      case "production":
        newVersionSemVer = bumpProduction(config)
        break;

      case "staging":
        newVersionSemVer = bumpStaging(config)
        break;
    }
    if(config.buildMetadata !== undefined){
      newVersionSemVer.version += `+${config.buildMetadata}`
    }
    core.setOutput('new_version', newVersionSemVer.version)

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
