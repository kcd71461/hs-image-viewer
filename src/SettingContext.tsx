import { imageListItemClasses } from "@mui/material";
import axios from "axios";
import React, { ReactNode, useContext, useEffect, useState } from "react";

export type TSettingContextValue = {
  isLoading: boolean;
  setting: TSetting | null;
  error?: string;
};

export type TSetting = {
  data: TSettingImage[];
};

export type TSettingImage = {
  id: string | number;
  image: string;
  res: string;
  sem: string;
};

const initialContextValue: TSettingContextValue = {
  isLoading: true,
  setting: null,
  error: undefined,
};

export const SettingContext =
  React.createContext<TSettingContextValue>(initialContextValue);

type SettingProviderProps = {
  children?: ReactNode | undefined;
};

export function SettingProvider({ children }: SettingProviderProps) {
  const [setting, setSetting] =
    useState<TSettingContextValue>(initialContextValue);

  useEffect(() => {
    setSetting({ isLoading: true, setting: null, error: undefined });
    window.setTimeout(() => {
      axios
        .get("https://kcd71461.github.io/hs-image-viewer/setting.json")
        .then((res) => {
          const data = res.data as TSetting;
          preload(
            data.data.reduce((prev, current) => {
              if (current.image) {
                prev.push(current.image);
              }
              if (current.res) {
                prev.push(current.res);
              }
              if (current.sem) {
                prev.push(current.sem);
              }
              return prev;
            }, [] as string[])
          );
          setSetting({
            isLoading: false,
            setting: data,
          });
        })
        .catch((error: any) => {
          setSetting({
            isLoading: false,
            setting: null,
            error:
              error?.response?.data?.message ??
              error?.message ??
              "설정을 불러오는 데 실패했습니다.",
          });
        });
    }, 1000);
    return () => {};
  }, []);

  return (
    <SettingContext.Provider value={setting}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettingContext() {
  const context = useContext(SettingContext);
  return context;
}

function preload(images: string[]) {
  for (let image of images) {
    const imageEl = new Image();
    imageEl.src = image;
  }
}
