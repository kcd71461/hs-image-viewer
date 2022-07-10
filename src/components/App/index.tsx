import { CircularProgress, Container, ThemeProvider } from "@mui/material";
import React, { useCallback, useState } from "react";
import {
  SettingProvider,
  TSettingImage,
  useSettingContext,
} from "../../SettingContext";
import theme from "../../theme";
import Left from "../Left";
import Right from "../Right";
import styles from "./index.module.scss";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SettingProvider>
        <AppContents />
      </SettingProvider>
    </ThemeProvider>
  );
}

export default App;

function AppContents() {
  const [selectedImage, setSelectedImage] = useState<TSettingImage | null>(
    null
  );
  const { isLoading } = useSettingContext();
  const handleImageClick = useCallback(
    (image: TSettingImage) => {
      if (selectedImage === image) {
        setSelectedImage(null);
      } else {
        setSelectedImage(image);
      }
    },
    [selectedImage]
  );

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div className={styles.app}>
      <Left onImageClick={handleImageClick} selectedImage={selectedImage} />
      {selectedImage && <Right selectedImage={selectedImage} />}
    </div>
  );
}
