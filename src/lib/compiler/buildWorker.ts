import { parentPort, workerData, isMainThread, threadId } from "worker_threads";
import loadAllScriptEventHandlers from "lib/project/loadScriptEventHandlers";
import type {
  EngineFieldSchema,
  SceneTypeSchema,
} from "store/features/engine/engineState";
import compileData from "./compileData";
import { ProjectResources } from "shared/lib/resources/types";
import { L10NLookup, setL10NData } from "shared/lib/lang/l10n";
import ejectBuild from "./ejectBuild";
import { validateEjectedBuild } from "./validate/validateEjectedBuild";
import makeBuild from "./makeBuild";

export type BuildType = "rom" | "web" | "pocket";

export type BuildWorkerData = {
  project: ProjectResources;
  buildType: BuildType;
  projectRoot: string;
  tmpPath: string;
  engineFields: EngineFieldSchema[];
  sceneTypes: SceneTypeSchema[];
  outputRoot: string;
  make: boolean;
  debugEnabled?: boolean;
  l10nData: L10NLookup;
};

export type BuildTaskResponse =
  | {
      action: "progress";
      threadId: number;
      payload: {
        message: string;
      };
    }
  | {
      action: "warning";
      threadId: number;
      payload: {
        message: string;
      };
    }
  | {
      action: "complete";
      threadId: number;
      payload: Awaited<ReturnType<typeof compileData>>;
    };

const buildProject = async ({
  project,
  projectRoot,
  engineFields,
  sceneTypes,
  tmpPath,
  outputRoot,
  buildType,
  make,
  l10nData,
}: BuildWorkerData) => {
  // Initialise l10n
  setL10NData(l10nData);

  // Load script event handlers + plugins
  const scriptEventHandlers = await loadAllScriptEventHandlers(projectRoot);

  const compiledData = await compileData(project, {
    projectRoot,
    engineFields,
    scriptEventHandlers,
    sceneTypes,
    tmpPath,
    debugEnabled: true,
    progress,
    warnings,
  });

  await ejectBuild({
    projectType: "gb",
    projectRoot,
    tmpPath,
    projectData: project,
    engineFields,
    sceneTypes,
    outputRoot,
    compiledData,
    progress,
    warnings,
  });

  await validateEjectedBuild({
    buildRoot: outputRoot,
    progress,
    warnings,
  });

  if (make) {
    await makeBuild({
      buildRoot: outputRoot,
      tmpPath,
      buildType,
      data: project,
      debug: project.settings.generateDebugFilesEnabled,
      progress,
      warnings,
    });
  }

  return compiledData;
};

const progress = (message: string) => {
  send({
    action: "progress",
    threadId,
    payload: {
      message,
    },
  });
};

const warnings = (message: string) => {
  send({
    action: "warning",
    threadId,
    payload: {
      message,
    },
  });
};

const send = (msg: BuildTaskResponse) => {
  parentPort?.postMessage?.(msg);
};

const run = async () => {
  try {
    const res = await buildProject(workerData);
    send({ action: "complete", threadId, payload: res });
    process.exit(0);
  } catch (e) {
    console.error("buildTask process terminated with error:", e);
    process.exit(1);
  }
};

if (!isMainThread) {
  run();
}
