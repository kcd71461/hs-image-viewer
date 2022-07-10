import React, { useCallback } from "react";
import styles from "./index.module.scss";
import { TSettingImage, useSettingContext } from "../../SettingContext";
import { Box } from "@mui/material";
import clsx from "clsx";

type Props = {
  selectedImage?: TSettingImage | null;
  onImageClick: (image: TSettingImage) => void;
};

export default function Left({ selectedImage, onImageClick }: Props) {
  const { setting, isLoading, error } = useSettingContext();
  const genOnImageClickHandler = useCallback(
    (image: TSettingImage) => {
      return () => {
        onImageClick?.(image);
      };
    },
    [onImageClick]
  );

  if (!setting) {
    return null;
  }

  return (
    <Box className={clsx(styles.left, selectedImage && styles.selected)}>
      <h2>Select an Image</h2>
      <div className={styles.images}>
        {setting.data.map((item, key) => (
          <img
            key={key}
            className={
              selectedImage?.id === item.id ? styles.selected : undefined
            }
            src={item.image}
            onClick={genOnImageClickHandler(item)}
          />
        ))}
      </div>
    </Box>
  );
}
