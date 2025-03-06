import { MMKV } from "react-native-mmkv";
import * as Application from "expo-application";

const storageId = `${Application.applicationId}-mmkv`;
export const storage = new MMKV({ id: storageId });
