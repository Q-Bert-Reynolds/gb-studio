import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import {
  EntitiesState,
  ProjectEntitiesData,
  BackgroundData,
  SpriteSheetData,
  MusicData,
  FontData,
  AvatarData,
  EmoteData,
  SoundData,
  TilesetData,
} from "shared/lib/entities/entitiesTypes";
import type { RootState } from "store/configureStore";
import { SettingsState } from "store/features/settings/settingsState";
import { MetadataState } from "store/features/metadata/metadataState";
import { denormalizeEntities } from "shared/lib/entities/entitiesHelpers";
import API from "renderer/lib/api";
import { Asset, AssetType } from "shared/lib/helpers/assets";
import type { LoadProjectResult } from "lib/project/loadProjectData";
import { ProjectResources } from "shared/lib/resources/types";
import { compressProjectResources } from "shared/lib/resources/compression";

let saving = false;

export type ProjectData = ProjectEntitiesData & {
  name: string;
  author: string;
  notes: string;
  _version: string;
  _release: string;
  settings: SettingsState;
};

export const denormalizeProject = (project: {
  entities: EntitiesState;
  settings: SettingsState;
  metadata: MetadataState;
}): ProjectResources => {
  // @TODO Set this to return Readonly<ProjectResources>
  const entitiesData = denormalizeEntities(project.entities);
  console.log({ entitiesData });
  return {
    ...entitiesData,
    settings: {
      _resourceType: "settings",
      ...project.settings,
    },
    metadata: {
      _resourceType: "project",
      ...project.metadata,
    },
  };
};

export const trimProjectData = (data: ProjectData): ProjectData => {
  return {
    ...data,
    backgrounds: data.backgrounds.map(
      (background) =>
        ({
          ...background,
          inode: undefined,
          _v: undefined,
        } as unknown as BackgroundData)
    ),
    spriteSheets: data.spriteSheets.map(
      (spriteSheet) =>
        ({
          ...spriteSheet,
          inode: undefined,
          _v: undefined,
        } as unknown as SpriteSheetData)
    ),
    music: data.music.map(
      (track) =>
        ({
          ...track,
          inode: undefined,
          _v: undefined,
        } as unknown as MusicData)
    ),
    sounds: data.sounds.map(
      (sound) =>
        ({
          ...sound,
          inode: undefined,
          _v: undefined,
        } as unknown as SoundData)
    ),
    fonts: data.fonts.map(
      (font) =>
        ({
          ...font,
          mapping: undefined,
          inode: undefined,
          _v: undefined,
        } as unknown as FontData)
    ),
    avatars: data.avatars.map(
      (avatar) =>
        ({
          ...avatar,
          inode: undefined,
          _v: undefined,
        } as unknown as AvatarData)
    ),
    emotes: data.emotes.map(
      (emote) =>
        ({
          ...emote,
          inode: undefined,
          _v: undefined,
        } as unknown as EmoteData)
    ),
    tilesets: data.tilesets.map(
      (tileset) =>
        ({
          ...tileset,
          inode: undefined,
          _v: undefined,
        } as unknown as TilesetData)
    ),
  };
};

const openProject = createAction<string>("project/openProject");
const closeProject = createAction<void>("project/closeProject");

const loadProject = createAsyncThunk<
  LoadProjectResult & { path: string },
  string
>("project/loadProject", async (path) => {
  console.log("CALL API LOAD PROJECT", new Date().valueOf());
  console.time("projectActions.loadProject");
  const data = await API.project.loadProject();
  console.timeEnd("projectActions.loadProject");
  // throw new Error("CANCEL LOAD");
  // console.log({ resources });
  console.log("loadProject action", { data });
  return {
    ...data,
    path,
  };
});

/**************************************************************************
 * UI
 */

const loadUI = createAction("project/loadUI");
const reloadAssets = createAction("project/reloadAssets");

/**************************************************************************
 * Asset Files
 */

const addFileToProject = createAction<string>("project/addFile");

const removeAsset = createAsyncThunk<
  {
    assetType: AssetType;
    asset: Asset;
  },
  {
    assetType: AssetType;
    asset: Asset;
  }
>("project/removeAsset", async ({ assetType, asset }) => {
  if (!(await API.project.removeAsset(assetType, asset))) {
    throw new Error("Didn't remove asset");
  }
  return {
    assetType,
    asset,
  };
});

const renameAsset = createAsyncThunk<
  {
    assetType: AssetType;
    asset: Asset;
    newFilename: string;
  },
  {
    assetType: AssetType;
    asset: Asset;
    newFilename: string;
  }
>("project/renameAsset", async ({ assetType, asset, newFilename }) => {
  if (!(await API.project.renameAsset(assetType, asset, newFilename))) {
    throw new Error("Didn't rename asset");
  }
  return {
    assetType,
    asset,
    newFilename,
  };
});

const renameBackgroundAsset = createAction<{
  backgroundId: string;
  newFilename: string;
}>("project/renameBackgroundAsset");
const removeBackgroundAsset = createAction<{ backgroundId: string }>(
  "project/removeBackgroundAsset"
);

const renameTilesetAsset = createAction<{
  tilesetId: string;
  newFilename: string;
}>("project/renameTilesetAsset");
const removeTilesetAsset = createAction<{ tilesetId: string }>(
  "project/removeTilesetAsset"
);

const renameSpriteAsset = createAction<{
  spriteSheetId: string;
  newFilename: string;
}>("project/renameSpriteAsset");
const removeSpriteAsset = createAction<{ spriteSheetId: string }>(
  "project/removeSpriteAsset"
);

const renameMusicAsset = createAction<{ musicId: string; newFilename: string }>(
  "project/renameMusicAsset"
);
const removeMusicAsset = createAction<{ musicId: string }>(
  "project/removeMusicAsset"
);

const renameSoundAsset = createAction<{ soundId: string; newFilename: string }>(
  "project/renameSoundAsset"
);
const removeSoundAsset = createAction<{ soundId: string }>(
  "project/removeSoundAsset"
);

/**************************************************************************
 * Save
 */

const saveProject = createAsyncThunk<void>(
  "project/saveProject",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;

    if (!state.document.loaded) {
      throw new Error("Cannot save project that has not finished loading");
    }
    if (saving) {
      throw new Error("Cannot save project while already saving");
    }

    saving = true;

    try {
      const normalizedProject = denormalizeProject(state.project.present);

      console.log({ normalizedProject });

      const data = compressProjectResources({
        ...normalizedProject,
        settings: {
          ...normalizedProject.settings,
          zoom: state.editor.zoom,
          worldScrollX: state.editor.worldScrollX,
          worldScrollY: state.editor.worldScrollY,
          navigatorSplitSizes: state.editor.navigatorSplitSizesManuallyEdited
            ? state.editor.navigatorSplitSizes
            : normalizedProject.settings.navigatorSplitSizes,
        },
      });
      console.log({ compressedData: data });

      // Save
      await API.project.saveProject(data);
    } catch (e) {
      console.error(e);
    }

    saving = false;
  }
);

const projectActions = {
  openProject,
  closeProject,
  loadProject,
  loadUI,
  addFileToProject,
  reloadAssets,
  saveProject,
  renameAsset,
  renameBackgroundAsset,
  renameTilesetAsset,
  renameSpriteAsset,
  renameMusicAsset,
  renameSoundAsset,
  removeAsset,
  removeBackgroundAsset,
  removeTilesetAsset,
  removeSpriteAsset,
  removeMusicAsset,
  removeSoundAsset,
};

export default projectActions;
