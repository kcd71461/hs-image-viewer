import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TSettingImage, useSettingContext } from "../../SettingContext";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";

type Props = {
  selectedImage: TSettingImage;
};

export default function Right({ selectedImage }: Props) {
  const { error, isLoading, res, sem } = useLoadResultImages(selectedImage.id);
  return (
    <Box className={styles.right}>
      <h2>Results</h2>
      <div className={styles.results}>
        {[
          { image: sem, title: "Semantic Segmentation" },
          { image: res, title: "Instance Segmentation" },
        ].map(({ image, title }, key) => (
          <div className={styles.card} key={key}>
            {image ? (
              <img src={image} className={styles.image} />
            ) : (
              <div className={styles.skeleton}>
                <CircularProgress />
              </div>
            )}
            <p>{title}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}

type TLoadResultImages =
  | {
      isLoading: true;
      res: null;
      sem: null;
      error: undefined;
    }
  | {
      isLoading: false;
      error: undefined;
      res: string;
      sem: string;
    }
  | {
      isLoading: false;
      error: string;
      res: null;
      sem: null;
    };

function useLoadResultImages(id: string | number) {
  const [result, setResult] = useState<TLoadResultImages>({
    isLoading: true,
    res: null,
    sem: null,
    error: undefined,
  });
  const { setting } = useSettingContext();
  useEffect(() => {
    if (!setting) {
      setResult({
        isLoading: false,
        error: "세팅을 불러올 수 없습니다.",
        res: null,
        sem: null,
      });
    } else {
      setResult({
        isLoading: true,
        error: undefined,
        res: null,
        sem: null,
      });
      const item = setting.data.find(({ id: idInArray }) => idInArray === id);
      if (item) {
        const timeout = window.setTimeout(() => {
          setResult({
            isLoading: false,
            error: undefined,
            res: item.res,
            sem: item.sem,
          });
        }, Math.random() * 1000);
        return () => {
          window.clearTimeout(timeout);
        };
      } else {
        setResult({
          isLoading: false,
          error: "세팅을 불러올 수 없습니다.",
          res: null,
          sem: null,
        });
      }
    }
    return () => {};
  }, [id]);
  return result;
}
