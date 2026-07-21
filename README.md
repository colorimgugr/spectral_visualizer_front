# Spectral Visualizer

Welcome to **Spectral Visualizer** — a web-based app to explore multispectral and hyperspectral images using deep zoom technology.  
You can see it live at [spectral-visualizer.vercel.app](https://spectral-visualizer.vercel.app/).

---

## 🧰 Part 1: Project setup & installation

### 🔧 Technologies used
This project was built with:

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Once UI](https://docs.once-ui.com/once-ui/quick-start)
- [Vercel](https://vercel.com/) (for deployment)
- [OpenSeaDragon](https://openseadragon.github.io/) (for deep zoom image viewing)

### 📦 How to install the project

1. **Install Git**  
   Download and install Git from [git-scm.com](https://git-scm.com/downloads)
   - After installation, check if it's correctly installed by opening a terminal and running:
   ```bash
   git --version
   ```
   
2. **Install Node.js**  
   Download and install Node.js from [nodejs.org](https://nodejs.org/) (recommended: LTS version).
    - After installation, check if it's correctly installed by opening a terminal and running:
   ```bash
   node --version
   ```
   
3. **Install Python**  
   Download and install Python from [python.org](https://www.python.org/downloads/). This is necessary to run the script to add the artwork's metadata.
   - During installation, make sure to check the box that says "Add Python to PATH".
   - After installation, check if it's correctly installed by opening a terminal and running:
   
   ```bash
   python --version
   ```
   📦 Install questionary

   Once Python is installed, run the following commands to install the required Python packages.
   - For Questionary:
   ```bash
   pip install questionary
   ```
   - For Pillow:
   ```bash
   pip install pillow   
   ```

   This package is used by the script to interactively create the artwork metadata.
     
5. **Clone the repository**  
   Open a terminal where you want to have your local repository and run:
   ```bash
   git clone https://github.com/colorimgugr/spectral_visualizer_front.git
   ```
   > ⚠️ If you receive an error and the folder is empty, move the location and don't put the project inside any cloud like Google Drive.

6. **Install the dependencies** 

   After downloading the repository, move to the project folder:
   ```bash
   cd [path_to_folder]/spectral_visualizer_front
   ```
   ```bash
   npm install
   ```
   > ⚠️ If you receive an error, try to execute the terminal as "Administrator".
   > 🪟 On Windows:
   > 1. Click the Start menu.
   > 2. Type cmd or Terminal.
   > 3. Right-click the result and select “Run as administrator”.
   > 
   > 🍎 On macOS or 🐧 Linux:
   > 1. Open the Terminal.
   > 2. Add sudo before the command you want to run:
   >    ```bash
   >    sudo npm run dev
   >    ```
   > 3. Enter your computer password when prompted.

## 🧰 Part 2: Preview and Publish the Website
### 🖥️ Preview the Website on Your Computer (Offline)

Running the website locally means you're launching the project on your own computer, so you can preview and test it before pushing any changes online.
1. Open a terminal in the root folder of the project 'spectral_visualizer_front'.
   ```bash
   cd [path_to_folder]
   ```
2. Run the following command to start the local preview:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to see it.

### 🚀 Publish the Website Online (Deployment)

This project is hosted online using **Vercel**, a platform that makes it easy to publish websites.
When you **push your code to GitHub**, Vercel automatically deploys (publishes) the latest version of the site online. 

You can check it here: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/colorimgs-projects/spectral-visualizer)

In the "Deployments" tab, you can find all the commits made.

> 💡 **How it works:**  
> Every time you **make changes**, **commit**, and **push** to GitHub, Vercel will:
> - Build your project  
> - Publish a new version of the website  
>
> You’ll see the status as **"Ready"** if the deployment is successful.  
> ⚠️ If there's an error (e.g., typo or bug), the deployment won't update — make sure the status shows **Ready** after each push!


---


## 🗃️ Part 3: Understanding the code
This section explains the project structure, how artwork images are classified, the folder organization, technical metadata, spectral files, and visualization modes. This is important when uploading new artworks or editing existing ones.


### 🖼️ Codes and Labels
You can find the codes and corresponding labels used in the project below.  
- The **codes** are used internally for folder names and program logic.  
- The **labels** are the user-friendly names displayed on the website.

- 👉 The full list of **codes** is in the [types.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/types.ts) file.
- 👉 The full list of **labels** is in the [labels.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/labels.ts) file.

> ⚠️ **Warning:** If you edit these files, be very careful! They contain critical data used throughout the entire project.


### 🖼️ Classification and nomenclature
Artwork images are classified by two criteria: **spectral type** and **spectral class**.
- **Spectral type** codes (used for subfolder names):  
  `"rgb" | "mono" | "hsi" | "msi"`
- **Spectral class** codes (used for further classification inside subfolders):  
  `"vnir" | "swir" | "uvis" | "pht" | "uvr" | "uvf" | "irrs" | "irrl"`

The spectral class helps define whether images are simple images, `.dzi` files with tiles, or false RGB images organized as:  
`[class]/[wavelength]nm.png`
These classifications are essential for the program to correctly identify and use the images.

> ⚠️ **Important:** Always use lowercase letters for these codes.

### 🗂️ Images folder structure
All artwork images are placed inside the [public/artworks/](https://github.com/colorimgugr/spectral_visualizer_front/tree/main/public/artworks) folder. Each artwork has its folder named by its artwork ID, following this structure `[artworkID]/[type]`:
  ```bash
    public/
    └── artworks/
        └── artworkId/
            ├── mono/
            │   └── irrl
            ├── rgb/
            │   ├── irrs
            │   ├── pht
            │   ├── uvf
            │   └── uvr
            ├── msi/
            │   ├── uvf
            │   │   └── 550nm.png
            │   └── vnir
            │       └── 550nm.png
            └── hsi/
                ├── swir
                │   └── 550nm.png
                └── vnir
                    └── 550nm.png
  ```

### 🖼️ Technical metadata
You can find the imaging techniques data in the [technicalMetadata.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/technicalMetadata.ts).


---
## 🖼 Part 4: Image visualization with OpenSeaDragon
This project uses **OpenSeaDragon** for image visualization. OpenSeaDragon can display simple images as PNG or JPG, but using large images without tiling can severely impact performance. 

As explained in the [OpenSeaDragon Zooming Images documentation](https://openseadragon.github.io/examples/creating-zooming-images/):

> *"OpenSeadragon works with a variety of zooming image formats. These zooming images generally consist of a number of individual tiles, organized so they can be accessed as needed. If you have a large image you'd like to zoom, you'll need to convert it first."*

In this project, the image tiles used are in **Deep Zoom Image (DZI)** format.
> For more info on simple images, see:  
> https://openseadragon.github.io/examples/tilesource-image/  
> For more info on Deep Zoom Images, see:  
> https://openseadragon.github.io/examples/tilesource-dzi/

### 📦 Convert to DZI format
To convert your images to DZI format, you can use [libvips](https://libvips.github.io/libvips/) or any other tool recommended by the [OpenSeaDragon Zooming Images documentation](https://openseadragon.github.io/examples/creating-zooming-images/).

> 💡 How to Install libvips on Windows
> libvips is a fast image processing library needed for the project to handle image transformations efficiently.
>
> 📥 Step-by-step Installation:
>
> 1. Go to the official website: [(https://libvips.github.io/libvips/)](https://libvips.github.io/libvips/)
> 2. Click on the “Download” tab.
> 3. Scroll down to the Windows binaries link.
> 4. Inside the "Assets", you'll find the vips-dev-w64-web-[version].zip to download
> 5. Download the zip file (e.g., Source code (zip)).
> 6. Unzip the file into a folder of your choice (e.g., C:\libvips).
> 
> ⚙️ Add libvips to your system PATH:
>
> 8. Open the Start menu, search for “Environment Variables”, and click on “Edit the system environment variables”.
> 9. In the System Properties window, click “Environment Variables…”.
> 10. Under System variables, find and select the variable called Path, then click Edit.
> 11. Click New, and paste the full path to the vips-dev-xxx\bin folder.
> 12. Click OK to close all windows.
> 
> ✅ To check that libvips is installed correctly:
> Open a new terminal and run:
> ```bash
>    vips --version
> ```

The original images can be PNG, JPG, or any format supported by libvips. Remember to assign the corresponding name to the output based on the class of the image.

Open a terminal in the same folder where the image is and run:
```bash
   vips dzsave [input_name].png [output_name]
```

> The output name is the name that the generated files will have

This command will generate:
   - A .dzi file
   - A folder with image tiles (used by OpenSeaDragon)
> ⚠️ Note about image rotation:
> If the converted image appears rotated, it's likely due to EXIF orientation metadata from your camera or phone.
> To fix this, apply autorotation before converting:
> ```bash
>    vips autorot input.png temp.png && vips dzsave temp.png output
> ```

## 🖼 Part 5: Upload artworks
Here’s how to prepare and upload the artwork data and imagery.

### 🧾 1. Prepare and add images
1. Fetch and download the current content from the remote repository (the one on GitHub). Open a terminal, make sure to be in the root folder of the project, and run:
  ```bash
  git pull
  ```
  > This command immediately updates the local repository to match that content.
2. Create a folder inside `public/artworks/` with the **artworkID** as the folder name.  
3. Inside that folder, create subfolders for the image types you want to include:
   - `rgb/`
   - `mono/`
   - `msi/`
   - `hsi/`  
   > Follow the folder structure shown [above](#images-folder-structure)
     
4. Image-specific instructions:
   #### ✅ For mono and rgb images
   These images are used for the **Single, Blend, and Compare** modes. They can be either simple images as `.png` or `.jpg`, or zooming images like a `.dzi` file and its folder.
   1. Place the image inside the corresponding type folder (`rgb` or `mono`) with the appropriate class name as the file name (`irrs`, `pht`, `uvf`, or `uvr` for `rgb`, and `irrl` for `mono`).   
   > See [Image Visualization with OpenSeaDragon](#part-3-image-visualization-with-openseadragon) for better understanding of the image fomat.

   #### 🌈 For msi and hsi:
   These images are used for the **FalseRGB** mode and can be in `.png` or `.jpg` format.
   1. Create a subfolder for the spectral class inside the `msi/` or `hsi/` folder, for example:  
   - `vnir/`  
   - `uvis/`  
   - `swir/`  
   2. Inside these subfolders, add your images named with their wavelength, e.g.:
   	`450nm.png, 550nm.jpg, 680nm.png`

   
### 🧪 2. Create the artwork metadata
After placing the images, it's necessary to **connect them with metadata** so the program can correctly load and display them. This is done by generating a **spectral file** that contains paths and technical data about each image.

1. Run the following Python script from the project root to generate the TypeScript metadata file:
  ```bash
  python build_spectral_file.py
  ```
This will:
- ✅ Generate a file in `src/app/resources/artworks/[artworkID].ts`
- ✅ Automatically register the artwork in [allArtworks.ts] (https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/allArtworks.ts).

> 💡 You can manually edit the generated file to update any metadata. All artwork metadata files are located in [src/app/resources/artworks/](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/artworks).

#### 🖋 Update the Artwork Metadata

If you want to **update** the metadata of an existing artwork, you have two options:

**Option A – Edit directly on GitHub**  
1. Navigate to the artwork metadata file (e.g., [`src/app/resources/artworks/[artworkID].ts`](https://github.com/colorimgugr/spectral_visualizer_front/tree/main/src/app/resources/artworks)).
2. Click the ✏️ **pencil icon** in the top-right corner of the file view to enter edit mode.
3. Make your changes.
4. Click **"Commit changes"** to save.

**Option B – Edit locally and push**
1. First, make sure your local repository is up to date. Open a terminal in the root folder of the project and run:
   ```bash
   git pull
   git status
   ```
   > ⚠️ Always pull and check your status to avoid merge conflicts and ensure you're working on the latest version of the repository.
2. Open the file in your local repository using your preferred code editor.
3. Make and save your changes.
4. Follow the steps described in the [Upload Everything to GitHub](#upload-everything-to-github) section to push your changes.

#### 🧹 Temporarily removing an artwork
If you want to **temporarily remove** an artwork, follow these steps:
1. ❌ Delete or move its image folder from `public/artworks`.
2. ❌ Comment the import of the artwork from [allArtworks.ts] (use //).
3. ❌ Remove its ID from the [allArtworks.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/allArtworks.ts) list.

> ✅ To restore it later, just:
> 1. Place the image folder back into `public/artworks/`.
> 2. Add its ID back to [allArtworks.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/allArtworks.ts)
> No need to regenerate the spectral file unless you’ve made changes to the metadata.


### ☁️ 3. Upload Everything to GitHub
Once you’ve added your images and metadata, and confirmed everything works correctly **locally**. Then, open a terminal in the root folder of the project and follow these steps to upload your changes to GitHub:
1. Stage all the new and modified files:
   ```bash
   git add .
   ```
2. Commit your changes with a clear and descriptive message:
  ```bash
  git commit -m "Message here"
  ```
3. Upload your local commits to the remote GitHub repository: 
  ```bash
  git push
  ```
4. ✅ Make sure all your changes are reflected on the live website:
   - Go to the **Deployment** section and confirm that the latest commit is marked as **"Ready"**.
   - Then, visit the final website to verify that everything looks and works as expected.
5. Check how much space you have left [here](https://github.com/settings/repositories).

> 📘 For more details on using Git and GitHub, visit the official documentation:
[https://docs.github.com/en/get-started](https://docs.github.com/en/get-started)

## 🔍 Part 6: Stitched compare mode
The **Stitched compare** mode places **two synchronized viewers side by side** so you
can inspect two modalities of the same artwork at the same spot, at the same
magnification, at once — for example a **VIS panorama** on the left and a **HSI
band** on the right. Panning or zooming either panel drives the other, and a
crosshair mirrors your cursor from one panel into the other.

### 🧭 When the mode appears
The **Stitched compare** option shows up in the visualization-mode selector for any
artwork that has **at least two panel-eligible images** — that is, two images that
each have either a direct `source` (a `.dzi`/`.png`/`.jpg`) or an `hsi`/`msi` band
stack (`path` + `names`). No extra flag is required.

### 🎯 How the two panels stay aligned
Each image can carry an optional `align` block in its metadata:

```ts
align: {
  ref: "VIS",          // name of the shared reference frame
  H:   [ /* 9 numbers */ ]  // row-major 3×3 homography: THIS image px → ref px
}
```

- **Registered sync** — when both selected images share the same `align.ref`, the
  app composes the pairwise homography `H = inv(H_right) · H_left` and syncs the
  viewports through it, so features line up pixel-accurately even when the two
  modalities differ in resolution or were captured at different scales.
- **Proportional sync (fallback)** — when alignment data is missing, the panels are
  synced by simple width/height proportion. The mode still works, but the UI notes
  that *“alignment is approximate.”*

### 🛠️ Preparing an artwork with alignment (`prepare_compare.py`)
For stitched multi-modal artworks produced by the **hsi_stitcher** pipeline, the
helper script `prepare_compare.py` generates everything in one step:

```bash
python prepare_compare.py --id inmaculada --name "Inmaculada" \
    --modality VIS:"../Output/VIS" --modality HSI:"../Output/HIS":vnir \
    --ref VIS
```

It will:
1. Export display assets under `public/artworks/<id>/` (a **DZI pyramid** for the
   large VIS/RGB mosaic; per-band `<wavelength>nm.png` files for HSI/MSI cubes).
2. Compute each modality's registration homography into the reference frame
   (from the stitcher's `placement.json` when available, SIFT between previews as a
   fallback, or proportional scaling as a last resort).
3. Write `src/app/resources/artworks/<id>.ts` and register it in `allArtworks.ts`.

> 🔄 **Orientation:** assets are shown exactly as stored. If an artwork should be
> displayed upright (portrait) but the stitched mosaic is landscape, rotate the VIS
> mosaic **and** every HSI band by the same amount, then transform the homography by
> the same rotation (`H' = R_ref · H · R_imgᐟ¹`) so registration is preserved. The
> `inmaculada` artwork ships already rotated 90° clockwise to portrait.

## License
Distributed under the MIT License. See LICENSE.txt for more information.
